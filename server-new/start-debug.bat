@echo off
echo Starting StudyGenie Server with debug output...
node debug.js > debug.log 2>&1
if %ERRORLEVEL% neq 0 (
    echo Failed to start server. Check debug.log for details.
    type debug.log
    pause
) else (
    echo Server started successfully. Check debug.log for output.
)
pause
