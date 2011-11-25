#ifndef EVALUATE_H
#define EVALUATE_H

#include "base.h"
#include "position.h"
#include "genmoves.h"

#define F_KING 2
#define F_ADVISOR 2
#define F_BISHOP 2
#define F_KNIGHT 5
#define F_ROOK 4
#define F_CANNON 3
#define F_PAWN 2

extern BYTE piece_type[];

int evaluate();

#endif
