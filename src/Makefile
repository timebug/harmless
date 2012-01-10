BIN = harmless

CC = gcc
CFLAGS = -O3 -Wall -pg

${BIN} : pipe.o ucci.o position.o genmoves.o movesort.o \
	evaluate.o search.o hash.o openbook.o harmless.o
	${CC} ${CFLAGS} $^ -o $@

position.o : base.h position.h
genmoves.o : base.h position.h genmoves.h
movesort.o : base.h position.h genmoves.h movesort.h
evaluate.o : base.h position.h genmoves.h evaluate.h
hash.o : hash.h
openbook.o : base.h hash.h position.h
search.o : base.h position.h genmoves.h movesort.h \
	evaluate.h search.h hash.h
pipe.o : pipe.h
ucci.o : pipe.h ucci.h
harmless.o : base.h position.h search.h ucci.h

.PHONY : clean
clean :
	${RM} ${BIN} *.o
