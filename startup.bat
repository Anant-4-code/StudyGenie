@echo off
echo Starting StudyGenie Server...
echo ===========================

echo [%DATE% %TIME%] Checking Node.js installation...
node -v > node-version.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not properly installed or not in PATH
    pause
    exit /b 1
)

echo [%DATE% %TIME%] Starting server...
node serve-http.js > server-output.log 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to start server. Check server-output.log for details.
    type server-output.log
    pause
    exit /b 1
) else (
    echo Server started successfully. Open http://localhost:8080 in your browser.
    echo Press any key to stop the server...
    pause > nul
    taskkill /F /IM node.exe >nul 2>&1
    echo Server stopped.
)

pause
