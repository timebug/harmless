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
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Project Overview

Harmless is a Chinese chess (Xiangqi) engine with a Python/Pygame graphical frontend and a C backend. Features include:

- Graphical chess board interface using Pygame
- Local AI play by spawning the C engine (`./harmless`) and talking UCCI over stdin/stdout
- Optional two-player TCP play (`chessnet`, port 62222)
- Sound effects for moves, captures, and checks
- Xiangqi movement, check, and checkmate-style game-over detection in the Python UI

Search depth sent by the UI is the constant `AI_SEARCH_DEPTH` in `pycchess/common.py` (currently `5`), via `go depth N`. The engine’s `think()` then runs iterative deepening (NegaScout) up to `MAX_SEARCH_DEPTH` or `LONGEST_SEARCH_TIME`.

## Directory Structure

```
├── pycchess/             # Python frontend (run the UI from this directory)
│   ├── image/            # Chess piece and board images
│   ├── sounds/           # Sound effects
│   ├── BOOK.DAT          # Opening book (read by the C engine from cwd)
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
│   ├── harmless.c        # Engine main loop (UCCI command dispatch)
│   ├── hash.c            # Transposition table
│   ├── hash.h            # Hash header
│   ├── movesort.c        # Move sorting / history heuristic
│   ├── movesort.h        # Move sorting header
│   ├── openbook.c        # Opening book handling
│   ├── openbook.h        # Opening book header
│   ├── pipe.c            # stdin/stdout line I/O for UCCI
│   ├── pipe.h            # Pipe header
│   ├── position.c        # Position representation
│   ├── position.h        # Position header
│   ├── search.c          # Search algorithm
│   ├── search.h          # Search header
│   ├── ucci.c            # UCCI protocol parser
│   └── ucci.h            # UCCI header
├── .gitignore            # Git ignore file
├── CODE_WIKI.md          # This document
├── Makefile              # Top-level makefile (`make install` copies src/harmless → pycchess/)
└── README.md             # Project README
```

## Architecture

The UI and engine are **not** a network client-server pair. They are a **subprocess + UCCI** setup:

1. **Python Frontend** (`pycchess`) handles:
   - User interface and graphics
   - User input (mouse clicks, keyboard)
   - Board rendering and piece movement
   - Sound effects
   - Optional TCP play against a remote human
   - Spawning `./harmless` and exchanging UCCI text on pipes

2. **C Backend Engine** (`src`) handles:
   - Move generation
   - Position evaluation
   - Search (NegaScout with transposition table, history heuristic, quiescence, opening book)
   - UCCI protocol (commands on stdin, `bestmove` / `nobestmove` on stdout)

With no extra arguments, `cchess.py` starts `./harmless`, writes `ucci`, and waits for `ucciok`. After each local move it sends `position fen ...` then `go depth <AI_SEARCH_DEPTH>`.

Network play is a **separate** path: the C engine is not started. Each Python process listens on TCP port 62222 and connects to `NET_HOST` to send moves.

## Core Modules

### Python Frontend

#### cchess.py

Main entry point for the game. Handles:
- Initialization of the Pygame environment
- Setting up the chessboard
- Choosing AI vs network from `sys.argv`
- Handling user input and events
- Communicating with the AI engine
- Running the main loop (`while True: runGame()`)

Key functions:
- `runGame()`: One frame of event handling, drawing, and AI/network I/O
- `newGame()`: Reset the board and send `setoption newgame` (AI mode)
- `quitGame()`: Tell the engine or peer to quit, then exit
- `enqueue_output()`: Background thread that copies engine stdout into a `Queue`

#### chessboard.py

Implements the chessboard representation and game logic:
- Board state management
- Piece movement validation (`move_check` + `can_move`)
- Check detection and game-over (no legal escape from check)
- Move generation
- FEN parsing and generation

Key methods:
- `move_chessman(x, y)`: Select/move a piece; in AI mode writes UCCI `position`/`go`; in network mode sends the move
- `gen_moves(side)`: Generate moves for a side (used by `game_over`)
- `game_over(side)`: True if that side has no move that leaves them out of check
- `check(side)`: True if that side’s king is attacked
- `get_fen()` / `fen_parse(fen_str)`: FEN encode/decode
- `make_move` / `unmake_move`: Apply or revert a move on the board
- `draw(screen)`: Render the board

#### chessman.py

Represents individual chess pieces and their movement rules:
- Piece type and color
- Position tracking
- Geometry checks per piece type (palace, river, knight/bishop block squares are handled in `chessboard.can_move`)
- River crossing flag for pawns (`over_river`)

Key method:
- `move_check(x, y)`: Validate destination geometry for this piece

#### chessnet.py

TCP helpers for remote play (port `NET_PORT = 62222`):
- `send_move(move)`: Connect to `(NET_HOST, NET_PORT)` and send the move string
- `get_move()`: `bind`/`listen` on `('', NET_PORT)`, accept one connection, `recv` the move

There is no dedicated server process. Both players call both methods.

#### common.py

Shared constants and utility functions:
- Game constants (piece types, colors, directions)
- Board dimensions and UI parameters
- `AI_SEARCH_DEPTH` (UI search-depth request)
- FEN character conversion (`get_kind`, `get_char`)
- Move conversion (`move_to_str`, `str_to_move`)
- `load_sound()`

### C Backend Engine

Key components:
- **genmoves.c**: `gen_all_move`, `gen_cap_move`, `gen_non_cap_move`
- **evaluate.c**: `evaluate()`
- **search.c**: `think()` — opening book, then iterative NegaScout (`nega_scout`) with quiescence search
- **hash.c**: Transposition table (`new_hash_table`, `save_hash_table`, `read_hash_table`)
- **movesort.c**: Move ordering / history heuristic
- **openbook.c**: `init_openbook`, `read_openbook` (`BOOK.DAT`)
- **position.c**: Board arrays, `fen_to_arr` / `arr_to_fen`, side to move
- **ucci.c**: `boot_line()` (wait for `ucci`) and `idle_line()` (parse later commands)
- **pipe.c**: Line-oriented stdin/stdout
- **harmless.c**: `main` — dispatch UCCI (`position`, `go`, `setoption newgame`, `quit`, …)

## Key Classes and Functions

### Python Classes

#### `chessboard` class (chessboard.py)

Represents the chessboard and manages the game state.

**Methods:**
- `__init__()`: Initialize the board (default `mode` is `NETWORK`)
- `clearboard()`: Empty piece maps
- `add_chessman(kind, color, x, y, pc)`: Add a piece to the board
- `move_chessman(x, y)`: Handle piece selection and movement
- `gen_moves(side)`: Generate moves for a side
- `game_over(side)`: Check if that side has no legal escape
- `check(side)`: Check if that side’s king is in check
- `get_fen()`: Generate FEN for the current position
- `fen_parse(fen_str)`: Parse FEN into the board
- `can_move(chessman, x, y)`: Path/block checks (bishop eye, knight hobble, rook/cannon)
- `make_move(p, n, chessman_)` / `unmake_move(p, n, chessman_)`: Apply/revert
- `draw(screen)`: Blit board and pieces

#### `chessman` class (chessman.py)

Represents individual chess pieces.

**Methods:**
- `__init__(kind, color, x, y, pc)`: Initialize a piece
- `move_check(x, y)`: Validate destination geometry

#### `chessnet` class (chessnet.py)

Handles network communication.

**Attributes:** `host` (bind address, default `''`), `NET_HOST` (peer to send to), `NET_PORT` (`62222`).

**Methods:**
- `__init__()`: Initialize network parameters
- `send_move(move)`: Connect to the opponent and send a move
- `get_move()`: Listen on port 62222 and receive one move

### C Functions

These are the names in the source (there are no `GenerateMoves` / `SearchPosition`-style wrappers):

- `gen_all_move()` / `gen_cap_move()` / `gen_non_cap_move()`: Move generation
- `evaluate()`: Static evaluation
- `think(depth)`: Choose a move (book hit or iterative NegaScout); prints `bestmove` or `nobestmove`
- `init_openbook(bookfile)` / `read_openbook()`: Opening book
- `boot_line()` / `idle_line()`: UCCI startup and command parse
- `fen_to_arr()` / `arr_to_fen()`: Position FEN
- `new_hash_table()` / `reset_hash_table()` / `save_hash_table()` / `read_hash_table()`: TT

## Game Flow

1. **Initialization**:
   - Pygame is initialized and a `chessboard` is created
   - **No args:** spawn `./harmless`, send `ucci`, wait for `ucciok`, set `mode = AI`, local side red
   - **Network args:** construct `chessnet`, set caption/side from `-nr` / `-nb`, set `NET_HOST` from `sys.argv[2]` (see [Network Play](#network-play) for the argv-length bug)
   - Board is filled with `fen_parse(fen_str)` from `common.py`

2. **Main Game Loop** (`runGame` each frame):
   - Event handling (mouse clicks, keyboard)
   - `chessboard.draw` + `pygame.display.update`
   - After a local move: wait for engine stdout (AI) or `get_move()` (network)

3. **Move Processing**:
   - User selects a piece, then a destination
   - `chessman.move_check` + `chessboard.can_move`; illegal if the move leaves own king in check
   - On a legal local move in AI mode: `position fen ...` then `go depth N`
   - On a legal local move in network mode: `send_move` (coordinates flipped for the opponent’s view)

4. **AI Response**:
   - Engine may answer from the opening book or from `think()`
   - `bestmove xxxx` is parsed (`output[9:13]`) and applied as the other side
   - `nobestmove` is treated as game over

5. **Game Over**:
   - `game_over(side)` after moves; king overlay via `over.png`
   - Winner printed to stdout (`>> RED win` / `>> BLACK win`)

## Network Play

Network mode does **not** start the C engine. Two `cchess.py` processes exchange 4-character move strings over TCP.

How the sockets actually work:

1. Color comes from the flag suffix: `-nr` (red) or `-nb` (black).
2. `get_move()` always binds TCP port **62222** on all local interfaces and accepts one client.
3. `send_move()` connects to **`(NET_HOST, 62222)`**, where `NET_HOST` is copied from `sys.argv[2]`.
4. After a local move, the sender’s coordinates are mirrored (`8-x`, `9-y`) so the opponent’s board matches their perspective.
5. At startup, if network mode is still in `init`, `runGame` blocks in `get_move()` (intended so black can wait for red’s first move). There is no separate “server” vs “client” program.

### CLI caveat (current code)

`cchess.py` enters network mode only when `len(sys.argv) == 2` **and** `sys.argv[1]` starts with `-n`, then immediately assigns `sys.argv[2]` to `NET_HOST`. Consequences:

- `python cchess.py -nr` — passes the length check, then **IndexError** on `sys.argv[2]`
- `python cchess.py -nb <peer_ip>` — `len == 3`, so the process prints `>> quit game` and exits

So a working two-argument “server” plus three-argument “client” invocation is **not** implemented. The intended pieces are: `-nr`/`-nb` for color, and `sys.argv[2]` for the peer host. Fixing the length check (and only blocking on the first `get_move()` for black) is required before the commands below can work:

```bash
# Intended shape (does not work until the argv check matches argv[2])
cd pycchess && python cchess.py -nr <opponent_ip>
cd pycchess && python cchess.py -nb <opponent_ip>
```

Both sides must be able to accept TCP **62222**.

## Building and Running

### Building the Project

```bash
git clone https://github.com/timebug/harmless.git
cd harmless
make && make install
```

`make install` copies `src/harmless` to `pycchess/harmless`, which is what `cchess.py` executes as `./harmless`. Always run the UI from `pycchess/` so the binary, `BOOK.DAT`, `image/`, and `sounds/` resolve.

GitHub no longer serves the `git://` protocol; use HTTPS (or SSH) to clone.

### Running the Game

#### Local AI Game

```bash
cd pycchess && python cchess.py
```

Requires Python 2.7.x (the UI uses Python 2 syntax: `print` statements, `except E, e`, `Queue`).

#### Network Game

See [Network Play](#network-play). Do not use a `-nr` / `-nb <ip>` mix as if one side were only a server: both processes listen and both connect, and the current argv check does not accept a host argument.

### Keyboard Shortcuts

- `Space`: New game — **AI mode only**, and only when the engine is not waiting on a search **or** the current game is already over (`cchess.py` ignores Space in network mode)

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

### Engine not found

If local AI fails to start, confirm you ran `make && make install` from the repo root and that `pycchess/harmless` exists. `cchess.py` launches `./harmless` with the current working directory as `pycchess/`.

### Network Connectivity

Port 62222 must be reachable in both directions. Even then, startup currently fails because of the `len(sys.argv) == 2` vs `sys.argv[2]` mismatch described above.

## License

The project is licensed under the GNU General Public License v3.0 (see file headers; there is no top-level `LICENSE` file).
