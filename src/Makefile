OBJECTS = pipe.o ucci.o position.o genmoves.o movesort.o evaluate.o search.o hash.o openbook.o harmless.o

CC = gcc

harmless : $(OBJECTS)
	${CC} -g -o harmless ${OBJECTS}

position.o : base.h position.h position.c
	${CC} -g -c position.c
genmoves.o : base.h position.h genmoves.h genmoves.c
	${CC} -g -c genmoves.c
movesort.o : base.h position.h genmoves.h movesort.h movesort.c
	${CC} -g -c movesort.c
evaluate.o : base.h position.h genmoves.h evaluate.h evaluate.c
	${CC} -g -c evaluate.c
hash.o : hash.h hash.c
	${CC} -g -c hash.c
openbook.o : base.h hash.h position.h openbook.c
	${CC} -g -c openbook.c
search.o : base.h position.h genmoves.h movesort.h evaluate.h search.h hash.h search.c
	${CC} -g -c search.c
pipe.o : pipe.h pipe.c
	${CC} -g -c pipe.c
ucci.o : pipe.h ucci.h ucci.c
	${CC} -g -c ucci.c
harmless.o : base.h position.h search.h ucci.h harmless.c
	${CC} -g -c harmless.c

.PHONY : clean
clean :
	rm harmless $(OBJECTS)