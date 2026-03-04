#! /usr/bin/env python
# -*- coding: utf-8 -*-

# pycchess - just another chinese chess UI
# Copyright (C) 2011 - 2015 timebug

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

"""
Test module for the hello functionality.

This module contains unit tests for the hello function.
"""

from hello import hello


def test_hello_no_args():
    result = hello()
    assert result == "Hello", "hello() should return 'Hello'"


def test_hello_with_name():
    result = hello("World")
    assert result == "Hello, World!", "hello('World') should return 'Hello, World!'"


def test_hello_empty_string():
    result = hello("")
    assert result == "Hello", "hello('') should return 'Hello'"


def test_hello_none():
    result = hello(None)
    assert result == "Hello", "hello(None) should return 'Hello'"


def test_hello_whitespace_only():
    result = hello("   ")
    assert result == "Hello", "hello('   ') should return 'Hello'"


def test_hello_with_whitespace():
    result = hello("  Alice  ")
    assert result == "Hello, Alice!", "hello('  Alice  ') should return 'Hello, Alice!'"


if __name__ == "__main__":
    test_hello_no_args()
    print("test_hello_no_args passed")
    
    test_hello_with_name()
    print("test_hello_with_name passed")
    
    test_hello_empty_string()
    print("test_hello_empty_string passed")
    
    test_hello_none()
    print("test_hello_none passed")
    
    test_hello_whitespace_only()
    print("test_hello_whitespace_only passed")
    
    test_hello_with_whitespace()
    print("test_hello_with_whitespace passed")
    
    print("\nAll tests passed!")
