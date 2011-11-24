#include "genmoves.h"

short king_dir[8]    = {-0x10, -0x01, +0x01, +0x10,  0,     0,	   0,	  0   };
short advisor_dir[8] = {-0x11, -0x0f, +0x0f, +0x11,  0,	    0,	   0,	  0   };
short bishop_dir[8]  = {-0x22, -0x1e, +0x1e, +0x22,  0,	    0,	   0,	  0   };
short knight_dir[8]  = {-0x21, -0x1f, -0x12, -0x0e, +0x0e, +0x12, +0x1f, +0x21};
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

/* 检查当前局面lside方是[1]否[0]被将军 */
static int check(int lside);

static int save_move(BYTE from, BYTE to, move *move_array)
{
    BYTE pc1, pc2;
    pc1 = board[from];
    pc2 = board[to];

    /* make move */
    board[from] = 0;
    board[to] = pc1;
    piece[pc1] = to;
    if (pc2) {
        piece[pc2] = 0;
    }

    int kill = check(side);

    /* unmake move */
    board[from] = pc1;
    board[to] = pc2;
    piece[pc1] = from;
    if (pc2) {
        piece[pc2] = to;
    }

    if (!kill) {
        move_array->from = from;
        move_array->to = to;
        return 1;
    }

    return 0;
}

int gen_all_move(move *move_array)
{
    int i, j, k;
    int side_tag;
    int over_flag;
    BYTE p, next, m;

    move *mv_array = move_array;
    
    side_tag = 16 + side * 16;
    p = piece[side_tag];

    if (!p) return 0;

    /* 将(帅)的走法 */
    for (k = 0; k < 4; ++k) {
        next = p + king_dir[k];

        if (legal_position[side][next] & position_mask[KING]) {

            if(!(board[next] & side_tag)) {
                if (save_move(p, next, move_array)) {
                    move_array++;
                }
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
                    if (save_move(p, next, move_array)) {
                        move_array++;
                    }
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
                        if (save_move(p, next, move_array)) {
                            move_array++;
                        }
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
                        if (save_move(p, next, move_array)) {
                            move_array++;
                        }
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
                    
                    if (save_move(p, next, move_array)) {
                        move_array++;
                    }
                    
                } else if (board[next] & side_tag) {
                    break;
                } else {
                    
                    if (save_move(p, next, move_array)) {
                        move_array++;
                    }
                    
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
                        if (save_move(p, next, move_array)) {
                            move_array++;
                        }
                    }
                                        
                } else {
                    if (!over_flag) {
                        over_flag = 1;
                    } else {
                        if (!(board[next] & side_tag)) {
                            if (save_move(p, next, move_array)) {
                                move_array++;
                            }
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
                    if (save_move(p, next, move_array)) {
                        move_array++;
                    }
                }
            }
        }
    }

    return move_array - mv_array;
}

int gen_cap_move(move *move_array)
{
    int i, j, k;
    int side_tag;               /* 本方标记 */
    int op_side_tag;            /* 对方标记 */
    int over_flag;              /* 炮翻山标记 */
    BYTE p, next, m;

    move *mv_array = move_array;
    
    side_tag = 16 + side * 16;
    op_side_tag = 48 - side_tag;
    
    p = piece[side_tag];

    if (!p) return 0;

    /* 将(帅)的走法 */
    for (k = 0; k < 4; ++k) {
        next = p + king_dir[k];

        if (legal_position[side][next] & position_mask[KING]) {

            /* 目标位置上有对方棋子 */
            if(board[next] & op_side_tag) {
                if (save_move(p, next, move_array)) {
                    move_array++;
                }
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
                
                if (board[next] & op_side_tag) {
                    if (save_move(p, next, move_array)) {
                        move_array++;
                    }
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

                /* 相眼位置无子 */
                if (!board[m]) {
                    if (board[next] & op_side_tag) {
                        if (save_move(p, next, move_array)) {
                            move_array++;
                        }
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
                
                /* 马脚位置无子 */
                if (!board[m]) {
                    if (board[next] & op_side_tag) {
                        if (save_move(p, next, move_array)) {
                            move_array++;
                        }
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

                if (!board[next]) { /* 目标位置上无子 */
                    /* 不做处理 */
                    
                } else if (board[next] & side_tag) { /* 目标位置上有本方棋子 */
                    break;
                    
                } else { /* 目标位置上有对方棋子 */
                    if (save_move(p, next, move_array)) {
                        move_array++;
                    }
                    
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

                if (!board[next]) { /* 目标位置上无子 */
                    /* 不做处理 */
                    
                } else {
                    if (!over_flag) {
                        over_flag = 1;
                        
                    } else {    /* 已翻山 */
                        
                        if (board[next] & op_side_tag) {
                            if (save_move(p, next, move_array)) {
                                move_array++;
                            }
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
                
                if (board[next] & op_side_tag) {
                    if (save_move(p, next, move_array)) {
                        move_array++;
                    }
                }
            }
        }
    }

    return move_array - mv_array;
}

static int check(int lside)
{
    BYTE w_king, b_king;
    BYTE p, q;
    int side_tag = 32 - lside * 16;
    int kill, i, offset;

    w_king = piece[16];
    b_king = piece[32];

    if (!w_king || !b_king) return 0;

    /* 检测将帅是否照面 */
    kill = 1;
    
    if (w_king%16 == b_king%16) {
        for (w_king = w_king-16; w_king != b_king; w_king = w_king-16) {
            if (board[w_king]) {
                kill = 0;
                break;
            }
        }

        if (kill) return kill;
    }

    q = piece[48-side_tag];

    /* 检测是否被马攻击 */
    int k;
    BYTE next, m;

    for (i = 5; i <= 6; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;

        for (k = 0; k < 8; ++k) {
            next = p + knight_dir[k];

            if (next != q) continue;

            if (legal_position[1-lside][next] & position_mask[KNIGHT]) {
                m = p + knight_check[k];

                if (!board[m]) return 1;
            }
        }
    }

    /* 检测是否被车攻击 */
    for (i = 7; i <= 8; ++i) {
        kill = 1;
        
        p = piece[side_tag + i];

        if (!p) continue;

        if (p%16 == q%16) {
            offset = (p > q ? -16 : 16);

            for (p = p+offset; p != q; p = p+offset) {
                if (board[p]) {
                    kill = 0;
                    break;
                }
            }

            if (kill) return kill;
                        
        } else if (p/16 == q/16) {
            offset = (p > q ? -1 : 1);

            for (p = p+offset; p != q; p = p+offset) {
                if (board[p]) {
                    kill = 0;
                    break;
                }
            }

            if (kill) return kill;
        }
    }

    /* 检测是否被炮攻击 */

    for (i = 9; i <= 10; ++i) {
        int over_flag = 0;
        
        p = piece[side_tag + i];

        if (!p) continue;

        if (p%16 == q%16) {
            offset = (p > q ? -16 : 16);

            for (p = p+offset; p != q; p = p+offset) {
                if (board[p]) {
                    if (!over_flag) {
                        over_flag = 1;
                    } else {
                        over_flag = 2;
                        break;
                    }
                }
            }

            if (over_flag == 1) return 1;
                        
        } else if (p/16 == q/16) {
            offset = (p > q ? -1 : 1);

            for (p = p+offset; p != q; p = p+offset) {
                if (board[p]) {
                    if (!over_flag) {
                        over_flag = 1;
                    } else {
                        over_flag = 2;
                        break;
                    }
                }
            }

            if (over_flag == 1) return 1;
        }
    }

    /* 检测是否被兵(卒)攻击 */
    for (i = 11; i <= 15; ++i) {
        p = piece[side_tag + i];

        if (!p) continue;

        for (k = 0; k < 3; ++k) {
            next = p + pawn_dir[1-lside][k];

            if ((next == q) && (legal_position[1-lside][next] & position_mask[PAWN])) {
                return 1;
            }
        }
    }

    return 0;
}
