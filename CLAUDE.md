# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pomodoro Timer (番茄闹钟) desktop application built with Python and web technologies. The app uses `pywebview` to create a native desktop window that displays a web-based timer interface.

## Architecture

### Backend (Python)
- **app.py**: Main entry point that:
  - Spawns a local HTTP server on a dynamic free port
  - Serves static HTML/CSS/JS files
  - Creates a pywebview window (300x320px, non-resizable) pointing to the local server
  - Uses SimpleHTTPRequestHandler for serving static files

### Frontend (Web)
- **index.html**: App structure with timer display, controls, and progress bar
- **style.css**: Gradient styling with animations (pulse, blink effects)
- **script.js**: PomodoroTimer class managing:
  - Timer countdown logic
  - Start/pause/reset controls
  - LocalStorage persistence for time settings
  - Progress bar updates
  - Audio alerts using Web Audio API
  - Browser notifications

### Build System
- **PomodoroTimer_optimized.spec**: PyInstaller configuration with:
  - Bundles HTML/CSS/JS as data files
  - Excludes unnecessary Python packages (tkinter, numpy, pandas, etc.) to reduce size
  - Console-less windowed executable
  - UPX compression enabled
- **build_app.bat**: Windows batch script to build the executable

## Common Commands

### Development
```bash
# Run the app from source
python app.py
```

### Building
```bash
# Build executable (Windows)
.\build_app.bat

# Or manually with PyInstaller
pyinstaller PomodoroTimer_optimized.spec --clean
```

### Dependencies
```bash
pip install pywebview pyinstaller
```

## Key Technical Details

- **Dynamic Port Allocation**: The HTTP server automatically finds an available port using socket binding
- **State Persistence**: Timer settings (time value and unit) are saved to localStorage
- **Audio Implementation**: Uses both Web Audio API oscillators and fallback HTML5 audio
- **Window Constraints**: Fixed 300x320px size, non-resizable, minimum size 240x280px
- **Build Optimization**: Excludes many standard Python packages to keep executable size ~16MB

## File Locations

- Built executable: `dist/PomodoroTimer.exe`
- Source files: `app.py`, `index.html`, `style.css`, `script.js`
- Build config: `PomodoroTimer_optimized.spec`, `build_app.bat`
