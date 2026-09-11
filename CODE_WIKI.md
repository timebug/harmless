# Harmless 中国象棋引擎 — Code Wiki

> **Harmless** 是一个开源的中国象棋（Xiangqi）引擎项目，由 **Python GUI 前端** 与 **C 语言 AI 引擎** 两部分组成。引擎遵循 UCCI（Universal Chinese Chess Interface）协议，采用 **Negascout + α-β 剪枝 + 置换表 + 历史启发 + 静态搜索 + 开局库** 的主流象棋引擎算法架构。

---

## 1. 项目概览

### 1.1 目录结构

```
harmless/
├── Makefile                  # 顶层构建：`make` 编译 src/；`make install` 复制到 pycchess/
├── README.md                 # 项目说明与安装指南
├── pycchess/                 # Python GUI 前端（PyGame）
│   ├── cchess.py             # 主程序：事件循环 / 与引擎通信
│   ├── chessboard.py         # 棋盘类：渲染、走子、合法性、终局判定
│   ├── chessman.py           # 棋子类：移动边界与过河逻辑
│   ├── chessnet.py           # 网络对战：socket 发送/接收走法
│   ├── common.py             # 常量/方向表/辅助函数（FEN、坐标变换）
│   ├── BOOK.DAT              # 开局库（文本：走法 + 权重 + FEN）
│   ├── image/                # 棋盘与棋子 PNG 素材
│   └── sounds/               # 走子/将军/吃子音效（WAV）
└── src/                      # C 语言 UCCI 引擎核心
    ├── Makefile
    ├── base.h                # 全局宏、move 结构体
    ├── position.{h,c}        # 局面表示、FEN 解析、Zobrist 哈希更新
    ├── genmoves.{h,c}        # 走法生成（全部/吃子/不吃子/将军检测）
    ├── movesort.{h,c}        # 走法排序（历史启发 + 吃子 MVV/LVA）
    ├── evaluate.{h,c}        # 评估函数：子力价值表 + 灵活度
    ├── search.{h,c}          # 搜索主循环：Negascout、迭代加深、静态搜索
    ├── hash.{h,c}            # 置换表（Transposition Table）
    ├── openbook.{h,c}        # 开局库（BOOK.DAT）
    ├── ucci.{h,c}            # UCCI 协议命令解析
    ├── pipe.{h,c}            # 标准 I/O 管道读取
    └── harmless.c            # main() 入口
```

### 1.2 技术栈

| 层级 | 语言/库 | 用途 |
| :-- | :-- | :-- |
| 前端 GUI | Python 2.7 + PyGame 1.9 | 棋盘渲染、事件/音效、人机/网络对战 |
| AI 引擎 | C + GCC `-O3 -Wall`（见 `src/Makefile`） | 搜索、评估、UCCI 协议 I/O |
| 通信协议 | UCCI（文本管道） | Python → `./harmless` 子进程 |
| 数据文件 | `pycchess/BOOK.DAT`（文本开局库）、`image/*.png`、`sounds/*.wav` | 开局/素材 |

### 1.3 构建与运行

```bash
# 1. 编译引擎并安装到 GUI 目录
#    `make` 只在 src/ 生成 harmless；必须再 `make install` 才会 cp 到 pycchess/
make && make install

# 2. 启动 GUI（工作目录必须是 pycchess/，以便找到 ./harmless 与 BOOK.DAT）
cd pycchess && python cchess.py

# 3. 直接运行引擎（UCCI 模式，调试用；同样在 pycchess/ 下，否则读不到 BOOK.DAT）
./harmless
ucci          # 引擎先输出 id name/copyright/author，再回复 ucciok
isready       # 引擎回复 readyok
position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1
go depth 5    # 会调用 think(5)，但迭代加深实际上循环到 MAX_SEARCH_DEPTH=50，由 6s 时限中断；回复 bestmove ...
quit
```

---

## 2. 全局架构与数据流向

```
┌───────────────────────────────────────────────────────────────────────┐
│                          pycchess (Python GUI)                         │
│                                                                         │
│  pygame.init() ─► screen = set_mode()                                   │
│  chessboard = chessboard()  ─┬──► pygame.draw / image/sounds          │
│                               │                                         │
│  ┌─ 普通模式：                │  mouse / key 事件                       │
│  │  Popen("./harmless", ...)  │  ↓ (坐标点击 → 走子 → fen position)    │
│  │  stdin 写入 UCCI 指令 ◄────┘                                         │
│  │  stdout ← Queue() (独立线程读取) ─► 解析 "bestmove / nobestmove"    │
│  │                                                                     │
│  └─ 网络模式：chessnet.send_move / get_move (TCP, port=62222)         │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
                                   │  pipe/stdout
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        harmless (C UCCI Engine)                         │
│                                                                         │
│  main() ─► boot_line() 仅识别 stdin 的 "ucci"，随后自行打印 id / ucciok │
│           ─► idle_line() ─► setoption / position fen / go depth N      │
│                               │                                           │
│                               ▼                                           │
│                          think(depth)                                   │
│                               │  迭代加深 (1..MAX_SEARCH_DEPTH=50)，6s 时限 │
│                               ▼                                           │
│                      nega_scout(depth, alpha, beta)                     │
│                               │                                           │
│             ┌─────────────────┼─────────────────┐                       │
│             ▼                 ▼                 ▼                       │
│         move_array_init  quiescence_search  read_hash_table             │
│         (movesort.c)     (吃子延伸)         (hash.c)                    │
│             │                                                   │       │
│             ▼                                                   ▼       │
│       gen_cap_move() / gen_non_cap_move()（search 不走 gen_all_move）     │
│       (genmoves.c)                                                        │
│             │                                                   │       │
│             ▼                                                   ▼       │
│        evaluate()                                          save_hash     │
│        (position_values[2][7][256] + flexible)           (hash.c)        │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 3. 前端 GUI 模块详解（`pycchess/`）

### 3.1 [common.py](pycchess/common.py) — 全局常量与工具

- **棋盘与棋子常量**
  - `size = (WIDTH, HEIGHT) = (530, 586)`：窗口像素
  - `BORDER = 15, SPACE = 56`：棋盘边距与格子像素
  - `RED=0, BLACK=1`；`LOCAL=0, OTHER=1`；`NETWORK=0, AI=1`
  - 棋子种类：`KING, ADVISOR, BISHOP, KNIGHT, ROOK, CANNON, PAWN`

- **方向表**（反映各类棋子的步长偏移）
  - `king_dir, advisor_dir, bishop_dir, knight_dir, rook_dir, cannon_dir, pawn_dir`
  - `knight_check, bishop_check`：用于"蹩马腿/塞象眼"检测

- **FEN/坐标互转**
  - `get_kind(fen_ch)`：FEN 字符 → 棋子种类枚举
  - `get_char(kind, color)`：棋子种类+颜色 → FEN 字符
  - `move_to_str(x, y, x_, y_)`：`(0..8, 0..9) → "a0b2"` 风格
  - `str_to_move(str)`：反函数

- **搜索参数**
  - `AI_SEARCH_DEPTH = 5`：默认传给 `go depth` 的深度

### 3.2 [chessman.py](pycchess/chessman.py) — `class chessman`

棋子实体，核心方法是 `move_check(x, y)`，负责：

1. **边界检测**（`0 <= x <= 8, 0 <= y <= 9`）
2. **活动区域约束**
  - 将/帅：九宫格 `3 <= x <= 5`，不得越出本方 3 行
  - 士/仕：九宫内斜走一格（四角 + 中心，共 5 个格点）
  - 象/相：不过河（`y=0..4` 与 `y=5..9` 分属两岸），田字走法
  - 马：走"日"字 + 蹩马腿检测（在 chessboard.can_move 中继续判定）
   - 车/炮：直线移动
   - 兵/卒：未过河只能前进；过河后可左右各一格
3. **`over_river` 状态位**：随移动自动维护，用以控制过河卒横走权限

### 3.3 [chessboard.py](pycchess/chessboard.py) — `class chessboard`

棋盘与对局状态的核心容器，封装 **渲染 / 走子 / 合法性 / FEN / 终局** 全流程：

| 方法 | 作用 |
| :-- | :-- |
| `clearboard()` | 重置 `board` dict、`piece[48]`（索引=棋子编号，值=位置）、`over/selected` |
| `add_chessman(kind, color, x, y, pc)` | 放置一个棋子；同时写入 `piece[pc]` 供按编号索引 |
| `fen_parse(fen_str)` | 解析 FEN 字符串，重建整个棋盘（调用 `add_chessman`） |
| `get_fen()` | 从当前 `board` / `piece` 反序列化回 FEN，用于传给引擎 |
| `draw(screen)` | PyGame 渲染：棋盘 → 己方/对方棋子图片切片、选中/走过高亮、`over` 图标 |
| `move_chessman(x, y)` | 点击交互：首次点击→选中棋子；第二次→走子；内部调用 `can_move` 与 `make/unmake_move` 完成路径检测与将军自规避。成功后 AI 模式写入 `position fen ...` + `go depth ...`，网络模式 `send_move` |
| `can_move(chessman, x, y)` | 阻塞路径检测：车/炮的直线是否通；象/马腿是否被蹩；炮"翻山吃子"规则 |
| `make_move(p, n, chessman_)` | 在 Python 端的字典/数组中模拟走子，便于 `check()` 后撤销 |
| `unmake_move(p, n, chessman_)` | 配合 `make_move` 实现 "试探-还原" |
| `check(side)` | 判断 `side` 是否被将军：遍历对方各子看能否吃到己方将（白脸将、马、车、炮、兵） |
| `gen_moves(side)` | 生成 `side` 方所有伪合法走法（配合 `save_move`） |
| `game_over(side)` | `side` 是否无子可动/被将死：`gen_moves` 后逐个尝试 `make_move→check→unmake` |
| `save_move(p, n, moves, side)` | 过滤吃己子与 `can_move` 失败的走法后 append；**不**做将军检测（将军过滤在 `game_over` / `move_chessman`） |

**重要数据结构**
- `self.board[(x, y)] = chessman`：稀疏坐标 → 棋子
- `self.piece[48]`：编号 16..31 / 32..47 分属两方（本地为红时即红/黑）；值为 0 表示不在棋盘，否则为 `(x, y)` 元组
- `selected / done / over_side`：GUI 交互状态

### 3.4 [chessnet.py](pycchess/chessnet.py) — `class chessnet`

极简 TCP 对战支持：

- `NET_PORT = 62222`
- `send_move(move)`：作为客户端连接 `NET_HOST:62222` 发送 `move` 字符串
- `get_move()`：作为服务端 bind/listen/accept，阻塞接收对端走法
- 用途：`cchess.py` 用单个参数 `-nr` / `-nb`（`sys.argv[1][:2]=='-n'` 且 `[2:]` 为 `r`/`b`）切换 NETWORK 模式，并把 `sys.argv[2]` 当作 `NET_HOST`。当前同时要求 `len(sys.argv)==2`，与读取 `argv[2]` 冲突，该路径会 IndexError，网络模式实际上不可用。

### 3.5 [cchess.py](pycchess/cchess.py) — 主循环

核心流程：

1. `pygame.init()` + `chessboard = chessboard()`
2. **模式选择**
   - `-nr` / `-nb` → 网络对战模式（见 3.4；当前参数解析有缺陷）
   - 无参数 → AI 模式：`Popen("./harmless", stdin=PIPE, stdout=PIPE)`，并启动 daemon 线程将 stdout 行放入 `Queue`
3. **UCCI 握手**：写入 `ucci\n`，丢弃直到行内含 `ucciok`（引擎在此之前还会打印 `id name/copyright/author`）
4. **事件循环 `runGame()`**
   - 处理 `MOUSEBUTTONDOWN`：解析坐标 → 调用 `move_chessman` → 若移动成功则以 FEN 写入引擎 `position fen ...` + `go depth AI_SEARCH_DEPTH`
   - 异步读取 `Queue`：解析 `bestmove`（引擎返回的 4 字符坐标）→ 转为 `(x,y)` → 在 GUI 端同样用 `move_chessman` 落子
   - 判定 `game_over` / 将军 / 输出 `nobestmove` 的结局
5. `KEYDOWN (空格)` → 重启：发送 `setoption newgame` 给引擎

---

## 4. C 引擎核心详解（`src/`）

### 4.1 数据表示基础

定义于 [base.h](src/base.h) / [position.h](src/position.h) / [position.c](src/position.c)

| 名称 | 类型 | 说明 |
| :-- | :-- | :-- |
| `side` | `int` | 当前走子方，`RED=0` / `BLACK=1` |
| `board[256]` | `BYTE` | **16×16 一维数组** 表示棋盘；实际棋子放在 10 行 × 9 列的子矩阵内（行/列各偏移 3），便于出界检测与 "方向 offset" 运算 |
| `piece[48]` | `BYTE` | 棋子编号 → 位置：`piece[16..31]` 红方；`piece[32..47]` 黑方；值=0 表示该棋子被吃 |
| `piece_type[48]` | `BYTE` | 棋子编号 → 种类（`KING..PAWN`）：`[0..15]` 为零；`[16..31]` 红方；`[32..47]` 黑方 |
| `move` | `struct { BYTE from; BYTE to; unsigned short capture; }` | `from/to` 为 0..255 的 board 索引；`capture` 用于 make/unmake 恢复被吃子 |

**位置↔坐标**：行 = `pos / 16`，列 = `pos % 16`。棋盘落在行 3..12、列 3..11（各偏移 3）。初始红帅在 16×16 下标 `(row=12, col=7)`（FEN 末行 `K`，对应 e0），由 `fen_to_arr()` 解析初始化。

**Zobrist 哈希**（见 `position.c::add_piece / change_side`）
- `zobrist_table[14][256]`：14 种"颜色×种类"在 256 个格子上的随机键
- `zobrist_player / zobrist_player_check`：换方键
- 每次 `add_piece / make_move / change_side` 都通过异或更新 `zobrist_key / zobrist_key_check`（32 位 key + 64 位 checksum 双层，避免冲突）

### 4.2 走法生成 — [genmoves.c](src/genmoves.c)

对外三个函数，内部统一用 `legal_position[2][256]` 与 `position_mask[7]` 判定棋子是否允许落在某格：

| 函数 | 行为 |
| :-- | :-- |
| `gen_all_move(move_array)` | 生成当前方 **全部** 走法；`save_move` 会试走并 `check(side)`，自将被将军的走法丢弃。现行搜索不用它（仅 `#if 0` 的旧 PVS 路径引用） |
| `gen_cap_move(move_array)` | 仅生成 **吃子** 走法（同样经 `save_move` 过滤），用于 quiescence 与根层排序 |
| `gen_non_cap_move(move_array)` | 仅生成 **不吃子** 走法；`move_array_init` 在吃子走法之后调用它拼出完整列表 |

每类棋子的生成逻辑：

- **将/帅**：4 个方向 `king_dir[k]`，仅允许九宫范围内的非本方棋子
- **士/仕**：4 个对角方向 `advisor_dir[k]`
- **象/相**：4 个田字方向 `bishop_dir[k]`；`bishop_check[k]` 指向"象眼"位置，若 `board[象眼] != 0` 则被塞，跳过
- **马：** 8 个 `knight_dir[k]`；蹩马腿格 `board[p + knight_check[k]]` 为空才合法
- **车**：4 向直线延伸，空格可走；遇本方棋子 break；遇对方棋子可吃并 break
- **炮**：同样 4 向直线；未翻山时空格可走、遇子只当炮架；吃子必须 **恰好翻过一个炮架**，实现上用 `over_flag` 计中间子，`over_flag==1` 且 `board[next] & op_side_tag` 时形成吃子
- **兵/卒**：未过河仅前进一格；过河后加左右两格（`pawn_dir[side][0..2]`）

**将军检测 `check(side)`**
- 判断 `side` 方是否被将军：
  1. 白脸将（双帅照面）
  2. 对方 马/车/炮/兵 按上述走法能否吃到己方将
- 在 `save_move()` 中被调用，用以筛掉走完后自方被将军的走子（即"伪合法→合法"筛选）

### 4.3 走法排序 — [movesort.c](src/movesort.c)

- `move_array_init(move_array, hash_move)`：先 `gen_cap_move` 再 `gen_non_cap_move` 拼出全部走法（**不**调用 `gen_all_move`）。吃子段与非吃子段分别 quicksort；非吃子把 `history[from*256+to]` 写入 `capture` 再排序。若 `hash_move` 的 from/to 均非 0，则把它挪到数组 0 位
- `cap_move_array_init(move_array)`：`gen_cap_move` 得到吃子走法，按 `move.capture`（MVV 减受保护惩罚）降序
- `save_history(move, depth)`：发生 beta 剪枝时，`history[from*256+to] += depth`（**不是** `depth^2`）；若某项 ≥ 240 则全表缩减 1/4
- `cmp_move(m1, m2)`：比较两个 `move` 是否同一 `from/to`

### 4.4 评估函数 — [evaluate.c](src/evaluate.c)

`result = (r_value + flexible[0]) - (b_value + flexible[1])`，并按当前 `side` 取负号。

- **`r_value / b_value`**：`piece` 中每个存活棋子查 `position_values[color][kind][pos]`，该表为 2 行（红/黑）× 7 类 × 256 位置的 **位置价值表**，编码了：
  - 马在中心权重高；车开放线价值高；兵过河后价值剧增
  - 将/士在九宫合法位非零；相在己方田字位非零
- **`flexible[r]`**：对本方每个子枚举其可走到的位置数，按 `F_*` 权重（King=2, Knight=5, Rook=4, Cannon=3, Pawn=2 等）累计，反映子力灵活性

### 4.5 搜索核心 — [search.c](src/search.c)

主入口 `think(depth)`：

1. 先用 `move_array_init` 得到根层走法；若走法数 = 0 → 直接 `nobestmove`（被将死 / 困毙）
2. **开局库优先**：`read_openbook()` 命中则直接打印 `bestmove`，并维护 `move_history[4]` 防循环
3. **迭代加深** `max_depth = 1..MAX_SEARCH_DEPTH`（50）。`think(depth)` 虽接收 UCCI 的 `go depth N`，但该参数随后被循环覆盖，**并不限制层数**；每层调用 `nega_scout`，若返回 `TIME_OVER`（`LONGEST_SEARCH_TIME=6000ms`）则停止，最终使用 `backupmove`
4. **长将/重复走法防护**：比较 `move_history[0/2]` 与 `best_move / better_move / good_move`，若形成重复则降级到备选走法

`nega_scout(depth, alpha, beta)`：

- **Negascout（主变搜索 + 零窗口）**：第一个子节点用 `(alpha, beta)` 全窗口搜索；后续先用 `(a, a+1)` 零窗口探测，若 fail-high 再重搜
- **循环检测**：`hash_history[depth]` 记录本层 Zobrist 键；若高层出现相同键表示重复 → 返回 `-INFINITE_`
- **置换表（TT）**：`read_hash_table(depth, alpha, beta, &hash_move)` 若命中 `EXACT / ALPHA / BETA` 且 depth 足够则直接返回；否则得到 hash_move 作为优先走法
- **静态搜索（Quiescence）**：`depth<=0` 时进入 `quiescence_search`，只展开吃子走法并用 `evaluate()` 做安静估值，避免"地平线效应"
- **时间控制**：根层每次 `make_move` 前检查 `get_tick_count() - starttime >= LONGEST_SEARCH_TIME`，超时返回 `TIME_OVER`
- **Beta 剪枝**：`a >= beta` 时写入 `HASH_BETA` 并调用 `save_history` 强化该走法的历史权重

辅助静态函数：`make_move / unmake_move` 负责在 `board / piece / zobrist_key / cur_step / side` 上安全地前进/回滚局面。

### 4.6 置换表 — [hash.h](src/hash.h) / [hash.c](src/hash.c)

- `HASH_TABLE_SIZE = 1024*1024*4`（**项数**，不是 4MB 字节）。`new_hash_table()` 执行 `malloc(HASH_TABLE_SIZE * sizeof(hash_node))`（`hash_node` 约 24 字节时约 96MB），`hash_mask = HASH_TABLE_SIZE - 1`，因此必须是 2 的幂
- 节点结构：
  - `checksum` 64 位：校验值（区分同 key 的不同局面）
  - `type ∈ { HASH_EXACT, HASH_ALPHA, HASH_BETA }`
  - `depth / value / goodmove`
- `save_hash_table(value, depth, type, goodmove)`：`zobrist_key & hash_mask` 作为下标写入
- `read_hash_table(depth, alpha, beta, &hash_move)`：若 `checksum` 匹配且 `node.depth >= depth`，则按 type 返回或缩窗；未命中返回 `NOVALUE`（-66666）
- `rand32 / new_hash_table / del_hash_table / reset_hash_table`：Zobrist 种子与内存管理

### 4.7 开局库 — [openbook.h](src/openbook.h) / [openbook.c](src/openbook.c)

- `MAX_BOOK_POS = 30000, MAX_BOOK_MOVE = 128`
- `init_openbook(bookfile)`：以 **文本** 方式打开 `BOOK.DAT`（`fopen(..., "rt")`）。每行格式：`走法 权重 FEN`（例如 `b2e2 5895 rnbakabnr/9/... w - - 0 1`），按局面 Zobrist 写入置换表
- `read_openbook()`：按当前 `zobrist_key` 查表；唯一走法直接返回，多走法按权重随机抽取。GUI 必须在 `pycchess/` 下启动引擎，否则找不到该书

### 4.8 UCCI 协议 — [ucci.c](src/ucci.c) / [pipe.c](src/pipe.c)

- `boot_line()`：阻塞读一行，**仅当内容为 `ucci` 才返回** `UCCI_COMM_UCCI`；`id name/author` 是 `harmless.c` 随后打印的引擎输出，不是 boot 解析的命令
- `idle_line(ucs_command)`：运行态解析 `isready / setoption newgame / position fen ... / go depth N / stop / quit / banmoves`
- `pipe.c`：`line_input(char*)` 从 `stdin` 读行；`open_pipe()` 初始化 I/O
- 引擎主循环（[harmless.c](src/harmless.c)）：解析 `position fen` → `fen_to_arr()` 写入 `side / board / piece`；`go depth N` → `think(N)`（见 4.5：N 不限制迭代层数）并输出 `bestmove ...`

### 4.9 依赖关系图（C 层）

```
harmless.c ─┬─► base.h
            ├─► position.h ─► hash.h
            ├─► search.h  ─┬─► position.h / genmoves.h / movesort.h
            │              ├─► evaluate.h / openbook.h / hash.h
            │              └─► base.h
            └─► ucci.h    ─┬─► pipe.h
                           └─► position.h / search.h

genmoves.c   ─► base.h / position.h / genmoves.h
movesort.c   ─► base.h / position.h / genmoves.h / movesort.h
evaluate.c   ─► base.h / position.h / genmoves.h
hash.c       ─► hash.h (自包含)
openbook.c   ─► base.h / hash.h / position.h / movesort.h
```

---

## 5. 关键算法与设计要点

### 5.1 搜索算法组合

| 技术 | 位置 | 说明 |
| :-- | :-- | :-- |
| Negascout（PVS 变体） | `search.c::nega_scout` | 第一个子节点全窗口，后续用 `(a, a+1)` 极小窗口，失败则重搜 |
| α-β 剪枝 | `nega_scout / quiescence_search` | `if (a >= beta) break/return` |
| 迭代加深（ID） | `think()` | 从 depth=1 增到 `MAX_SEARCH_DEPTH`（50），由 6s 时限中断；`go depth N` **不**限制层数 |
| 静态搜索（QS） | `quiescence_search()` | horizon 节点只扩展吃子，直到"安静"估值 |
| 置换表（TT） | `hash.c / search.c` | 存 `EXACT / ALPHA / BETA` + 最佳走法 hash_move |
| 历史启发（HH） | `movesort.c::save_history` | `history[from*256+to] += depth`（非平方），排序靠前 |
| MVV/LVA | `gen_cap_move` + `cap_values` / `protected` | 吃子分 = 被吃子价值 − 目标受保护时的攻击子价值 |
| Zobrist 哈希 | `position.c / hash.c` | 局面键值、重复检测、置换表索引、开局库匹配 |
| 时间控制 | `think()` | `LONGEST_SEARCH_TIME = 6000 ms`（默认 6s 内停搜） |

### 5.2 局面表示选择

- **16×16 一维数组 `board[256]` + 棋子编号表 `piece[48]`**：
  - 优点 1：走子方向可直接用整数偏移（如 `+0x10 = 下一行`），无需边界 if
  - 优点 2：被吃子/还原通过 `piece[pc] = 0 / pos` 实现，`unmake_move` 是 O(1)
  - 优点 3：便于 `zobrist_table[14][256]` 做位置相关哈希

### 5.3 Python↔引擎 交互

- **`cchess.py`** 用 `Popen + Queue + daemon thread` 实现非阻塞读取 `./harmless` 的 stdout
- **命令序列**：
  1. 启动时只发 `ucci`，等到 `ucciok`
  2. 每步走子后：`position fen <FEN>` 然后 `go depth <N>`
  3. 解析 `bestmove aabb` → `str_to_move` 在 GUI 端回放
  4. 空格新局才发 `setoption newgame`

### 5.4 走法合法性两阶段

- Python GUI（`chessboard`）：做一次"走子不被将军"的检测，保证用户走子合法
- C 引擎（`genmoves.c::save_move`）：同样进行 `check(side)` 过滤，保证搜索树中的走法全部合法

---

## 6. 常见扩展点 / 调试入口

| 需求 | 相关位置 |
| :-- | :-- |
| 调整搜索时间 | `search.h::LONGEST_SEARCH_TIME`（实际停搜条件，默认 6000ms） |
| 调整 GUI 发给引擎的 `go depth N` | `pycchess/common.py::AI_SEARCH_DEPTH`（当前 **不** 限制 C 引擎迭代层数） |
| 更换评估权重 | `evaluate.c::position_values`、`F_*` 宏（`evaluate.h`） |
| 新增开局库条目 | `pycchess/BOOK.DAT`（文本行：`move score fen`），解析见 `openbook.c` |
| 更换哈希表大小 | `hash.h::HASH_TABLE_SIZE`（项数，须为 2 的幂；不是字节数） |
| 关闭/开启静态搜索 | `search.c::quiescence_search` 入口或 `nega_scout` 中 `depth<=0` 分支 |
| 调试 UCCI 通信 | 在 `pycchess/` 下运行 `./harmless` 手动输入命令；或在 Python 端将 `Queue` 内容全部打印 |
| Windows 发布 | `pycchess-win32-*.zip` 打包 `cchess.exe + harmless.exe + image + sounds + BOOK.DAT` |

---

## 7. 参考协议

- **UCCI（Universal Chinese Chess Interface）**：类似国际象棋的 UCI，用于 GUI↔引擎通信；命令字串格式：`position fen <FEN>` / `go depth N` / `bestmove <move>` 等
- **FEN（Forsyth–Edwards Notation）** 中国象棋版本：首行从黑方视角书写，`rnbakabnr/9/...`，空格分隔 active-color（本项目引擎用 `w/b`）

---

*本 Wiki 基于 `harmless` 仓库的实际源码整理。如有修改，请同步更新对应章节的文件与函数引用。*
