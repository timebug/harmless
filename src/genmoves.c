#include "genmoves.h"

static int move_count;

move move_list[8][128];

short king_dir[8]    = {-0x10, -0x01, +0x01, +0x10,  0,       0,	   0,	  0   };
short advisor_dir[8] = {-0x11, -0x0f, +0x0f, +0x11,  0,	    0,	   0,	  0   };
short bishop_dir[8]  = {-0x22, -0x1e, +0x1e, +0x22,  0,	    0,	   0,	  0   };
short knight_dir[8]  = {-0x21, -0x1f, -0x12, -0x0e, +0x0e,   +0x12, +0x1f, +0x21};
short rook_dir[8]    = {-0x01, +0x01, -0x10, +0x10,  0,	    0,	   0,	  0   };
short cannon_dir[8]  = {-0x01, +0x01, -0x10, +0x10,  0,	    0,	   0,	  0   };
short pawn_dir[2][8] = {
    {-0x01,	+0x01, -0x10, 0, 0, 0, 0, 0},
    {-0x01,	+0x01, +0x10, 0, 0, 0, 0, 0},
};

short knight_check[8] = {-0x10, -0x10, -0x01, +0x01, -0x01, +0x01, +0x10, +0x10};
short bishop_check[8] = {-0x11, -0x0f, +0x0f, +0x11,  0,     0,     0,     0   };

BYTE legal_position[2][256] = {
	{
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 1,25, 1, 9, 1,25, 1, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 1, 9, 1, 9, 1, 9, 1, 9, 0, 0, 0, 0,
		0, 0, 0,17, 1, 1, 7,19, 7, 1, 1,17, 0, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 3, 7, 3, 1, 1, 1, 0, 0, 0, 0,
		0, 0, 0, 1, 1,17, 7, 3, 7,17, 1, 1, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	},{
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 1, 1,17, 7, 3, 7,17, 1, 1, 0, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 3, 7, 3, 1, 1, 1, 0, 0, 0, 0,
		0, 0, 0,17, 1, 1, 7,19, 7, 1, 1,17, 0, 0, 0, 0,
		0, 0, 0, 9, 1, 9, 1, 9, 1, 9, 1, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 1,25, 1, 9, 1,25, 1, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	}
};

BYTE position_mask[7] = {2, 4, 16, 1, 1, 1, 8};

static void add_move(BYTE from, BYTE to, int depth)
{
    move_list[depth][move_count].from = from;
    move_list[depth][move_count].to = to;
    move_count++;
}

int gen_all_move(int depth)
{
    int i, j, k;
    int side_tag;
    int over_flag;
    BYTE p, next, m;
    
    move_count = 0;
    side_tag = 16 + side * 16;
    p = piece[side_tag];

    if (!p) return 0;

    /* 将(帅)的走法 */
    for (k = 0; k < 4; ++k) {
        next = p + king_dir[k];

        if (legal_position[side][next] & position_mask[KING]) {

            if(!(board[next] & side_tag)) {
                add_move(p, next, depth);
            }
        }
    }

    /* 士(仕)的走法 */
    for (i = 1; i <= 2; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;
                
        for (k = 0; k < 4; ++k) {
            next = p + advisor_dir[k];

            if (legal_position[side][next] & position_mask[ADVISOR]) {
                if (!(board[next] & side_tag)) {
                    add_move(p, next, depth);
                }
            }
        }
    }

    /* 象(相)的走法 */
    for (i = 3; i <= 4; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;
                
        for (k = 0; k < 4; ++k) {
            next = p + bishop_dir[k];

            if (legal_position[side][next] & position_mask[BISHOP]) {
                m = p + bishop_check[k];

                if (!board[m]) {
                    if (!(board[next] & side_tag)) {
                        add_move(p, next, depth);
                    }
                }
            }
        }
    }

    /* 马的走法 */
    for (i = 5; i <= 6; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;
                
        for (k = 0; k < 8; ++k) {
            next = p + knight_dir[k];

            if (legal_position[side][next] & position_mask[KNIGHT]) {
                m = p + knight_check[k];

                if (!board[m]) {
                    if (!(board[next] & side_tag)) {
                        add_move(p, next, depth);
                    }
                }
            }
        }
    }

    /* 车的走法 */
    for (i = 7; i <= 8; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;
                
        for (k = 0; k < 4; ++k) {
            for (j = 1; j < 10; ++j) {
                next = p + j * rook_dir[k];

                if (!(legal_position[side][next] & position_mask[ROOK])) break;
                        
                if (!board[next]) {
                    add_move(p, next, depth);
                } else if (board[next] & side_tag) {
                    break;
                } else {
                    add_move(p, next, depth);
                    break;
                }
            }
        }
    }

    /* 炮的走法 */
    for (i = 9; i <= 10; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;

        for (k = 0; k < 4; ++k) {
            over_flag = 0;

            for (j = 1; j < 10; ++j) {
                next = p + j * cannon_dir[k];

                if (!(legal_position[side][next] & position_mask[CANNON])) break;

                if (!board[next]) {
                    
                    if (!over_flag) {
                        add_move(p, next, depth);
                    }
                                        
                } else {
                    if (!over_flag) {
                        over_flag = 1;
                    } else {
                        if (!(board[next] & side_tag)) {
                            add_move(p, next, depth);
                        }

                        break;
                    }
                }
            }
        }
    }

    /* 兵(卒)的走法 */
    for (i = 11; i <= 15; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;
                
        for (k = 0; k < 3; ++k) {
            next = p + pawn_dir[side][k];

            if (legal_position[side][next] & position_mask[PAWN]) {
                if (!(board[next] & side_tag)) {
                    add_move(p, next, depth);
                }
            }
        }
    }

    return move_count;
}
