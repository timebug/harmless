default all:
	cd src && $(MAKE) && cd ..

install: all
	cp src/harmless pycchess

.PHONY : clean
clean :
	cd src && $(MAKE) clean && cd ..
	rm -f pycchess/harmless*
	rm -f pycchess/*.pyc
