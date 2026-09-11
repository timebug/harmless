# Harmless 象棋引擎

一个中国象棋（Chinese Chess）引擎，包含 C 语言编写的 AI 引擎和 Python 编写的图形界面。

## 功能特性

- 🎮 **人机对战**：与 AI 引擎对弈
- 🌐 **网络对战**：支持双人网络对战
- 🔊 **音效支持**：移动、吃子、将军音效
- 📖 **开局库**：内置开局数据库 (BOOK.DAT)
- 🎯 **UCCI 协议**：引擎支持 UCCI (Universal Chinese Chess Interface) 协议

## 项目结构

```
harmless/
├── src/                # C 语言象棋引擎源码
│   ├── harmless.c      # 主程序入口
│   ├── search.c        # 搜索算法
│   ├── evaluate.c      # 局面评估
│   ├── genmoves.c      # 走法生成
│   ├── position.c      # 棋盘位置处理
│   ├── hash.c          # 哈希表
│   ├── openbook.c      # 开局库
│   └── ucci.c          # UCCI 协议实现
├── pycchess/           # Python 图形界面
│   ├── cchess.py       # 主程序
│   ├── chessboard.py   # 棋盘逻辑
│   ├── chessman.py     # 棋子逻辑
│   ├── chessnet.py     # 网络对战
│   ├── image/          # 棋子图片资源
│   └── sounds/         # 音效文件
├── Makefile            # 构建脚本
└── README.md
```

## 安装说明

### 环境要求

- **GCC**: C 编译器
- **Python 2.7.x**: <http://python.org>
- **Pygame 1.9.x**: <http://pygame.org>

### GNU/Linux 和 macOS

```bash
# 克隆仓库
git clone https://github.com/timebug/harmless.git
cd harmless

# 编译引擎并安装
make && make install

# 运行游戏
cd pycchess && python cchess.py
```

#### macOS 安装 Pygame 提示

参考：<http://stackoverflow.com/questions/7288571/best-way-to-install-pygame-on-os-x-lion>

### Windows

1. 访问 <https://github.com/timebug/harmless/downloads>
2. 下载 `pycchess-win32-*.zip` 并解压
3. 运行 `cchess.exe`

## 使用说明

### 游戏模式

**人机对战（默认）**：
```bash
cd pycchess && python cchess.py
```

**网络对战**：
```bash
# 红方
python cchess.py -nr <host>

# 黑方
python cchess.py -nb <host>
```

### 键盘快捷键

| 按键 | 功能 |
|------|------|
| `Space` | 开始新游戏 |

### 游戏操作

- 鼠标点击选择棋子
- 再次点击目标位置移动棋子

## 技术实现

### 引擎特性

- **Alpha-Beta 剪枝搜索**
- **置换表 (Transposition Table)**
- **走法排序优化**
- **开局库支持**
- **局面评估函数**

### UCCI 协议

引擎支持 UCCI 协议，可与其他支持 UCCI 的界面程序配合使用。

## 许可证

本项目采用 GNU General Public License v3.0 许可证。

## 致谢

- pycchess UI - Copyright (C) 2011 - 2015 timebug
