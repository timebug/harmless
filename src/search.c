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

static int is_game_over(int depth)
{
    BYTE r_king = piece[16];
    BYTE b_king = piece[32];

    if (r_king == 0) {
        if (side == RED) {
            return -(OVER_VALUE + depth);
        } else {
            return OVER_VALUE + depth;
        }
    }

    if (b_king == 0) {
        if (side == BLACK) {
            return -(OVER_VALUE + depth);
        } else {
            return OVER_VALUE + depth;
        }
    }

    return 0;
}

static int nega_max(int depth)
{
    int over, count, score;
    int current = -INFINITE;
    
    over = is_game_over(depth);
    
    if (over)
        return over;

    if (depth <= 0)
        return evaluate();

    count = gen_all_move(depth);

    int i;

    for (i = 0; i < count; i++) {
        
        make_move(&move_list[depth][i]);
        score = -nega_max(depth - 1);
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

/* TODO: 循环检测 */

static int alpha_beta(int depth, int alpha, int beta)
{
    int over, count, score;
    
    over = is_game_over(depth);
    
    if (over)
        return over;

    if (depth <= 0)
        return evaluate();

    count = gen_all_move(depth);

    int i;

    for (i = 0; i < count; i++) {
        
        make_move(&move_list[depth][i]);
        score = -alpha_beta(depth-1, -beta, -alpha);
        unmake_move(&move_list[depth][i]);

        if (score > alpha) {
            alpha = score;
            /* 靠近根节点时保留最佳走法 */
            if (depth == max_depth) {
                best_move = move_list[depth][i];
            }
        }

        /* beta剪枝 */
        if (alpha >= beta)
            break;
    }

    /* 返回极大值 */
    return alpha;
}

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
