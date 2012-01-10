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
from chessman import *
from chessnet import *

import sys
import pygame

class chessboard:
    def clearboard(self):
        self.board = {}
        self.selected = ()
        self.done = []
        self.piece = [0]*48
        self.over = False
        self.over_side = RED
        
    def __init__(self):
        self.clearboard()
        
        self.mode = NETWORK
        self.side = RED
        self.move_from = LOCAL
        self.net = None
        
        self.fin = sys.stdin;
        self.fout = sys.stdout;
        
        self.surface = pygame.image.load(image_path + board_image).convert()
        self.select_surface = pygame.image.load(image_path + select_image).convert_alpha()
        self.done_surface = pygame.image.load(image_path + done_image).convert_alpha()
        self.over_surface = pygame.image.load(image_path + over_image).convert_alpha()
        
        self.check_sound = load_sound(check_sound)
        self.move_sound = load_sound(move_sound)
        self.capture_sound = load_sound(capture_sound)

    def add_chessman(self, kind, color, x, y, pc):
        chessman_ = chessman(kind, color, x, y, pc)

        if kind == PAWN:
            if color == self.side:
                if y < 5:
                    chessman_.over_river = True
            else:
                if y > 4:
                    chessman_.over_river = True
                
        self.board[(x, y)] = chessman_
        self.piece[pc] = (x, y)

    def get_fen(self):
        fen_str = ''
        count = 0
        for j in range(10):
            for i in range(9):
                if (i, j) in self.board.keys():
                    if count is not 0:
                        fen_str += str(count)
                        count = 0
                    chessman = self.board[(i, j)]
                    ch = get_char(chessman.kind, chessman.color)
                    
                    if ch is not '':
                        fen_str += ch
                else:
                    count += 1
                    
            if count is not 0:
                fen_str += str(count)
                count = 0
            if j < 9:
                fen_str += '/'
                
        if self.side is BLACK:
            fen_str += ' w'
        else:
            fen_str += ' b'
        fen_str += ' - - 0 1'

        return fen_str

    def fen_parse(self, fen_str):
        self.clearboard()
        
        pc_code = [[16, 17, 19, 21, 23, 25, 27], [32, 33, 35, 37, 39, 41, 43]]
        
        if fen_str == '':
            return

        x = 0
        y = 0

        for i in range(0, len(fen_str)):
            ch = fen_str[i]
            if ch == ' ':
                break

            if ch == '/':
                x = 0
                y += 1

                if y > 9:
                    break
            elif ch >= '1' and ch <= '9':
                x += int(ch)
                if x > 8:
                    x = 8
            elif ch >= 'A' and ch <= 'Z':
                if x <= 8:
                    kind = get_kind(ch)

                    if kind != NONE:
                        self.add_chessman(kind, self.side, x, y, pc_code[self.side][kind])
                        pc_code[self.side][kind] += 1

                    x += 1
            elif ch >= 'a' and ch <= 'z':
                if x <= 8:
                    kind = get_kind(ch)

                    if kind != NONE:
                        self.add_chessman(kind, 1-self.side, x, y, pc_code[1-self.side][kind])
                        pc_code[1-self.side][kind] += 1

                    x += 1

        # if fen_str[i+1] == 'b':
        #     self.side = BLACK
        # else:
        #     self.side = RED            

    def draw(self, screen):
        screen.fill((0,0,0))
        screen.blit(self.surface, (0, 0))
        # offset_ = 0
        for key in self.board.keys():
            chessman = self.board[key]
            if chessman == None:
                continue
            board_x = BORDER + chessman.x * SPACE
            board_y = BORDER + chessman.y * SPACE
            if chessman.color == RED:
                offset = 0
            else:
                offset = 53
            screen.blit(chessman.surface, (board_x, board_y), (offset, 0, 52, 52))

            if key == self.selected:
                screen.blit(self.select_surface, (board_x, board_y), (offset, 0, 52, 52))
                
            if key in self.done:
                screen.blit(self.select_surface, (board_x, board_y), (offset, 0, 52, 52))
                offset_ = offset

        for d in self.done:
            if d not in self.board.keys():
                board_x = BORDER + d[0] * SPACE
                board_y = BORDER + d[1] * SPACE
                screen.blit(self.done_surface, (board_x, board_y), (offset_, 0, 52, 52))

        if self.over:
            side_tag = 16 + self.over_side * 16
            king = self.piece[side_tag]
            if king:
                board_x = BORDER + king[0] * SPACE
                board_y = BORDER + king[1] * SPACE
                screen.blit(self.over_surface, (board_x, board_y), (self.over_side*53, 0, 52, 52))

    def check(self, side):
        side_tag = 32 - side * 16
        
        # king
        w_king = self.piece[16]
        b_king = self.piece[32]

        if not w_king or not b_king:
            return False

        kill = True
        if w_king[0] == b_king[0]:
            min_y = min(w_king[1], b_king[1])
            max_y = max(w_king[1], b_king[1])
            for m_y in range(min_y+1, max_y):
                if (w_king[0] ,m_y) in self.board.keys():
                    kill = False
                    break
            if kill:
                return kill

        # knight
        q = self.piece[48 - side_tag]
        
        for i in range(5, 7):
            p = self.piece[side_tag + i]
            if not p:
                continue
            for k in range(0, 8):
                tmp = knight_dir[k]
                n = (p[0]+tmp[0], p[1]+tmp[1])
                if n != q:
                    continue
                if self.board[p].move_check(n[0],n[1]):
                    tmp = knight_check[k]
                    m = (p[0]+tmp[0], p[1]+tmp[1])
                    if m not in self.board.keys():
                        return True

        # rook
        for i in range(7, 9):
            kill = True
            
            p = self.piece[side_tag + i]
            if not p:
                continue
            if p[0] == q[0]:
                min_y = min(p[1], q[1])
                max_y = max(p[1], q[1])

                for m_y in range(min_y+1, max_y):
                    if (p[0], m_y) in self.board.keys():
                        kill = False
                        break
                    
                if kill:
                    return kill
            elif p[1] == q[1]:
                min_x = min(p[0], q[0])
                max_x = max(p[0], q[0])

                for m_x in range(min_x+1, max_x):
                    if (m_x, p[1]) in self.board.keys():
                        kill = False
                        break
                    
                if kill:
                    return kill

        # cannon
        for i in range(9, 11):
            over_flag = 0
            p = self.piece[side_tag + i]
            if not p:
                continue
            if p[0] == q[0]:
                min_y = min(p[1], q[1])
                max_y = max(p[1], q[1])

                for m_y in range(min_y+1, max_y):
                    if (p[0], m_y) in self.board.keys():
                        if not over_flag:
                            over_flag = 1
                        else:
                            over_flag = 2
                            break
                if over_flag == 1:
                    return True
            elif p[1] == q[1]:
                min_x = min(p[0], q[0])
                max_x = max(p[0], q[0])
                for m_x in range(min_x+1, max_x):
                    if (m_x, p[1]) in self.board.keys():
                        if not over_flag:
                            over_flag = 1
                        else:
                            over_flag = 2
                if over_flag == 1:
                    return True

        # pwan
        for i in range(11, 16):
            p = self.piece[side_tag + i]
            if not p:
                continue
            
            flag = 0
            if p[1] > 4:
                flag = 1
                
            for k in range(0, 3):
                tmp = pawn_dir[flag][k]
                n = (p[0]+tmp[0], p[1]+tmp[1])
                if n != q:
                    continue
                if self.board[p].move_check(n[0], n[1]):
                    return True
                
        return False

    def can_move(self, chessman, x, y):
        ok = True
        if chessman.kind == BISHOP:
            m_x = (chessman.x + x) / 2
            m_y = (chessman.y + y) / 2
            if (m_x, m_y) in self.board.keys():
                ok = False

        if chessman.kind == KNIGHT:
            if abs(chessman.x - x) == 2:
                m_x = (chessman.x + x) / 2
                m_y = chessman.y
            if abs(chessman.y - y) == 2:
                m_x = chessman.x
                m_y = (chessman.y + y) / 2
            if (m_x, m_y) in self.board.keys():
                ok = False

        if chessman.kind == ROOK or chessman.kind == CANNON:
            over_flag = 0
            if chessman.x != x:
                min_x = min(chessman.x, x)
                max_x = max(chessman.x, x)
                for m_x in range(min_x+1, max_x):
                    if (m_x, y) in self.board.keys():
                        over_flag += 1
            else:
                min_y = min(chessman.y, y)
                max_y = max(chessman.y, y)
                for m_y in range(min_y+1, max_y):
                    if (x, m_y) in self.board.keys():
                        over_flag += 1

            if over_flag != 0:
                ok = False

            if chessman.kind == CANNON:
                if (x, y) in self.board.keys():
                    if over_flag == 1:
                        ok = True
                    else:
                        ok = False
        return ok

    def move_chessman(self, x, y):
        flag = False
        if (x, y) in self.board.keys():
            chessman = self.board[(x, y)]
            if chessman.color == self.side:
                flag = True
            else:
                if self.selected is ():
                    return False
        
        if self.selected is ():
            if flag:
                self.selected = (x, y)

        else:
            if flag:
                self.selected = (x, y)
            else:
                chessman = self.board[self.selected]
                if chessman.move_check(x, y):
                    ok = self.can_move(chessman, x, y)
                    if ok:
                        chessman_ = None
                        if (x, y) in self.board.keys():
                            chessman_ = self.board[(x, y)]
                        
                        self.make_move(self.selected, (x, y), chessman_)
                        
                        if not self.check(self.side):

                            under_attack = self.check(1 - self.side)
                            
                            if under_attack is True:
                                self.check_sound.play()
                            else:
                                if chessman_ == None:
                                    self.move_sound.play()
                                else:
                                    self.capture_sound.play()

                            self.done = [self.selected, (x, y)]
                            
                            if self.move_from == LOCAL:
                                if self.mode == NETWORK:
                                    move_str_ = move_to_str(self.selected[0],self.selected[1],x,y)
                                    # print 'send move: %s' % move_str_
                                    move_str = move_to_str(8-self.selected[0],9-self.selected[1],8-x,9-y)
                                    if self.net is not None:
                                        self.net.send_move(move_str)
                                    else:
                                        print 'self.net is None'
                                    
                                if self.mode == AI:
                                    fen_str = self.get_fen()
                                    self.fin.write('position fen ' + fen_str + '\n')
                                    # print "position fen %s" % fen_str
                                    self.fin.flush()
                                    self.fin.write('go depth ' + str(AI_SEARCH_DEPTH)  + '\n')
                                    self.fin.flush()

                            self.selected = ()

                            return True
                        else:
                            self.unmake_move(self.selected, (x, y), chessman_)

                    return False

    def make_move(self, p, n, chessman_):
        chessman = self.board[p]

        self.piece[chessman.pc] = n
        if chessman_ is not None:
            self.piece[chessman_.pc] = 0

        chessman.x, chessman.y = n
        self.board[n] = chessman
        del self.board[p]

    def unmake_move(self, p, n, chessman_):
        chessman = self.board[n]
        
        chessman.x, chessman.y = p
        self.board[p] = chessman

        self.piece[chessman.pc] = p
        if chessman_ is not None:
            self.board[n] = chessman_
            self.piece[chessman_.pc] = n
        else:
            del self.board[n]

    def save_move(self, p, n, moves, side):
        flag = False
        if n in self.board.keys():
            if self.board[n].color is side:
                flag = True
                
        chessman = self.board[p]
        ok = self.can_move(chessman, n[0], n[1])
        if not ok:
            flag = True
            
        if not flag:
            move_ = move(p, n)
            moves.append(move_)

    def gen_moves(self, side):
        moves = []
        side_tag = 16 + 16 * side

        # king
        p = self.piece[side_tag]
        if not p:
            return moves
        for k in range(0, 4):
            tmp = king_dir[k]
            n = (p[0]+tmp[0], p[1]+tmp[1])
            if self.board[p].move_check(n[0], n[1]):
                self.save_move(p, n, moves, side)

        # advisor
        for i in range(1,3):
            p = self.piece[side_tag + i]
            if not p:
                continue
            for k in range(0, 4):
                tmp = advisor_dir[k]
                n = (p[0]+tmp[0], p[1]+tmp[1])
                if self.board[p].move_check(n[0], n[1]):
                    self.save_move(p, n, moves, side)

        # bishop
        for i in range(3, 5):
            p = self.piece[side_tag + i]
            if not p:
                continue
            for k in range(0, 4):
                tmp = bishop_dir[k]
                n = (p[0]+tmp[0], p[1]+tmp[1])
                if self.board[p].move_check(n[0], n[1]):
                    tmp = bishop_check[k]
                    m = (p[0]+tmp[0], p[1]+tmp[1])
                    if m not in self.board.keys():
                        self.save_move(p, n, moves, side)

        # knight
        for i in range(5, 7):
            p = self.piece[side_tag + i]
            if not p:
                continue
            for k in range(0, 8):
                tmp = knight_dir[k]
                n = (p[0]+tmp[0], p[1]+tmp[1])
                if self.board[p].move_check(n[0], n[1]):
                    tmp = knight_check[k]
                    m = (p[0]+tmp[0], p[1]+tmp[1])
                    if m not in self.board.keys():
                        self.save_move(p, n, moves, side)

        # rook
        for i in range(7, 9):
            p = self.piece[side_tag + i]
            if not p:
                continue
            for k in range(0, 4):
                for j in range(1, 10):
                    tmp = rook_dir[k]
                    n = (p[0]+j*tmp[0],p[1]+j*tmp[1])
                    if not self.board[p].move_check(n[0], n[1]):
                        break
                    if n not in self.board.keys():
                        move_ = move(p, n)
                        moves.append(move_)
                    else:
                        if self.board[n].color is not side:
                            move_ = move(p, n)
                            moves.append(move_)
                        break

        # cannon
        for i in range(9, 11):
            p = self.piece[side_tag + i]
            if not p:
                continue
            for k in range(0, 4):
                over_flag = 0
                for j in range(1, 10):
                    tmp = cannon_dir[k]
                    n = (p[0]+j*tmp[0],p[1]+j*tmp[1])
                    if not self.board[p].move_check(n[0], n[1]):
                        break
                    if n not in self.board.keys():
                        if not over_flag:
                            move_ = move(p, n)
                            moves.append(move_)
                    else:
                        if not over_flag:
                            over_flag = 1
                        else:
                            self.save_move(p, n, moves, side)
                            break

        # pawn
        for i in range(11, 16):
            p = self.piece[side_tag + i]
            if not p:
                continue

            flag = 0
            if p[1] > 4:
                flag = 1

            for k in range(0, 3):
                tmp = pawn_dir[flag][k]
                n = (p[0]+tmp[0], p[1]+tmp[1])
                if self.board[p].move_check(n[0], n[1]):
                    self.save_move(p, n, moves, side)
                    
        return moves

    def game_over(self, side):
        over = True
        moves = self.gen_moves(side)
        for move_ in moves:
            p = move_.p
            n = move_.n
            chessman_ = None
            if n in self.board.keys():
                chessman_ = self.board[n]
            self.make_move(p, n, chessman_)
            over = self.check(side)
            self.unmake_move(p ,n, chessman_)
            if not over:
                # move_str = move_to_str(p[0],p[1],n[0],n[1])
                # sys.stdout.write("move = " + move_str + "\n")
                break

        return over
