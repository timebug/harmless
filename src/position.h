#ifndef POSITION_H
#define POSITION_H

#include "base.h"
#include "hash.h"

extern int side;
extern BYTE board[];
extern BYTE piece[];
extern BYTE piece_type[];

void change_side();
void arr_to_fen(char *fen_str);
void fen_to_arr(const char *fen_str);
move str_to_move(long str);
long move_to_str(move mv);

#endif
