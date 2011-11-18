#ifndef SEARCH_H
#define SEARCH_H

#include "base.h"
#include "position.h"
#include "genmoves.h"
#include "evaluate.h"

void make_move(move *mv);
void think_depth(int depth);

#endif
