#ifndef GENMOVES_H
#define GENMOVES_H

#include "base.h"
#include "position.h"

/* 吃子走法价值 */
#define KING_VALUE 8
#define ADVISOR_VALUE 2
#define BISHOP_VALUE 2
#define KNIGHT_VALUE 4
#define ROOK_VALUE 6
#define CANNON_VALUE 4
#define PAWN_VALUE 2

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

/* 生成当前局面所有走法 */
int gen_all_move(move *move_array);
/* 生成当前局面所有吃子走法 */
int gen_cap_move(move *move_array);
/* 生成当前局面所有不吃子走法 */
int gen_non_cap_move(move *move_array);

#endif
