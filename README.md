# Harmless

A Chinese Chess (Xiangqi) engine and UI.

## Requirements

* Python 2.7
* Pygame 1.9+

## Build and Run

### Linux / macOS

1.  **Clone the repository**

    ```bash
    git clone https://github.com/timebug/harmless.git
    cd harmless
    ```

2.  **Compile the engine**

    This project includes a C engine that needs to be compiled first.

    ```bash
    make
    make install
    ```

    This will compile the engine and copy the binary to the `pycchess` directory.

3.  **Run the game**

    ```bash
    cd pycchess
    python2 cchess.py
    ```

    *Note: This project currently requires Python 2.*

## Keyboard Shortcuts

* **Space**: Start a new game
