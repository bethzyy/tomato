@echo off
echo 正在构建番茄钟应用...
cd /d "%~dp0"
if not exist dist mkdir dist
pyinstaller PomodoroTimer_optimized.spec --clean
if %ERRORLEVEL% EQU 0 (
    echo.
    echo 构建成功！生成的可执行文件位于 dist\PomodoroTimer.exe
) else (
    echo.
    echo 构建失败，请检查错误信息。
)
echo.
pause