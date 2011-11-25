#! /usr/bin/env python
# -*- coding: utf-8 -*-

# pycchess - just another chinese chess UI
# Copyright (C) 2011 timebug.info

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or 
# any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from common import *
from chessboard import *
from chessnet import *

import pygame
from pygame.locals import *
from sys import *
from subprocess import *

pygame.init()

screen = pygame.display.set_mode(size, 0, 32)

chessboard = chessboard()

if len(sys.argv) == 2:
    if sys.argv[1] == 'r':
        pygame.display.set_caption("red")
        chessboard.side = RED
    elif sys.argv[1] == 'b':
        pygame.display.set_caption("black")
        chessboard.side = BLACK
    else:
        print 'game over'
        exit()
elif len(sys.argv) == 1:
    p = Popen("../src/harmless", stdin = PIPE, stdout = PIPE)
    (chessboard.fin, chessboard.fout) = (p.stdin, p.stdout)
    
    chessboard.fin.write("ucci\n")
    chessboard.fin.flush()
    # chessboard.fin.write("setoption newgame\n")
    # chessboard.fin.flush()

    while True:
        output = chessboard.fout.readline()
        sys.stdout.write(output)
        if 'ucciok' in output:
            break
        
    chessboard.mode = AI
    pygame.display.set_caption("harmless")
    chessboard.side = RED
else:
    print 'game over'
    exit()

chessboard.fen_parse(fen_str)

init = True

while True:
    moved = False
    for event in pygame.event.get():
        if event.type == QUIT:
            if chessboard.mode is NETWORK:
                net = chessnet()
                net.send_move('over')
            if chessboard.mode is AI:
                chessboard.fin.write("quit\n");
                chessboard.fin.flush();
            exit()
        if event.type == MOUSEBUTTONDOWN:
            x, y = pygame.mouse.get_pos()
            if x < BORDER or x > (WIDTH - BORDER):
                break
            if y < BORDER or y > (HEIGHT - BORDER):
                break
            x = (x - BORDER) / SPACE
            y = (y - BORDER) / SPACE
            if not chessboard.over:
                moved = chessboard.move_chessman(x, y)
                if chessboard.mode == NETWORK and moved:
                    chessboard.over = chessboard.game_over(1-chessboard.side)
                    if chessboard.over:
                        chessboard.over_side = 1-chessboard.side
                
    chessboard.draw(screen)
    pygame.display.update()
    
    if moved:
        if chessboard.mode is NETWORK:
            net = chessnet()
            move_str = net.get_move()
            if move_str is not None:
                # print 'recv move: %s' % move_str
                move_arr = str_to_move(move_str)
                
        if chessboard.mode is AI:
            output = chessboard.fout.readline()
            sys.stdout.write(output)
            
            if output[0:10] == 'nobestmove': 
                chessboard.over = True
                chessboard.over_side = 1 - chessboard.side
                continue
            elif output[0:8] == 'bestmove':
                move_str = output[9:13]
                move_arr = str_to_move(move_str)
            else:
                continue

        chessboard.side = 1 - chessboard.side
        chessboard.move_from = OTHER
        chessboard.move_chessman(move_arr[0], move_arr[1])
        chessboard.move_chessman(move_arr[2], move_arr[3])
        chessboard.move_from = LOCAL
        chessboard.side = 1 - chessboard.side
            
        # if chessboard.check(chessboard.side):
        chessboard.over = chessboard.game_over(chessboard.side)
        if chessboard.over:
            chessboard.over_side = chessboard.side
            
        moved = False

    if len(sys.argv) == 2 and sys.argv[1] == 'b' and init:
        net = chessnet()
        move_str = net.get_move()
        if move_str is not None:
            # print 'recv move: %s' % move_str
            move_arr = str_to_move(move_str)
            
            chessboard.side = 1 - chessboard.side
            chessboard.move_from = OTHER
            chessboard.move_chessman(move_arr[0], move_arr[1])
            chessboard.move_chessman(move_arr[2], move_arr[3])
            chessboard.move_from = LOCAL
            chessboard.side = 1 - chessboard.side
            init = False
        else:
            chessboard.over = True
