#include <stdio.h>
#include "search.h"

static int max_depth;
static move best_move;

static void change_side()
{
    side = 1 - side;
}

void make_move(move *mv)
{
    BYTE pc1, pc2;

    pc1 = board[mv->from];
    pc2 = board[mv->to];

    if (pc2) {
        mv->capture = pc2;
        piece[pc2] = 0;
    }

    board[mv->from] = 0;
    board[mv->to] = pc1;

    piece[pc1] = mv->to;

    change_side();
}

static void unmake_move(move *mv)
{
    BYTE pc1, pc2;

    pc1 = board[mv->to];
    pc2 = mv->capture;

    if (pc2) {
        mv->capture = 0;
        piece[pc2] = mv->to;
    }

    board[mv->from] = pc1;
    board[mv->to] = pc2;

    piece[pc1] = mv->from;

    change_side();
}

/* 负极大值搜索
 * 极限深度：3层 */
static int nega_max(int depth);

/* 带AlphaBeta剪枝的负极大值搜索
 * 极限深度：4层 */
static int alpha_beta(int depth, int alpha, int beta);

/* TODO: PVS */
/* TODO: 置换表 */
/* TODO: 循环检测 */
/* fix: 最佳走法为空时提前认输，此时仍有子可以动 */

void think_depth(int depth)
{
    long best;
    best_move.from = 0;
    best_move.to = 0;
    max_depth = depth;

    /* nega_max(depth); */
    alpha_beta(depth, -INFINITE, INFINITE);
    
    if (best_move.from == 0) {
        printf("nobestmove\n");
    } else {
        best = move_to_str(best_move);
        printf("bestmove %.4s\n", (const char *)&best);
    }

    fflush(stdout);
}

static int alpha_beta(int depth, int alpha, int beta)
{
    int over, count, score;
    
    if (depth <= 0)
        return evaluate();
    
    /* 生成当前局面的所有走法 */
    count = gen_all_move(depth);

    int i;
    for (i = 0; i < count; i++) {
        
        make_move(&move_list[depth][i]);
        score = -alpha_beta(depth-1, -beta, -alpha);
        unmake_move(&move_list[depth][i]);

        /* beta剪枝 */
        if (alpha >= beta)
            break;

        if (score > alpha) {
            alpha = score;

            /* 靠近根节点时保留最佳走法 */
            if (depth == max_depth) {
                best_move = move_list[depth][i];
            }
        }
    }

    /* 返回极大值 */
    return alpha;
}

static int nega_max(int depth)
{
    int over, count, score;
    int current = -20000;
    
    if (depth <= 0)
        return evaluate();

    count = gen_all_move(depth);

    int i;

    for (i = 0; i < count; i++) {
        
        make_move(&move_list[depth][i]);
        score = - nega_max(depth - 1);
        unmake_move(&move_list[depth][i]);

        if (score > current) {
            current = score;
            if (depth == max_depth) {
                best_move = move_list[depth][i];
            }
        }
    }

    return current;
}
