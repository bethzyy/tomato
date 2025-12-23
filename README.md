# 番茄闹钟

一个简洁美观的番茄工作法计时器应用，帮助您提高工作效率。

## 功能特点

- 支持分钟和秒两种时间单位，用户可根据需要选择
- 简洁美观的用户界面
- 实时进度条显示
- 工作/休息时间可自定义设置
- 响铃提醒功能
- 响应式设计，适配不同屏幕尺寸

## 使用方法

### 方式一：直接运行可执行文件（推荐）
1. 运行 `dist` 目录下的 `PomodoroTimer.exe` 文件
2. 或运行 `番茄闹钟.bat` 批处理文件快速启动

### 方式二：源码运行
1. 确保已安装Python 3.x和webview库
2. 在项目目录下运行：`python app.py`

### 方式三：重新构建应用
运行 `build_app.bat` 批处理文件，将使用优化配置重新构建可执行文件。

## 项目结构
- `app.py` - 主程序文件，包含服务器和窗口创建逻辑
- `index.html` - 应用界面结构
- `style.css` - 样式定义
- `script.js` - 客户端交互逻辑
- `build_app.bat` - 构建脚本
- `PomodoroTimer_optimized.spec` - PyInstaller优化配置文件
- `dist/` - 构建输出目录
- `番茄闹钟.bat` - 快速启动批处理文件

## 优化特性

- 启动速度快（文件大小已优化至约16MB）
- 窗口大小与界面内容完美匹配
- 减少不必要的空白空间
- 响应式设计适配各种屏幕

## 开发环境

- Python 3.x
- pywebview 库
- PyInstaller（用于打包）

## 构建说明
如需重新构建可执行文件，请按照以下步骤操作：

1. 确保已安装Python环境
2. 安装所需依赖库：
   ```
   pip install pywebview pyinstaller
   ```
3. 在项目根目录下运行以下命令构建可执行文件：
   ```
   pyinstaller --onefile --windowed --add-data "index.html;." --add-data "style.css;." --add-data "script.js;." --name "PomodoroTimer" app.py
   ```
   或者直接运行以下脚本（Windows）：
   ```
   .\build_app.bat
   ```
4. 构建完成后，可执行文件将生成在 `dist/` 目录下

## 依赖
- Python 3.x
- pywebview
- pyinstaller