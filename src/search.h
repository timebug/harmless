#ifndef SEARCH_H
#define SEARCH_H

#include "base.h"
#include "position.h"
#include "genmoves.h"
#include "movesort.h"
#include "evaluate.h"
#include "hash.h"

#define INFINITE 20000
/* 最大搜索棋局深度 */
#define MAX_SEARCH_DEPTH 16
/* 表示当前局面是死局面的评估值 */
#define NO_BEST_MOVE -20000

void think_depth(int depth);

#endif
