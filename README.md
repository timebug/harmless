# harmless

A Chinese chess engine (UCCI) and a simple Pygame GUI.

This repository contains:

- a C engine built as `harmless` (UCCI protocol)
- a Python/Pygame GUI in `pycchess/` that launches `./harmless` as a subprocess

## INSTALL

### GNU/Linux and macOS

> require

Engine:

* `gcc`
* `make`

GUI:

* `python-2.7.x`: <http://python.org>
* `pygame-1.9.x`: <http://pygame.org>

Hint: install pygame on OS X Lion

<http://stackoverflow.com/questions/7288571/best-way-to-install-pygame-on-os-x-lion>

> run

```bash
$ git clone git://github.com/timebug/harmless.git
$ make && make install
$ cd pycchess && python2 cchess.py
```

### Windows User

Windows binaries are not provided in this repository. If you are on Windows, the recommended way is to use WSL (Ubuntu) and follow the GNU/Linux steps above.

## RUN

### GUI (pycchess)

The engine reads `BOOK.DAT` from the current working directory, so start the GUI from `pycchess/`:

```bash
cd pycchess
python2 cchess.py
```

### Engine only (UCCI)

```bash
cd pycchess
./harmless
```

Smoke test:

```bash
cd pycchess
printf "ucci\nisready\nquit\n" | ./harmless
```

Expected output contains `ucciok`, `readyok`, `bye`.

## KEYBOARD SHORTCUTS

* `space`: new game

## FAQ

- `BOOK.DAT` not found: run from `pycchess/`, or copy `BOOK.DAT` to your current working directory.
- Python 3: the GUI is written for Python 2.7 and is not Python 3 compatible.
