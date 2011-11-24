#include <stdio.h>
#include "search.h"

#include <sys/time.h>
#include <unistd.h>

move move_array[32][128];

static int max_depth;
static move best_move;

static int node_count;

static void change_side()
{
    side = 1 - side;

    /* hash */
    /* zobrist_key ^= zobrist_player; */
    /* zobrist_key_check ^= zobrist_player_check; */
    /* end */
}

static BYTE make_move(move *mv)
{
    BYTE pc1, pc2, pt;

    pc1 = board[mv->from];
    pc2 = board[mv->to];

    /* 目的地有其它子存在 */
    if (pc2) {
        piece[pc2] = 0;

        /* hash */
        /* pt = piece_type[pc2]; */
        /* if (pc2 >= 32) */
        /*     pt += 7; */
        
        /* zobrist_key ^= zobrist_table[pt][mv->to]; */
        /* zobrist_key_check ^= zobrist_table_check[pt][mv->to]; */
        /* end */
    }

    board[mv->from] = 0;
    board[mv->to] = pc1;
    piece[pc1] = mv->to;

    /* hash */
    /* pt = piece_type[pc1]; */
    /* if (pc1 >= 32) */
    /*     pt += 7; */

    /* zobrist_key ^= zobrist_table[pt][mv->to] ^ */
    /*     zobrist_table[pt][mv->from]; */
    /* zobrist_key_check ^= zobrist_table_check[pt][mv->to] ^ */
    /*     zobrist_table_check[pt][mv->from]; */
    /* end */

    change_side();

    return pc2;
}

static void unmake_move(move *mv, BYTE type)
{
    BYTE pc1, pc2;

    pc1 = board[mv->to];
    pc2 = type;

    if (pc2) {
        piece[pc2] = mv->to;

        /* hash */
        /* pt = piece_type[pc2]; */
        /* if (pc2 >= 32) */
        /*     pt += 7; */

        /* zobrist_key ^= zobrist_table[pt][mv->to]; */
        /* zobrist_key_check ^= zobrist_table_check[pt][mv->to]; */
        /* end */
    }

    board[mv->from] = pc1;
    board[mv->to] = pc2;
    piece[pc1] = mv->from;

    /* hash */
    /* pt = piece_type[pc1]; */
    /* if (pc1 >= 32) */
    /*     pt += 7; */

    /* zobrist_key ^= zobrist_table[pt][mv->from] ^ */
    /*     zobrist_table[pt][mv->to]; */
    /* zobrist_key_check ^= zobrist_table_check[pt][mv->from] ^ */
    /*     zobrist_table_check[pt][mv->to]; */
    /* end */

    change_side();
}

static int is_game_over(int depth)
{
    BYTE r_king = piece[16];
    BYTE b_king = piece[32];
    
    int i = (max_depth - depth + 1) % 2;

    if (!r_king) {
        if (i)
            return OVER_VALUE + depth;
        else
            return -OVER_VALUE - depth;
    }

    if (!b_king) {
        if (i)
            return -OVER_VALUE - depth;
        else
            return OVER_VALUE + depth;
    }

    return 0;
}

/* 极小窗口搜索(Minimal Window Search/PVS) */
static int principal_variation_search(int depth, int alpha, int beta);

/* TODO: 置换表 */
/* TODO: 循环检测 */
/* fix: 最佳走法为空时提前认输，此时仍有子可以动 */

void think_depth(int depth)
{
    long best;
    best_move.from = 0;
    best_move.to = 0;
    
    max_depth = depth;

    struct timeval start, end;
    int timeuse;
    node_count = 0;
    
    gettimeofday(&start, NULL);
    
    /* alpha_beta_search(depth, -INFINITE, INFINITE); */
    principal_variation_search(depth, -INFINITE, INFINITE);

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
        fprintf(fd, ">> bestmove = %.4s\tnode = %d\tusetime = %dms\n",
                (const char *)&best, node_count, timeuse);
        fclose(fd);
    }

    fflush(stdout);
}

static int principal_variation_search(int depth, int alpha, int beta)
{
    int score, count, over, best;
    BYTE type;

    /* 检查当前节点是否已分出胜负 */
    over = is_game_over(depth);
    if (over)
        return over;

    /* 叶子节点取估值 */
    if (depth <= 0) {
        node_count++;
        return evaluate();
    }
    
    /* 产生下一步所有的可能的走法 */
    count = gen_all_move(move_array[depth]);

    /* 产生第一个节点 */
    type = make_move(&move_array[depth][0]);
    /* 使用全窗口搜索第一个节点 */
    best = -principal_variation_search(depth-1, -beta, -alpha);
    unmake_move(&move_array[depth][0], type);

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
            type = make_move(&move_array[depth][i]);
            
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
            unmake_move(&move_array[depth][i], type);
        }
    }

    return best;
}
