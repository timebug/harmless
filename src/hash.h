#ifndef HASH_H
#define HASH_H

#include "base.h"

/* 设置哈希表大小，默认4MB */
#define HASH_TABLE_SIZE 1024*1024*4
/* 表示当前局面在置换表中不存在 */
#define NOVALUE -66666

typedef enum {
    HASH_EXACT,
    HASH_ALPHA,
    HASH_BETA
} data_type;

typedef struct {
    INT64_ checksum;             /* 64位校验值 */
    data_type type;             /* 数据类型 */
    int depth;                  /* 取得此值时的层次 */
    int value;                  /* 节点的估值 */
    move goodmove;              /* 最佳走法 */
} hash_node;

/* 32位的走棋方键值 */
extern INT32_ zobrist_player;
/* 64位的走棋方校验值 */
extern INT64_ zobrist_player_check;
/* 32位的棋子在棋盘各位置的键值 */
extern INT32_ zobrist_table[14][256];
/* 64位的棋子在棋盘各位置的校验值 */
extern INT64_ zobrist_table_check[14][256];

/* 局面的键值 */
extern INT32_ zobrist_key;
/* 局面的校验值 */
extern INT64_ zobrist_key_check;
extern INT32_ hash_mask;
extern hash_node *hash_table;

INT32_ rand32();
void reset_hash_table();
void new_hash_table();
void del_hash_table();
void save_hash_table(int value, int depth, data_type type, move mv);
int read_hash_table(int depth, int alpha, int beta, move *mv);

#endif
