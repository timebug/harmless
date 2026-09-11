#include <stdlib.h>
#include <time.h>
#include <string.h>

#include "hash.h"

INT32_ zobrist_player;
INT64_ zobrist_player_check;
INT32_ zobrist_table[14][256];
INT64_ zobrist_table_check[14][256];

INT32_ zobrist_key;
INT64_ zobrist_key_check;
INT32_ hash_mask;
hash_node *hash_table;

INT32_ rand32()
{
    return rand() ^ ((INT32_)rand() << 15) ^ ((INT32_)rand() << 30);
}

static INT64_ rand64()
{
    return rand() ^ ((INT64_)rand() << 15) ^ ((INT64_)rand() << 30) ^
        ((INT64_)rand() << 45) ^ ((INT64_)rand() << 60);
}

static void init_zobrist()
{
    int i, j;
    srand(time(NULL));

    zobrist_player = rand32();
    for (i = 0; i < 14; i++) {
        for (j = 0; j < 256; j++) {
            zobrist_table[i][j] = rand32();
        }
    }

    zobrist_player_check = rand64();
    for (i = 0; i < 14; i++) {
        for (j = 0; j < 256; j++) {
            zobrist_table_check[i][j] = rand64();
        }
    }
}

void reset_hash_table()
{
    memset(hash_table, 0, HASH_TABLE_SIZE * sizeof(hash_node));
}

void new_hash_table()
{
    init_zobrist();

    hash_mask = HASH_TABLE_SIZE - 1;
    hash_table = (hash_node *)malloc(HASH_TABLE_SIZE * sizeof(hash_node));
    reset_hash_table();
}

void del_hash_table()
{
    if (hash_table)
        free(hash_table);
}

void save_hash_table(int value, int depth, data_type type, move mv)
{
    int add = zobrist_key & hash_mask;
    hash_node *pnode = &hash_table[add];

    pnode->value = value;
    pnode->checksum = zobrist_key_check;
    pnode->depth = depth;
    pnode->type = type;
    pnode->goodmove = mv;
}

int read_hash_table(int depth, int alpha, int beta, move *mv)
{
    int add = zobrist_key & hash_mask;
    hash_node *pnode = &hash_table[add];

    if (pnode->depth >= depth &&
        pnode->checksum == zobrist_key_check) {

        /* 确切值 */
        if (pnode->type == HASH_EXACT)
            return pnode->value;

        /* 上边界 */
        if (pnode->type == HASH_ALPHA && pnode->value <= alpha)
            return pnode->value;

        /* 下边界 */
        if (pnode->type == HASH_BETA && pnode->value >= beta)
            return pnode->value;

        (*mv) = pnode->goodmove;
    }

    /* 没有命中，返回无效标志 */
    return NOVALUE;
}
