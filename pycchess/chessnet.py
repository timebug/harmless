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

import socket, sys, traceback

host_ = 'localhost'

class chessnet():
    def __init__(self):
        self.host = ''
        self.port = 62222

    def send_move(self, move):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        
        try:
            s.connect((host_, self.port))
        except socket.error, e:
            print "Couldn't find your port: %s" % e
            sys.exit(1)
            
        try:
            s.send(move)
        except socket.error, e:
            print "Error sending data (detected by shutdown): %s" % e
            sys.exit(1)
            
        s.close()

    def get_move(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOCK_STREAM, socket.SO_REUSEADDR, 1)
        s.bind((self.host, self.port))
        s.listen(1)

        while 1:
            try:
                clientsock, clientaddr = s.accept()
            except KeyboardInterrupt:
                raise
            except:
                traceback.print_exc()
                continue
            try:
                move = clientsock.recv(1024)
            except socket.error, e:
                print "Error receiving data: %s" % e
                sys.exit(1)
            except:
                traceback.print_exc()
    
            if not move or move == 'over':
                break

            try:
                clientsock.close()
            except KeyboardInterrupt:
                raise
            except:
                traceback.print_exc()
                
            return move
