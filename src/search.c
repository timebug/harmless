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
            return -(19990 + depth);
        } else {
            return 19990 + depth;
        }
    }

    if (b_king == 0) {
        if (side == BLACK) {
            return -(19990 + depth);
        } else {
            return 19990 + depth;
        }
    }

    return 0;
}

static int nega_max(int depth)
{
    int over, count, score;
    int current = -20000;
    
    over = is_game_over(depth);
    
    if (over)
        return over;

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

void think_depth(int depth)
{
    long best;

    best_move.from = 0;
    best_move.to = 0;
    
    max_depth = depth;
    nega_max(depth);
    
    if (best_move.from == 0) {
        printf("nobestmove\n");
    } else {
        best = move_to_str(best_move);
        printf("bestmove %.4s\n", (const char *)&best);
    }

    fflush(stdout);
}
