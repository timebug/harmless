#include <string.h>

#include "movesort.h"

int history[HISTORY_SIZE];

void save_history(move *mv, int depth)
{
    int i = mv->from * 256 + mv->to;
    history[i] += 2 << depth;
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

static quicksort(move *move_array, int p, int r)
{
    if (p < r) {
        int q = partition(move_array, p, r);
        quicksort(move_array, p, q-1);
        quicksort(move_array, q+1, r);
    }
}

int move_array_init(move *move_array)
{
    int n1, n2, count;
    n1 = gen_cap_move(move_array);
    quicksort(move_array, 0, n1-1);
    
    n2 = gen_non_cap_move(move_array + n1);
    count = n1 + n2;
    
    set_non_cap_value(move_array, n1, count);
    quicksort(move_array, n1, count-1);

    return count;
}
