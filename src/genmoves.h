#ifndef GENMOVES_H
#define GENMOVES_H

#include "base.h"
#include "position.h"

extern short king_dir[];
extern short advisor_dir[];
extern short bishop_dir[];
extern short knight_dir[];
extern short rook_dir[];
extern short cannon_dir[];
extern short pawn_dir[][8];
extern short knight_check[];
extern short bishop_check[];

extern BYTE legal_position[][256];
extern BYTE position_mask[];

extern move move_list[][128];

int gen_all_move(int depth);

#endif
