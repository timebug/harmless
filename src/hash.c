#include <stdlib.h>
#include <time.h>
#include <string.h>

#include "hash.h"

INT32 zobrist_player;
INT64 zobrist_player_check;
INT32 zobrist_table[14][256];
INT64 zobrist_table_check[14][256];

INT32 zobrist_key;
INT64 zobrist_key_check;
INT32 hash_mask;
hash_node *hash_table;

static INT32 rand32()
{
    return rand() ^ ((INT32)rand() << 15) ^ ((INT32)rand() << 30);
}

static INT64 rand64()
{
    return rand() ^ ((INT64)rand() << 15) ^ ((INT64)rand() << 30) ^
        ((INT64)rand() << 45) ^ ((INT64)rand() << 60);    
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

void save_hash_table(int value, int depth, data_type type)
{
    int add = zobrist_key & hash_mask;
    hash_node *pnode = &hash_table[add];

    pnode->value = value;
    pnode->checksum = zobrist_key_check;
    pnode->depth = depth;
    pnode->type = type;
}

int read_hash_table(int depth, int alpha, int beta)
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
    }

    /* 没有命中，返回无效标志 */
    return NOVALUE;
}
