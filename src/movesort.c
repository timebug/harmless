#include <string.h>

#include "movesort.h"

int history[HISTORY_SIZE];

int cmp_move(move m1, move m2) {
    if (m1.to == m2.to && m1.from == m2.from) return 1;
    else return 0;
}

void save_history(move mv, int depth)
{
    int k, i;

    k = mv.from * 256 + mv.to;
    history[k] += depth;

    /* 防止历史表溢出 */
    if (history[k] >= 240) {
        for (i = 0; i < HISTORY_SIZE; i++) {
            history[i] -= history[i] / 4;
        }
    }
}

void reset_history()
{
    memset(history, 0, sizeof(history));
}

static void set_non_cap_value(move *move_array, int start, int end) {

    int i;
    for (i = start; i < end; ++i) {
        move_array[i].capture = history[move_array[i].from *
                                             256 + move_array[i].to];
    }
}

static int partition(move *move_array, int p, int r)
{
    int i, j;
    move x = move_array[r];
    move tmp;

    i = p - 1;
    for (j = p; j < r; j++) {
        if (move_array[j].capture >= x.capture) {
            i++;
            tmp = move_array[i];
            move_array[i] = move_array[j];
            move_array[j] = tmp;
        }
    }

    tmp = move_array[i+1];
    move_array[i+1] = move_array[r];
    move_array[r] = tmp;

    return i+1;
}

static void quicksort(move *move_array, int p, int r)
{
    if (p < r) {
        int q = partition(move_array, p, r);
        quicksort(move_array, p, q-1);
        quicksort(move_array, q+1, r);
    }
}

int move_array_init(move *move_array, move hash_move)
{
    int n1, n2, count, i, j;
    n1 = gen_cap_move(move_array);
    quicksort(move_array, 0, n1-1);

    n2 = gen_non_cap_move(move_array + n1);
    count = n1 + n2;

    set_non_cap_value(move_array, n1, count);
    quicksort(move_array, n1, count-1);

    /* 置换表走法不为空 */
    if (hash_move.from != 0 && hash_move.to != 0)
    {
        for (i = 0; i < count; i++) {
            if (cmp_move(move_array[i], hash_move)) {
                for (j = i; j > 0; j--) {
                    move_array[j] = move_array[j-1];
                }

                move_array[0] = hash_move;
                break;
            }
        }
    }

    return count;
}

int cap_move_array_init(move *move_array)
{
    int n;
    n = gen_cap_move(move_array);
    quicksort(move_array, 0, n-1);
    return n;
}
