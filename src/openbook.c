#include <stdio.h>
#include "openbook.h"

const int BOOK_UNIQUE = 4;
const int BOOK_MULTI = 8;
const int BOOK_EXIST = 12;

static move book_move_array[MAX_BOOK_POS][MAX_BOOK_MOVE];
static int book_num;

void init_openbook(const char *bookfile)
{
    FILE *fp;
    char *linechar;
    char linestr[256];
    move book_move;
    hash_node hash_temp, *phash;

    fp = fopen(bookfile, "rt");
    if (fp == NULL)
        return;

    int a = 0;
    linestr[254] = linestr[255] = '\0';

    while (fgets(linestr, 254, fp) != NULL) {
        a++;
        linechar = linestr;
        str_to_move(*(long *) linechar, &book_move);
        if (!cmp_move(book_move, NULL_MOVE)) {
            linechar += 5;
            book_move.capture = 0;
            while (*linechar >= '0' && *linechar <= '9') {
                book_move.capture *= 10;
                book_move.capture += *linechar - '0';
                linechar++;
            }

            linechar++;
            fen_to_arr(linechar);

            if (board[book_move.from]) {
                phash = &hash_table[zobrist_key & hash_mask];
                hash_temp = *phash;

                if ((hash_temp.type & BOOK_EXIST) == 0) {
                    hash_temp.checksum = zobrist_key_check;
                    hash_temp.type = BOOK_UNIQUE;
                    hash_temp.goodmove = book_move;
                    hash_temp.value = book_move.capture;
                    *phash = hash_temp;

                } else {

                    if (hash_temp.checksum == zobrist_key_check) {
                        if ((hash_temp.type & BOOK_UNIQUE) != 0) {
                            if (book_num < MAX_BOOK_POS) {
                                hash_temp.checksum = zobrist_key_check;
                                hash_temp.type = BOOK_MULTI;
                                book_move_array[book_num][0] = hash_temp.goodmove;
                                book_move_array[book_num][1] = book_move;
                                hash_temp.value = book_num;
                                hash_temp.depth = 2;
                                book_num++;
                                *phash = hash_temp;
                            }
                        } else {
                            if (hash_temp.depth < MAX_BOOK_MOVE) {
                                book_move_array[hash_temp.value][hash_temp.depth] = book_move;
                                hash_temp.depth++;
                            }
                        }
                    }
                }
            }
        }
    }

    fclose(fp);
}

move read_openbook()
{
    int i, value;
    long move_str = 0;
    move mv;
    hash_node hash_temp;
    move *pbook_move;
    int temp_value[MAX_BOOK_MOVE];

    if ((int)move_str) {
        /* do nothing */
    }

    hash_temp = hash_table[zobrist_key & hash_mask];

    if ((hash_temp.type & BOOK_EXIST) != 0 &&
        hash_temp.checksum == zobrist_key_check) {

        if ((hash_temp.type & BOOK_UNIQUE) != 0) {
            move_str = move_to_str(&hash_temp.goodmove);
            return hash_temp.goodmove;

        } else {
            value = 0;
            pbook_move = book_move_array[hash_temp.value];
            for (i = 0; i < hash_temp.depth; i++) {
                mv = pbook_move[i];
                move_str = move_to_str(&mv);
                value += mv.capture;
                temp_value[i] = value;
            }

            if (value > 0) {
                value = rand32() % value;
                for (i = 0; i < hash_temp.depth; i++) {
                    if (value < temp_value[i]) {
                        break;
                    }
                }
                return pbook_move[i];

            } else {
                    mv = NULL_MOVE;
                    return mv;
            }
        }

    } else {
        mv = NULL_MOVE;
        return mv;
    }
}
