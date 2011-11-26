#ifndef BASE_H
#define BASE_H

#define RED 0
#define BLACK 1

#define KING 0
#define ADVISOR 1
#define BISHOP 2
#define KNIGHT 3
#define ROOK 4
#define CANNON 5
#define PAWN 6

#define INFINITE 20000
/* 最大搜索棋局深度 */
#define MAX_SEARCH_DEPTH 50

typedef unsigned char BYTE;

typedef struct {
    BYTE from;
    BYTE to;
    BYTE capture;
} move;

#endif
