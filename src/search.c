#include <stdio.h>
#include <string.h>

#ifdef _WIN32

#include "windows.h"

#else

#include <sys/time.h>
#include <unistd.h>

#endif

#include "search.h"

static move move_array[MAX_SEARCH_DEPTH][128]; /* 所有走法 */

/* 记录历史哈希局面 */
static INT32_ hash_history[MAX_SEARCH_DEPTH];

/* 记录4步历史最佳走法，避免出现长将等循环走法 */
static move move_history[4];

static move best_move;
static move better_move;
static move good_move;

static int max_depth;

/* 统计相关结点 */
static int eval_node_count;
static int hash_node_count;
static int dead_node_count;

static time_t starttime;

move NULL_MOVE;

/* 当前搜索步数 */
int cur_step;

#ifdef _WIN32

static unsigned long get_tick_count()
{
    return GetTickCount();
}

#else

static unsigned long get_tick_count()
{
    struct timeval tv;
    if (gettimeofday(&tv, NULL) != 0)
        return 0;
 
    return (tv.tv_sec * 1000) + (tv.tv_usec / 1000);
}

#endif

static void init_search()
{
    cur_step = 0;

    reset_hash_table();
    reset_history();

    eval_node_count = 0;
    hash_node_count = 0;
    dead_node_count = 0;

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

    cur_step++;
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

    cur_step--;
}

/* 极小窗口搜索(Minimal Window Search/PVS) */
static int principal_variation_search(int depth, int alpha, int beta);

/* PVS + TT(置换表) + HH(历史启发) */
static int nega_scout(int depth, int alpha, int beta);

void think(int depth)
{
    long best;
    max_depth = depth;
    best_move = NULL_MOVE;

    int i;
    int count = move_array_init(move_array[MAX_SEARCH_DEPTH - 1], NULL_MOVE);
    if (count != 0) {
        best_move = better_move = good_move =
            move_array[MAX_SEARCH_DEPTH - 1][0];
        
    } else {
        printf("nobestmove\n");
        fflush(stdout);
        return;
    }

    /* 搜索开局库 */
    move book_move = read_openbook();
    if (!cmp_move(book_move, NULL_MOVE)) {
        best = move_to_str(book_move);
        printf("bestmove %.4s\n", (const char *)&best);
        fflush(stdout);
        move_history[0] = move_history[1];
        move_history[1] = move_history[2];
        move_history[2] = move_history[3];
        move_history[3] = book_move;

#ifdef DEBUG_LOG        
        fprintf(logfile, ">> bestmove(openbook) = %.4s\n", (const char *)&best);
        fflush(logfile);
#endif
        
        return;
    }

    init_search();

    /* 开始迭代深化 */
    starttime = get_tick_count();
    move backupmove = NULL_MOVE;
    
    for (max_depth = 1; max_depth <= MAX_SEARCH_DEPTH; max_depth++) {

        int value = nega_scout(max_depth, -INFINITE_, INFINITE_);
        
        if (value != TIME_OVER) {
            backupmove = best_move;
        } else {
            break;
        }
    }

    best_move = backupmove;
    
    /* principal_variation_search(depth, -INFINITE_, INFINITE_); */
    /* nega_scout(max_depth, -INFINITE_, INFINITE_); */

    int timeuse;
    timeuse = get_tick_count() - starttime;

    int flag = 0;
    if (cmp_move(move_history[0] , move_history[2]) &&
        cmp_move(move_history[2] , best_move)) {
        if (cmp_move(move_history[0] , move_history[2]) &&
            cmp_move(move_history[2] , better_move)) {

            if (cmp_move(move_history[0], move_history[2]) &&
                cmp_move(move_history[2], good_move)) {

                if (count != 1) {
                    for (i = 0; i < count; i++) {
                        if (!cmp_move(move_array[MAX_SEARCH_DEPTH - 1][i], good_move)) {
                            good_move = move_array[MAX_SEARCH_DEPTH - 1][i];
                        }
                    }
                } else {
                    printf("nobestmove\n");
                    fflush(stdout);
                    return;
                }
            }
            
            move_history[0] = move_history[1];
            move_history[1] = move_history[2];
            move_history[2] = move_history[3];
            move_history[3] = good_move;
            best = move_to_str(good_move);
                
            flag = 3;

        } else {
            move_history[0] = move_history[1];
            move_history[1] = move_history[2];
            move_history[2] = move_history[3];
            move_history[3] = better_move;
            best = move_to_str(better_move);

            flag = 2;
        }
    } else {
        move_history[0] = move_history[1];
        move_history[1] = move_history[2];
        move_history[2] = move_history[3];
        move_history[3] = best_move;
        best = move_to_str(best_move);

        flag = 1;
    }

    printf("bestmove %.4s\n", (const char *)&best);
    fflush(stdout);

#ifdef DEBUG_LOG
    fprintf(logfile, ">> depth = %-2d bestmove(%d) = %.4s eval = %-8d "
            "hash = %-8d dead = %-3d time = %dms\n",
            max_depth-1,
            flag,
            (const char *)&best,
            eval_node_count,
            hash_node_count,
            dead_node_count,
            timeuse);
    fflush(logfile);
#endif
    
}

/* 静态搜索函数 */
static int quiescence_search(int alpha, int beta)
{
    int score = evaluate();
    if (score >= beta)
        return score;

    move move_arr[128];
    int count = cap_move_array_init(move_arr);
    if (count == 0)
        return -INFINITE_ + cur_step;
    
    int i;
    for (i = 0; i < count; i++) {
        make_move(&move_arr[i]);
        score = -quiescence_search(-beta, -alpha);
        unmake_move(&move_arr[i]);

        if (score >= alpha) {
            alpha = score;
            /* beta剪枝 */
            if (score >= beta)
                break;
        }
    }

    return score;
}

static int nega_scout(int depth, int alpha, int beta)
{
    int score, count;
    int a, b, t, i, j;
    move hash_move = NULL_MOVE;

    /* 用哈希历史局面防止产生循环局面 */
    hash_history[depth] = zobrist_key;
    for (j = max_depth; j > depth; j--) {
        if (hash_history[j] == hash_history[depth]) {
            return -INFINITE_;
        }
    }

    /* 读取哈希表 */
    score = read_hash_table(depth, alpha, beta, &hash_move);
    if (score != NOVALUE) {
        hash_node_count++;
        return score;
    }

    if (depth <= 0) {
        score = quiescence_search(alpha, beta);
        /* score = evaluate(); */
        eval_node_count++;
        save_hash_table(score, depth, HASH_EXACT, NULL_MOVE);
        return score;
    }

    count = move_array_init(move_array[depth], hash_move);
    if (count == 0) {
        dead_node_count++;
        return -INFINITE_ + cur_step;
    }
    
    /* 将上次迭代的最佳走法设置为走法数组的第一位 */
    if (depth == max_depth && max_depth > 1) {
        for (i = 1; i < count; i++) {
            if (cmp_move(move_array[depth][i], best_move)) {
                move_array[depth][i] = move_array[depth][0];
                move_array[depth][0] = best_move;
            }
        }
    }

    int best = -1;
    a = alpha;
    b = beta;
    int eval_is_exact = 0;

    for (i = 0; i < count; i++) {

        if (depth == max_depth) {
            if (get_tick_count() - starttime >= LONGEST_SEARCH_TIME)
                return TIME_OVER;
        }
        
        make_move(&move_array[depth][i]);
        t = -nega_scout(depth-1, -b, -a);
        
        if (t > a && t < beta && i > 0) {
            
            a = -nega_scout(depth-1, -beta, -t);
            eval_is_exact = 1;
            
            if (depth == max_depth) {
                good_move = better_move;
                better_move = best_move;
                best_move = move_array[depth][i];
            }
            
            best = i;
            hash_move = move_array[depth][i];
        }

        unmake_move(&move_array[depth][i]);

        if (a < t) {
            eval_is_exact = 1;
            a = t;
            
            if (depth == max_depth) {
                good_move = better_move;
                better_move = best_move;
                best_move = move_array[depth][i];
            }
        }

        if (a >= beta) {
            save_hash_table(a, depth, HASH_BETA, move_array[depth][i]);
            save_history(move_array[depth][i], depth);
            return a;
        }

        b = a + 1;
    }

    if (best != -1) {
        save_history(move_array[depth][best], depth);
    }

    if (eval_is_exact)
        save_hash_table(a, depth, HASH_EXACT, hash_move);
    else
        save_hash_table(a, depth, HASH_ALPHA, hash_move);

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
