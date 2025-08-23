@echo off
echo Starting StudyGenie Server...
echo ===========================

:: Check if Node.js is installed
node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

:: Start the server
echo Starting server...
start "" http://localhost:3000
call node server.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to start server
    pause
    exit /b 1
)

:: This line will be reached only if the server fails to start
pause
