#ifndef HASH_H
#define HASH_H

#define INT32 unsigned long
#define INT64 unsigned long long

/* 设置哈希表大小，默认32MB */
#define HASH_TABLE_SIZE 1024*1024*32

#define NOVALUE 66666

typedef enum {
    HASH_EXACT,
    HASH_ALPHA,
    HASH_BETA
} data_type;

typedef struct {
    INT64 checksum;             /* 64位校验值 */
    data_type type;             /* 数据类型 */
    int depth;                  /* 取得此值时的层次 */
    int value;                  /* 节点的估值 */
} hash_node;

/* 32位的走棋方键值 */
extern INT32 zobrist_player;
/* 64位的走棋方校验值 */
extern INT64 zobrist_player_check;
/* 32位的棋子在棋盘各位置的键值 */
extern INT32 zobrist_table[14][256];
/* 64位的棋子在棋盘各位置的校验值 */
extern INT64 zobrist_table_check[14][256];

/* 局面的键值 */
extern INT32 zobrist_key;
/* 局面的校验值 */
extern INT64 zobrist_key_check;
extern INT32 hash_mask;
extern hash_node *hash_table;

void init_zobrist();
void new_hash_table();
void del_hash_table();
void save_hash_table(int value, int depth, data_type type);
int read_hash_table(int depth, int alpha, int beta);

#endif
