#include <stdio.h>
#include <string.h>
#include <malloc.h>
#include "pipe.h"
#include "ucci.h"

char command_line_str[LINE_INPUT_MAX_CHAR];

static long coord_list[256];

static int read_digit(char *line_str, int max_value)
{
    int value = 0;

    for ( ; ; ) {
        if (*line_str >= '0' && *line_str <= '9') {
            value *= 10;
            value += *line_str - '0';
            line_str ++;

            if (value > max_value) {
                value = max_value;
            }
                        
        } else {
            break;
        }
    }

    return value;
}

ucci_comm_enum boot_line()
{
    char line_str[LINE_INPUT_MAX_CHAR];
        
    open_pipe(NULL);

    while (!line_input(line_str)) {
        sleep(1);
    }

    if (strcmp(line_str, "ucci") == 0) {
        return UCCI_COMM_UCCI;
    } else {
        return UCCI_COMM_NONE;
    }
}

ucci_comm_enum idle_line(ucci_comm_struct *ucs_command)
{
    int i;
    char *line_str;
    ucci_comm_enum uce_return_value;

    while (!line_input(command_line_str)) {
        sleep(1);
    }

    line_str = command_line_str;

    if (strcmp(line_str, "isready") == 0) {
        /* isready */
        return UCCI_COMM_ISREADY;
    } else if (strncmp(line_str, "setoption ", 10) == 0) {
        /* setoption <option> [<arguments>] */
        line_str += 10;
                
        if (strncmp(line_str, "newgame", 7) == 0) {
            ucs_command->option.uo_type = UCCI_OPTION_NEWGAME;
        } else {
            ucs_command->option.uo_type = UCCI_OPTION_NONE;
        }
                
        return UCCI_COMM_SETOPTION;
    } else if (strncmp(line_str, "position ", 9) == 0) {
        /* position {<special_position> | fen <fen_string>} [moves <move_list>] */
        line_str += 9;
                
        if (strncmp(line_str, "fen ", 4) == 0) {
            ucs_command->position.fen_str = line_str + 4;
        } else {
            return UCCI_COMM_NONE;
        }

        line_str = strstr(line_str, " moves ");
        ucs_command->position.move_num = 0;

        if (line_str != NULL) {
            line_str += 7;
            ucs_command->position.move_num = ((strlen(line_str) + 1) / 5);

            for (i = 0; i < ucs_command->position.move_num; ++i) {
                coord_list[i] = *(long *) line_str;
                line_str += 5;
            }

            ucs_command->position.coord_list = coord_list;
        }

        return UCCI_COMM_POSITION;
        
    } else if(strncmp(line_str, "banmoves ", 9) == 0) {
        /* banmoves <move_list> */
        line_str += 9;
        ucs_command->ban_moves.move_num = ((strlen(line_str) + 1) / 5);

        for (i = 0; i < ucs_command->ban_moves.move_num; ++i) {
            coord_list[i] = *(long *) line_str;
            line_str += 5;
        }

        ucs_command->ban_moves.coord_list = coord_list;
        return UCCI_COMM_BANMOVES;
        
    } else if (strncmp(line_str, "go ", 3) == 0) {
        /* go [ponder] {infinite | depth <depth> | time <time> [movestogo <moves_to_go> | increment <inc_time>]} */
        line_str += 3;

        if (strncmp(line_str, "ponder ", 7) == 0) {
            line_str += 7;
            uce_return_value = UCCI_COMM_GOPONDER;
        } else if (strncmp(line_str, "draw ", 5) == 0) {
            line_str += 5;
        } else {
            uce_return_value = UCCI_COMM_GO;
        }

        if (strncmp(line_str, "time ", 5) == 0) {
            line_str += 5;
            ucs_command->search.depth_time.time = read_digit(line_str, 3600000);
        } else if (strncmp(line_str, "depth ", 6) == 0) {
            line_str += 6;
            ucs_command->search.ut_mode  = UCCI_TIME_DEPTH;
            ucs_command->search.depth_time.depth = read_digit(line_str, UCCI_MAX_DEPTH - 1);
        } else {
            ucs_command->search.ut_mode = UCCI_TIME_DEPTH;
            ucs_command->search.depth_time.depth = UCCI_MAX_DEPTH - 1;
        }

        return uce_return_value;
        
    } else if (strcmp(line_str, "stop") == 0) {
        /* stop */
        return UCCI_COMM_STOP;
    } else if (strcmp(line_str, "quit") == 0) {
        /* quit */
        return UCCI_COMM_QUIT;
    } else {
        return UCCI_COMM_NONE;
    }
}

ucci_comm_enum busy_line()
{
    char line_str[LINE_INPUT_MAX_CHAR];

    if (line_input(line_str)) {
        if (strcmp(line_str, "stop") == 0) {
            return UCCI_COMM_STOP;
        } else if (strcmp(line_str, "quit") == 0) {
            return UCCI_COMM_QUIT;
        } else {
            return UCCI_COMM_NONE;
        }
                
    } else {
        return UCCI_COMM_NONE;
    }
}
