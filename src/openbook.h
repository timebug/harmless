#ifndef OPENBOOK_H
#define OPENBOOK_H

#include "base.h"
#include "hash.h"
#include "position.h"
#include "movesort.h"

#define MAX_BOOK_POS 30000
#define MAX_BOOK_MOVE 128

void init_openbook(const char *bookfile);
move read_openbook();

#endif
