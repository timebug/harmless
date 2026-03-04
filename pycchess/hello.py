#! /usr/bin/env python
# -*- coding: utf-8 -*-

def hello(name=None):
    """
    Returns a friendly greeting message.
    
    Args:
        name: Optional name to personalize the greeting
        
    Returns:
        A greeting string
        
    Raises:
        ValueError: If name is empty string
    """
    if name is None:
        return "Hello! Welcome to pycchess."
    
    if not isinstance(name, str):
        raise ValueError("Name must be a string")
    
    if name.strip() == "":
        raise ValueError("Name cannot be empty")
    
    return "Hello, {}! Welcome to pycchess.".format(name.strip())
