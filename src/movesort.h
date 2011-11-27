#ifndef MOVESORT_H
#define MOVESORT_H

#include "base.h"
#include "position.h"
#include "genmoves.h"

#define HISTORY_SIZE 65536

/* 历史表 */
extern int history[];

int cmp_move(move m1, move m2);
void reset_history();
void save_history(move *mv, int depth);
int move_array_init(move *move_array, move hash_move);
int cap_move_array_init(move *move_array);

#endif
