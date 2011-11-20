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

/* TODO: 循环检测 */
/* TODO: 置换表 */
static int alpha_beta(int depth, int alpha, int beta)
{
    int over, count, score;
    
    if (depth <= 0)
        return evaluate();

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

                long tmp = move_to_str(best_move);
                FILE *fd;
                fd = fopen("harmless.log", "a");
                fprintf(fd, "i = %d\tdepth = %d\tscore = %d\t%.4s\n",
                        i, depth, score, (const char *)&tmp);
                fclose(fd);
            }
        }
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

        FILE * fd;
        fd = fopen("harmless.log", "a");
        fprintf(fd, ">> bestmove = %.4s\n", (const char *)&best);
        fclose(fd);
    }

    fflush(stdout);
}
