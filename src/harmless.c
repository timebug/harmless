#include <stdio.h>

#include "base.h"
#include "position.h"
#include "search.h"
#include "ucci.h"

int main(int argc, char *argv[])
{
    int i;
	move mv;
	ucci_comm_enum uce;
	ucci_comm_struct ucs;

	if (boot_line() == UCCI_COMM_UCCI) {
                
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
                    think_depth(ucs.search.depth_time.depth);
				break;
			}
		}
	}

	printf("bye\n");
	fflush(stdout);

    return 0;
}
