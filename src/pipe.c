#include <stdlib.h>
#include <string.h>

#include "pipe.h"

static char buffer[LINE_INPUT_MAX_CHAR];
static int read_end;
static int eof;

#ifdef _WIN32

#include <windows.h>

HANDLE input, output;
int console;
int bytes_left;

void open_pipe()
{
    DWORD dw_mode;
    eof = 0;
    input = GetStdHandle(STD_INPUT_HANDLE);
    output = GetStdHandle(STD_OUTPUT_HANDLE);
    console = GetConsoleMode(input, &dw_mode);
    read_end = 0;
}

void close()
{
    CloseHandle(input);
    CloseHandle(output);
}

void read_input()
{
    DWORD dw_bytes;
    if (ReadFile(input, buffer + read_end, LINE_INPUT_MAX_CHAR - read_end,
                 &dw_bytes, NULL)) {
        read_end += dw_bytes;
        if (bytes_left > 0) {
            bytes_left -= dw_bytes;
        } else {
            eof = 1;
        }
    }
}

int check_input()
{
    DWORD dw_events, dw_bytes;
    if (console) {
        GetNumberOfConsoleInputEvents(input, &dw_events);
        return dw_events > 1;
    } else if (bytes_left > 0) {
        return 1;
    } else if (PeekNamedPipe(input, NULL, 0, NULL, &dw_bytes, NULL)) {
        bytes_left = dw_bytes;
        return bytes_left > 0;
    } else {
        return 1;
    }
}

void line_output(const char *line_str)
{
    DWORD dw_bytes;
    int str_len;
    str_len = strlen(line_str);
    memcpy(buffer, line_str, str_len);
    buffer[str_len] = 'r';
    buffer[str_len + 1] = '\n';
    WriteFile(output, buffer, str_len + 2, &dw_bytes, NULL);
}

#else

#include <signal.h>
#include <time.h>
#include <sys/select.h>
#include <unistd.h>

static int input, output;

void open_pipe()
{
    eof = 0;
    input = STDIN_FILENO;
    output = STDOUT_FILENO;
    read_end = 0;
}

void close_pipe()
{
    close(input);
    close(output);
}

static void read_input()
{
    int n;
    n = read(input, buffer + read_end, LINE_INPUT_MAX_CHAR - read_end);
        
    if (n < 0) {
        eof = 1;
    } else {
        read_end += n;
    }
}

static int check_input()
{
    fd_set set;
    struct timeval tv;
    int val;
        
    FD_ZERO(&set);
    FD_SET(input, &set);
    
    tv.tv_sec = 0;
    tv.tv_usec = 0;
    val = select(input + 1, &set, NULL, NULL, &tv);
  
    if (val > 0 && FD_ISSET(input, &set) > 0)
        return 1;
    else
        return 0;
}

void line_output(const char *line_str)
{
    int str_len;
    
    char write_buffer[LINE_INPUT_MAX_CHAR];
    str_len = strlen(line_str);
    
    memcpy(write_buffer, line_str, str_len);
    
    write_buffer[str_len] = '\n';
    if (write(output, write_buffer, str_len + 1) != str_len + 1) {
        /* err_sys("write error"); */
    }
}

#endif

static int get_buffer(char *line_str)
{
    char *pfe;
    int feed_end;
    
    pfe = (char *) memchr(buffer, '\n', read_end);
  
    if (pfe == NULL) {
        return 0;
                
    } else {
        feed_end = pfe - buffer;
        
        memcpy(line_str, buffer, feed_end);
        
        line_str[feed_end] = '\0';
        
        feed_end ++;
        read_end -= feed_end;
        
        memcpy(buffer, buffer + feed_end, read_end);
        pfe = (char *) strchr(line_str, '\r');
    
        if (pfe != NULL) {
            *pfe = '\0';
        }
    
        return 1;
    }
}

int line_input(char *line_str)
{
    
    if (get_buffer(line_str)) {
        return 1;
                
    } else if (check_input()) {
        
        read_input();
        
        if (get_buffer(line_str)) {
            return 1;
            
        } else if (read_end == LINE_INPUT_MAX_CHAR) {
            
            memcpy(line_str, buffer, LINE_INPUT_MAX_CHAR - 1);
            line_str[LINE_INPUT_MAX_CHAR - 1] = '\0';
            buffer[0] = buffer[LINE_INPUT_MAX_CHAR - 1];
            
            read_end = 1;
            return 1;
            
        } else {
            return 0;
        }
                
    } else {
        return 0;
    }
}
