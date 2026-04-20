# Harmless Chinese Chess Engine - Code Wiki

## Table of Contents

- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Architecture](#architecture)
- [Core Modules](#core-modules)
  - [Python Frontend](#python-frontend)
  - [C Backend Engine](#c-backend-engine)
- [Key Classes and Functions](#key-classes-and-functions)
- [Game Flow](#game-flow)
- [Network Play](#network-play)
- [Building and Running](#building-and-running)
- [Dependencies](#dependencies)

## Project Overview

Harmless is a Chinese chess (Xiangqi) engine with both a Python-based graphical user interface and a C-based backend engine. The project provides a complete chess playing experience with features including:

- Graphical chess board interface using Pygame
- AI opponent with configurable search depth
- Network play capability
- Sound effects for moves and captures
- Standard Chinese chess rules implementation

## Directory Structure

```
├── pycchess/             # Python frontend
│   ├── image/            # Chess piece and board images
│   ├── sounds/           # Sound effects
│   ├── BOOK.DAT          # Opening book
│   ├── cchess.py         # Main game UI
│   ├── chessboard.py     # Board representation
│   ├── chessman.py       # Piece representation
│   ├── chessnet.py       # Network functionality
│   └── common.py         # Constants and utilities
├── src/                  # C backend engine
│   ├── Makefile          # Build configuration
│   ├── base.h            # Base definitions
│   ├── evaluate.c        # Position evaluation
│   ├── evaluate.h        # Evaluation header
│   ├── genmoves.c        # Move generation
│   ├── genmoves.h        # Move generation header
│   ├── harmless.c        # Main engine file
│   ├── hash.c            # Transposition table
│   ├── hash.h            # Hash header
│   ├── movesort.c        # Move sorting
│   ├── movesort.h        # Move sorting header
│   ├── openbook.c        # Opening book handling
│   ├── openbook.h        # Opening book header
│   ├── pipe.c            # Inter-process communication
│   ├── pipe.h            # Pipe header
│   ├── position.c        # Position representation
│   ├── position.h        # Position header
│   ├── search.c          # Search algorithm
│   ├── search.h          # Search header
│   ├── ucci.c            # UCCI protocol implementation
│   └── ucci.h            # UCCI header
├── .gitignore            # Git ignore file
├── Makefile              # Top-level makefile
└── README.md             # Project README
```

## Architecture

The project follows a client-server architecture where:

1. **Python Frontend** (pycchess) handles:
   - User interface and graphics
   - User input (mouse clicks, keyboard)
   - Board rendering and piece movement
   - Sound effects
   - Network communication for remote play
   - Communication with the C backend engine

2. **C Backend Engine** (src) handles:
   - Move generation
   - Position evaluation
   - Search algorithm (minimax with alpha-beta pruning)
   - Opening book usage
   - UCCI protocol implementation for communication

The frontend communicates with the backend via standard input/output pipes using the UCCI (Universal Chinese Chess Interface) protocol.

## Core Modules

### Python Frontend

#### cchess.py

Main entry point for the game. Handles:
- Initialization of the Pygame environment
- Setting up the chessboard
- Managing game modes (AI or network)
- Handling user input and events
- Communicating with the AI engine
- Running the main game loop

Key functions:
- `runGame()`: Main game loop
- `newGame()`: Start a new game
- `quitGame()`: Exit the game

#### chessboard.py

Implements the chessboard representation and game logic:
- Board state management
- Piece movement validation
- Check and checkmate detection
- Move generation
- FEN (Forsyth-Edwards Notation) parsing and generation

Key methods:
- `move_chessman(x, y)`: Handle piece movement
- `gen_moves(side)`: Generate all legal moves for a side
- `game_over(side)`: Check if the game is over
- `check(side)`: Check if the king is in check

#### chessman.py

Represents individual chess pieces and their movement rules:
- Piece type and color
- Position tracking
- Movement validation based on piece type
- River crossing detection for pawns

Key method:
- `move_check(x, y)`: Validate if a move is legal for this piece

#### chessnet.py

Handles network communication for remote play:
- Socket creation and management
- Sending and receiving moves
- Connection handling

Key methods:
- `send_move(move)`: Send a move to the opponent
- `get_move()`: Receive a move from the opponent

#### common.py

Shared constants and utility functions:
- Game constants (piece types, colors, directions)
- Board dimensions and UI parameters
- FEN string handling
- Move conversion between string and coordinates
- Sound loading

### C Backend Engine

The C backend implements a complete Chinese chess engine with:
- Efficient move generation
- Position evaluation
- Search algorithm
- Opening book support
- UCCI protocol implementation

Key components:
- **genmoves.c**: Move generation for all piece types
- **evaluate.c**: Position evaluation function
- **search.c**: Search algorithm (minimax with alpha-beta pruning)
- **position.c**: Position representation and management
- **ucci.c**: UCCI protocol implementation for communication with the frontend

## Key Classes and Functions

### Python Classes

#### `chessboard` class (chessboard.py)

Represents the chessboard and manages the game state.

**Methods:**
- `__init__()`: Initialize the board
- `add_chessman(kind, color, x, y, pc)`: Add a piece to the board
- `move_chessman(x, y)`: Handle piece movement
- `gen_moves(side)`: Generate all legal moves for a side
- `game_over(side)`: Check if the game is over
- `check(side)`: Check if the king is in check
- `get_fen()`: Generate FEN string for current position
- `fen_parse(fen_str)`: Parse FEN string to set board position

#### `chessman` class (chessman.py)

Represents individual chess pieces.

**Methods:**
- `__init__(kind, color, x, y, pc)`: Initialize a piece
- `move_check(x, y)`: Validate if a move is legal

#### `chessnet` class (chessnet.py)

Handles network communication.

**Methods:**
- `__init__()`: Initialize network parameters
- `send_move(move)`: Send a move to the opponent
- `get_move()`: Receive a move from the opponent

### C Functions

- `GenerateMoves()`: Generate all legal moves for the current position
- `EvaluatePosition()`: Evaluate the current position
- `SearchPosition()`: Search for the best move using minimax with alpha-beta pruning
- `LoadOpeningBook()`: Load opening book data
- `UCCIProtocol()`: Handle UCCI protocol commands

## Game Flow

1. **Initialization**:
   - Pygame is initialized
   - Chessboard is created
   - Game mode is determined (AI or network)
   - If AI mode, the C engine is started and UCCI protocol is initialized

2. **Main Game Loop**:
   - Event handling (mouse clicks, keyboard input)
   - Board rendering
   - Move processing
   - AI communication (if in AI mode)
   - Network communication (if in network mode)

3. **Move Processing**:
   - User selects a piece
   - User selects a destination
   - Move is validated
   - Move is executed
   - Board is updated
   - If in AI mode, FEN string is sent to the engine
   - If in network mode, move is sent to the opponent

4. **AI Response**:
   - Engine receives position via UCCI
   - Engine searches for the best move
   - Engine sends best move back via UCCI
   - Frontend executes the move

5. **Game Over**:
   - Checkmate detection
   - Game result display

## Network Play

The network play feature allows two players to play over a network connection:

1. One player starts the game as either red or black using the `-n` flag
2. The server waits for a connection on port 62222
3. The client connects to the server's IP address
4. Moves are sent between players via TCP sockets
5. The game proceeds with each player making moves alternately

## Building and Running

### Building the Project

```bash
# Clone the repository
git clone git://github.com/timebug/harmless.git

# Build the C backend and install
make && make install
```

### Running the Game

#### Local AI Game

```bash
cd pycchess && python cchess.py
```

#### Network Game

**Server (Red Player):**
```bash
cd pycchess && python cchess.py -nr
```

**Client (Black Player):**
```bash
cd pycchess && python cchess.py -nb <server_ip>
```

### Keyboard Shortcuts

- `Space`: Start a new game

## Dependencies

### Python Frontend

- Python 2.7.x
- Pygame 1.9.x

### C Backend

- Standard C compiler (gcc)
- Make

## Troubleshooting

### Pygame Installation on macOS

For macOS Lion and later, follow the instructions at:
https://stackoverflow.com/questions/7288571/best-way-to-install-pygame-on-os-x-lion

### Network Connectivity

Ensure that port 62222 is open in your firewall for network play.

## License

The project is licensed under the GNU General Public License v3.0.
