#include <stdio.h>
#include <string.h>

#include "base.h"
#include "position.h"
#include "search.h"
#include "ucci.h"

/* 日志文件描述符 */
FILE * logfile;

int main(int argc, char *argv[])
{
    int i;
	move mv;
	ucci_comm_enum uce;
	ucci_comm_struct ucs;
    char bookfile[255];

    strcpy(bookfile, "BOOK.DAT");

#ifdef DEBUG_LOG    
    logfile = fopen("harmless.log", "w");
#endif

	if (boot_line() == UCCI_COMM_UCCI) {

        new_hash_table();
        init_openbook(bookfile);
                
		printf("id name harmless\n");
		fflush(stdout);
        printf("id copyright 2011\n");
        fflush(stdout);
        printf("id anthor timebug\n");
        fflush(stdout);
		printf("ucciok\n");
		fflush(stdout);

		uce = UCCI_COMM_NONE;
                
		while (uce != UCCI_COMM_QUIT) {
			uce = idle_line(&ucs);
                        
			switch (uce) {
			case UCCI_COMM_ISREADY:
				printf("readyok\n");
				fflush(stdout);
				break;
			case UCCI_COMM_STOP:
				printf("nobestmove\n");
				fflush(stdout);
				break;
			case UCCI_COMM_POSITION:
				fen_to_arr(ucs.position.fen_str);
                fflush(stdout);
				break;
			case UCCI_COMM_BANMOVES:
				break;
			case UCCI_COMM_SETOPTION:
				switch (ucs.option.uo_type) {
				case UCCI_OPTION_BATCH:
					break;
				case UCCI_OPTION_DEBUG:
					break;
				case UCCI_OPTION_NEWGAME:
					break;
				default:
					break;
				}
                                
				break;
			case UCCI_COMM_GO:
			case UCCI_COMM_GOPONDER:
                if(ucs.search.ut_mode == UCCI_TIME_DEPTH)
                    think(ucs.search.depth_time.depth);
				break;
			}
		}
        
        del_hash_table();
	}

	printf("bye\n");
    fflush(stdout);

#ifdef DEBUG_LOG
    fclose(logfile);
#endif

    return 0;
}
