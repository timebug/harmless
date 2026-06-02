# harmless

一个中国象棋（Xiangqi）引擎，使用 UCCI 协议。

仓库同时包含：

- `src/`：C 语言实现的引擎（生成可执行文件 `harmless`）
- `pycchess/`：基于 pygame 的简易 UI（Python 2.7）

## 编译

### 引擎

依赖：`gcc`/`clang`、`make`

```bash
make
```

产物：`src/harmless`

可选：将引擎复制到 UI 目录（便于与 `BOOK.DAT` 一起运行）

```bash
make install
```

### UI（可选）

依赖：Python 2.7、pygame 1.9.x

说明：`pycchess/` 目前为 Python 2 代码（使用 `Queue`、`print` 语法等），未做 Python 3 兼容。

## 运行

### 1) 仅运行引擎（UCCI）

引擎默认会尝试从当前工作目录读取开局库文件 `BOOK.DAT`；如果文件不存在则会跳过开局库加载。

```bash
./src/harmless
```

手工测试示例：

```text
ucci
isready
position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1
go depth 5
```

### 2) 运行 pygame UI（Python 2.7）

```bash
make install
cd pycchess
python2.7 cchess.py
```

## 快捷键

- `Space`：新开一局

## License

GPLv3（详见源文件头部声明）
