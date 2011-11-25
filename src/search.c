#include <stdio.h>
#include <sys/time.h>
#include <unistd.h>

#include "search.h"

static move move_array[MAX_SEARCH_DEPTH][128]; /* 所有走法 */

static int max_depth;
static move best_move;

static int eval_node_count;
static int hash_node_count;

static void change_side()
{
    side = 1 - side;

    /* hash */
    zobrist_key ^= zobrist_player;
    zobrist_key_check ^= zobrist_player_check;
    /* end */
}

static void make_move(move *mv)
{
    BYTE pc1, pc2, pt;

    pc1 = board[mv->from];
    pc2 = board[mv->to];
    mv->capture = pc2;

    /* 目的地有其它子存在 */
    if (pc2) {
        piece[pc2] = 0;

        /* hash */
        pt = piece_type[pc2];
        if (pc2 >= 32)
            pt += 7;
        
        zobrist_key ^= zobrist_table[pt][mv->to];
        zobrist_key_check ^= zobrist_table_check[pt][mv->to];
        /* end */
    }

    board[mv->from] = 0;
    board[mv->to] = pc1;
    piece[pc1] = mv->to;

    /* hash */
    pt = piece_type[pc1];
    if (pc1 >= 32)
        pt += 7;

    zobrist_key ^= zobrist_table[pt][mv->to] ^
        zobrist_table[pt][mv->from];
    zobrist_key_check ^= zobrist_table_check[pt][mv->to] ^
        zobrist_table_check[pt][mv->from];
    /* end */

    change_side();
}

static void unmake_move(move *mv)
{
    BYTE pc1, pc2, pt;

    pc1 = board[mv->to];
    pc2 = mv->capture;

    if (pc2) {
        piece[pc2] = mv->to;

        /* hash */
        pt = piece_type[pc2];
        if (pc2 >= 32)
            pt += 7;

        zobrist_key ^= zobrist_table[pt][mv->to];
        zobrist_key_check ^= zobrist_table_check[pt][mv->to];
        /* end */
    }

    board[mv->from] = pc1;
    board[mv->to] = pc2;
    piece[pc1] = mv->from;

    /* hash */
    pt = piece_type[pc1];
    if (pc1 >= 32)
        pt += 7;

    zobrist_key ^= zobrist_table[pt][mv->from] ^
        zobrist_table[pt][mv->to];
    zobrist_key_check ^= zobrist_table_check[pt][mv->from] ^
        zobrist_table_check[pt][mv->to];
    /* end */

    change_side();
}

/* 极小窗口搜索(Minimal Window Search/PVS) */
/* 极限深度：5层 */
static int principal_variation_search(int depth, int alpha, int beta);

/* PVS + TT(置换表) + HH(历史启发) */
/* 极限深度：6层 */
static int nega_scout(int depth, int alpha, int beta);

/* TODO: 循环检测 */
/* TODO: 迭代深化 */
/* TODO: 静态搜索 */
/* TODO: 增加开局库 */
/* fix: 最佳走法为空时提前认输，此时仍有子可以动 */

void think_depth(int depth)
{
    long best;
    best_move.from = 0;
    best_move.to = 0;
    
    max_depth = depth;
    
    reset_hash_table();
    reset_history();

    struct timeval start, end;
    int timeuse;
    
    eval_node_count = 0;
    hash_node_count = 0;
    
    gettimeofday(&start, NULL);
    
    /* principal_variation_search(depth, -INFINITE, INFINITE); */
    nega_scout(depth, -INFINITE, INFINITE);

    gettimeofday(&end, NULL);
    timeuse = 1000000 * ( end.tv_sec - start.tv_sec ) +
        end.tv_usec - start.tv_usec;
    timeuse /= 1000;
    
    if (best_move.from == 0) {
        printf("nobestmove\n");
    } else {
        best = move_to_str(best_move);
        printf("bestmove %.4s\n", (const char *)&best);

        FILE * fd;
        fd = fopen("harmless.log", "a");
        fprintf(fd, "bestmove = %.4s eval_node = %-8d hash_node = %-8d "
                "usetime = %dms\n",
                (const char *)&best, eval_node_count, hash_node_count, timeuse);
        fclose(fd);
    }

    fflush(stdout);
}

static int nega_scout(int depth, int alpha, int beta)
{
    int score, count;
    int a, b, t, i;

    score = read_hash_table(depth, alpha, beta);
    if (score != NOVALUE) {
        hash_node_count++;
        return score;
    }

    if (depth <= 0) {
        score = evaluate();
        eval_node_count++;
        save_hash_table(score, depth, HASH_EXACT);
        return score;
    }

    count = move_array_init(move_array[depth]);

    int best = -1;
    a = alpha;
    b = beta;
    int eval_is_exact = 0;

    for (i = 0; i < count; i++) {
        make_move(&move_array[depth][i]);
        
        t = -nega_scout(depth-1, -b, -a);
        
        if (t > a && t < beta && i > 0) {
            
            a = -nega_scout(depth-1, -beta, -t);
            eval_is_exact = 1;
            
            if (depth == max_depth) {
                best_move = move_array[depth][i];
            }
            best = i;
        }

        unmake_move(&move_array[depth][i]);

        if (a < t) {
            eval_is_exact = 1;
            a = t;
            
            if (depth == max_depth) {
                best_move = move_array[depth][i];
            }
        }

        if (a >= beta) {
            save_hash_table(a, depth, HASH_BETA);
            save_history(&move_array[depth][i], depth);
            return a;
        }

        b = a + 1;
    }

    save_history(&move_array[depth][best], depth);

    if (eval_is_exact)
        save_hash_table(a, depth, HASH_EXACT);
    else
        save_hash_table(a, depth, HASH_ALPHA);

    return a;
}

static int principal_variation_search(int depth, int alpha, int beta)
{
    int score, count, best;

    /* 叶子节点取估值 */
    if (depth <= 0) {
        eval_node_count++;
        return evaluate();
    }
    
    /* 产生下一步所有的可能的走法 */
    count = gen_all_move(move_array[depth]);

    /* 产生第一个节点 */
    make_move(&move_array[depth][0]);
    /* 使用全窗口搜索第一个节点 */
    best = -principal_variation_search(depth-1, -beta, -alpha);
    unmake_move(&move_array[depth][0]);

    if (count != 0) {
        if (depth == max_depth)
            best_move = move_array[depth][0];
    }
    
    int i;
    for (i = 1; i < count; i++) {
        /* 如果不能beta剪枝 */
        if (best < beta) {
            if (best > alpha)
                alpha = best;
            
            /* 产生子节点 */
            make_move(&move_array[depth][i]);
            
            /* 使用极窄窗口搜索 */
            score = -principal_variation_search(depth-1, -alpha-1, -alpha);
            
            if (score > alpha && score < beta) {
                /* fail high. 重新搜索 */
                best = -principal_variation_search(depth-1, -beta, -score);
                if (depth == max_depth)
                    best_move = move_array[depth][i];
                
            } else if (score > best) {
                /* 极窄窗口命中 */
                best = score;
                if (depth == max_depth)
                    best_move = move_array[depth][i];
            }
            /* 撤销子节点 */
            unmake_move(&move_array[depth][i]);
        }
    }

    return best;
}
