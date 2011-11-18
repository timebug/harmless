#ifndef PIPE_H
#define PIPE_H

#define LINE_INPUT_MAX_CHAR 8192
#define PATH_MAX_CHAR 1024
#define PATH_SEPARATOR '/'

void open_pipe(const char *proc_file);
int line_input(char *line_str);

#endif
