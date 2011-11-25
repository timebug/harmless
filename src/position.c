#include <string.h>

#include "position.h"

int side;
BYTE board[256];
BYTE piece[48];

static void add_piece(BYTE pos, BYTE pc)
{
    board[pos] = pc;
    piece[pc] = pos;
}

static char piece_to_char(BYTE pc)
{
        if (pc < 32) {
        switch(pc) {
        case 16: return 'K';
        case 17:
        case 18: return 'A';
        case 19:
        case 20: return 'B';
        case 21:
        case 22: return 'N';
        case 23:
        case 24: return 'R';
        case 25:
        case 26: return 'C';
        case 27:
        case 28:
        case 29:
        case 30:
        case 31: return 'P';
        default: return 0;
        }
                
    } else {
        pc = pc - 16;
                
        switch(pc) {
        case 16: return 'k';
        case 17:
        case 18: return 'a';
        case 19:
        case 20: return 'b';
        case 21:
        case 22: return 'n';
        case 23:
        case 24: return 'r';
        case 25:
        case 26: return 'c';
        case 27:
        case 28:
        case 29:
        case 30:
        case 31: return 'p';
        default: return 0;
            
        }
    }
}

static int char_to_type(char ch)
{
    switch(ch) {
    case 'k':
    case 'K': return 0;
    case 'a':
    case 'A': return 1;
    case 'b':
    case 'B': return 2;
    case 'n':
    case 'N': return 3;
    case 'r':
    case 'R': return 4;
    case 'c':
    case 'C': return 5;
    case 'p':
    case 'P': return 6;
    default: return 7;
    }
}

void clear_board()
{
    memset(board, 0, sizeof(board));
    memset(piece, 0, sizeof(piece));
}

void arr_to_fen(char *fen_str)
{
    int i, j, k, pc;
    char *str;

    str = fen_str;
    
    for (i = 3; i <= 12; ++i) {
        k = 0;
        
        for (j = 3; j <= 11; ++j) {
            pc = board[(i << 4) + j];
               
            if (pc != 0) {
                if (k > 0) {
                    *str = k + '0';
                    str ++;
                    k = 0;
                }

                *str = piece_to_char(pc);
                str ++;
                
            } else {
                k ++;
            }
        }

        if (k > 0) {
            *str = k + '0';
            str ++;
        }

        *str = '/';
        str ++;
    }
    
    str --;
    *str = ' ';
    str ++;
    *str = (side == RED ? 'w' : 'b');
    str ++;
    *str = '\0';
}

void fen_to_arr(const char *fen_str)
{
    clear_board();
        
    int i, j, k;
    int r_pc[7] = {16, 17, 19, 21, 23, 25, 27};
    int b_pc[7] = {32, 33, 35, 37, 39, 41, 43};
    const char *str;
        
    clear_board();
    str = fen_str;
        
    if (*str == '\0') {
        return;
    }

    i = 3;
    j = 3;
        
    while (*str != ' ') {
        if (*str == '/') {
            j = 3;
            i ++;
               
            if (i > 12) break;
        } else if (*str >= '1' && *str <= '9') {
            for (k = 0; k < (*str - '0'); ++k) {
                if (j >= 11) break;
                j ++;
            }
        } else if (*str >= 'A' && *str <= 'Z') {
            if (j <= 11) {
                k = char_to_type(*str);
                    
                if (k < 7) {
                    if (r_pc[k] < 32) {
                        
                        add_piece((i << 4) + j,r_pc[k]);
                        r_pc[k] ++;
                    }
                }
                                
                j ++;
            }
        } else if (*str >= 'a' && *str <= 'z') {
            if (j <= 11) {
                
                k = char_to_type(*str);

                if (k < 7) {
                    if (b_pc[k] < 48) {
                        
                        add_piece((i << 4) + j,b_pc[k]);
                        b_pc[k] ++;
                    }
                }
                                
                j ++;
            }
        }

        str ++;

        if (*str == '\0') {
            return;
        }
    }

    str ++;

    if (*str == 'b') {
        side = BLACK;
    } else {
        side = RED;
    }
}

inline move str_to_move(long str)
{
    char *ch;
    move mv;
    
    ch = (char *) &str;
    
    mv.from = (ch[0] - 'a' + 3) + (('9' - ch[1] + 3) << 4);
    mv.to = (ch[2] - 'a' + 3) + (('9' - ch[3] + 3) << 4);
    
    return mv;
}

inline long move_to_str(move mv)
{
    char str[4];
    
    str[0] = (mv.from % 16) - 3 + 'a';
    str[1] = '9' - (mv.from / 16) + 3;
    str[2] = (mv.to % 16) - 3 + 'a';
    str[3] = '9' - (mv.to / 16) + 3;
    
    return *(long *) str;
}
