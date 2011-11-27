#ifndef SEARCH_H
#define SEARCH_H

#include "base.h"
#include "position.h"
#include "genmoves.h"
#include "movesort.h"
#include "evaluate.h"
#include "openbook.h"
#include "hash.h"

/* 每步最长时间 */
#define LONGEST_SEARCH_TIME 5000
#define TIME_OVER -65432

void think_depth(int depth);

#endif
