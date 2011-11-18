#ifndef UCCI_H
#define UCCI_H

#define UCCI_MAX_DEPTH 32

typedef enum {
	UCCI_OPTION_NONE,
    UCCI_OPTION_BATCH,
    UCCI_OPTION_DEBUG,
    UCCI_OPTION_BOOKFILES,
    UCCI_OPTION_EGTBPATHS,
    UCCI_OPTION_HASHSIZE,
    UCCI_OPTION_THREADS,
    UCCI_OPTION_DRAWMOVES,
	UCCI_OPTION_REPETITION,
    UCCI_OPTION_PRUNING,
    UCCI_OPTION_KNOWLEDGE,
    UCCI_OPTION_SELECTIVITY,
    UCCI_OPTION_STYLE,
    UCCI_OPTION_LOADBOOK,
    UCCI_OPTION_NEWGAME
} ucci_option_enum;

typedef enum {
	UCCI_REPET_ALWAYSDRAW,
    UCCI_REPET_CHECKBAN,
    UCCI_REPET_ASIANRULE,
    UCCI_REPET_CHINESERULE
} ucci_repet_enum;

typedef enum {
	UCCI_GRADE_NONE,
    UCCI_GRADE_SMALL,
    UCCI_GRADE_MEDIUM,
    UCCI_GRADE_LARGE
} ucci_grade_enum;

typedef enum {
	UCCI_STYLE_SOLID,
    UCCI_STYLE_NORMAL,
    UCCI_STYLE_RISKY
} ucci_style_enum;

typedef enum {
	UCCI_TIME_DEPTH,
    UCCI_TIME_MOVE,
    UCCI_TIME_INC
} ucci_time_enum;

typedef enum {
	UCCI_COMM_NONE,
    UCCI_COMM_UCCI,
    UCCI_COMM_ISREADY,
    UCCI_COMM_PONDERHIT,
    UCCI_COMM_STOP,
    UCCI_COMM_SETOPTION,
    UCCI_COMM_POSITION,
    UCCI_COMM_BANMOVES,
    UCCI_COMM_GO,
    UCCI_COMM_GOPONDER,
    UCCI_COMM_QUIT
} ucci_comm_enum;

typedef union {
	struct {
		ucci_option_enum uo_type;
		union {
			int spin;
			int check;
			ucci_repet_enum repet;
			ucci_grade_enum grade;
			ucci_style_enum style;
			const char *str;
		} value;
	} option;

	struct {
		const char *fen_str;
		int move_num;
		long *coord_list;
	} position;

	struct {
		int move_num;
		long *coord_list;
	} ban_moves;

	struct {
		ucci_time_enum ut_mode;
		union {
            int depth, time; 
		} depth_time;
                
		union {
            int moves_to_go, increment;
		} time_mode;
	} search;
} ucci_comm_struct;

extern char command_line_str[];

ucci_comm_enum boot_line();
ucci_comm_enum idle_line(ucci_comm_struct *ucs_command);

#endif
