#ifndef POSITION_H
#define POSITION_H

#include "base.h"

extern int side;
extern BYTE board[];
extern BYTE piece[];

void arr_to_fen(char *fen_str);
void fen_to_arr(const char *fen_str);
move str_to_move(long str);
long move_to_str(move mv);

#endif
