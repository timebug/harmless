# harmless

一个中国象棋引擎 (A Chinese Chess Engine)

## 项目简介

harmless 是一个功能完整的中国象棋（象棋）引擎项目，包含：

- **引擎核心**：用 C 语言实现的高效象棋引擎
- **图形界面**：基于 Python + Pygame 的友好用户界面
- **网络对战**：支持网络连接进行双人对战

## 安装说明

### Linux 和 macOS 用户

#### 环境要求

* Python 2.7.x
* Pygame 1.9.x
* GCC 编译器

#### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/timebug/harmless.git
   cd harmless
   ```

2. 编译并安装
   ```bash
   make && make install
   ```

3. 运行游戏
   ```bash
   cd pycchess
   python cchess.py
   ```

### Windows 用户

1. 访问 <https://github.com/timebug/harmless/releases>
2. 下载最新的 Windows 版本压缩包
3. 解压后运行 `cchess.exe`

## 使用方法

### 人机对战

直接运行程序即可与电脑对战（默认执红方）：
```bash
python cchess.py
```

### 网络对战

作为红方连接到主机：
```bash
python cchess.py -nr <主机地址>
```

作为黑方连接到主机：
```bash
python cchess.py -nb <主机地址>
```

## 快捷键

* `空格 (Space)`：开始新游戏

## 项目结构

```
harmless/
├── src/              # C 语言引擎源代码
│   ├── base.h        # 基础定义
│   ├── position.h    # 棋盘位置管理
│   ├── genmoves.h    # 着法生成
│   ├── evaluate.h    # 局面评估
│   ├── search.h      # 搜索算法
│   └── ...
├── pycchess/         # Python GUI
│   ├── cchess.py     # 主程序
│   ├── chessboard.py # 棋盘管理
│   ├── chessman.py   # 棋子管理
│   ├── chessnet.py   # 网络功能
│   └── image/        # 图像资源
└── Makefile
```

## 许可证

本项目采用 GPL v3 许可证发布。详见源代码中的版权声明。
