@echo off
echo Starting StudyGenie Server...

echo [%DATE% %TIME%] Starting server... > server.log
echo Node.js version: >> server.log
node -v >> server.log 2>&1
echo. >> server.log

echo [%DATE% %TIME%] Running npm list... >> server.log
npm list --depth=0 >> server.log 2>&1
echo. >> server.log

echo [%DATE% %TIME%] Starting server.js... >> server.log
node server.js >> server.log 2>&1

if %ERRORLEVEL% neq 0 (
    echo [%DATE% %TIME%] Server failed to start >> server.log
    echo Server failed to start. Check server.log for details.
    type server.log
    pause
) else (
    echo Server started successfully. Check server.log for output.
    pause
)
