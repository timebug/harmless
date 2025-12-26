# harmless

A Chinese Chess (Xiangqi) engine implemented in C, with a graphical user interface written in Python.

## Features

- **Engine**: Efficient C-based engine supporting the UCCI protocol.
- **GUI**: User-friendly interface built with Python and Pygame.
- **Modes**:
  - **AI Mode**: Play against the computer.
  - **Network Mode**: Support for network play (experimental).

## Prerequisites

- **C Compiler**: GCC or compatible.
- **Make**: For building the project.
- **Python**: Python 2.7 (Legacy).
- **Pygame**: Library for the GUI (requires Pygame for Python 2).

## Build and Run

### 1. Build the Engine

Compile the source code and install the binary to the game directory:

```bash
make install
```

This will compile the C engine in `src/` and copy the `harmless` executable to the `pycchess/` directory.

### 2. Run the Game

Navigate to the game directory and start the Python script:

```bash
cd pycchess
python cchess.py
```

> **Note**: The codebase uses Python 2 syntax. Ensure you are using a Python 2 interpreter.

## Controls

- **Space**: Start a new game / Restart.
- **Mouse**: Click to select and move pieces.

## License

This project is licensed under the GNU General Public License v3 (GPLv3).
