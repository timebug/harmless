objects = pipe.o ucci.o position.o genmoves.o movesort.o evaluate.o search.o hash.o openbook.o harmless.o

harmless : $(objects)
	cc -g -o harmless ${objects}

position.o : base.h position.h position.c
	cc -g -c position.c
genmoves.o : base.h position.h genmoves.h genmoves.c
	cc -g -c genmoves.c
movesort.o : base.h position.h genmoves.h movesort.h movesort.c
	cc -g -c movesort.c
evaluate.o : base.h position.h genmoves.h evaluate.h evaluate.c
	cc -g -c evaluate.c
hash.o : hash.h hash.c
	cc -g -c hash.c
openbook.o : base.h hash.h position.h openbook.c
	cc -g -c openbook.c
search.o : base.h position.h genmoves.h movesort.h evaluate.h search.h hash.h search.c
	cc -g -c search.c
pipe.o : pipe.h pipe.c
	cc -g -c pipe.c
ucci.o : pipe.h ucci.h ucci.c
	cc -g -c ucci.c
harmless.o : base.h position.h search.h ucci.h harmless.c
	cc -g -c harmless.c

.PHONY : clean
clean :
	rm harmless $(objects)