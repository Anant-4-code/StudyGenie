@echo off
echo Starting StudyGenie Application...

:: Check if MongoDB is running
echo.
echo Checking MongoDB...
net start | findstr /i "MongoDB" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo MongoDB is not running. Please start MongoDB service first.
    echo You can start it with: net start MongoDB
    pause
    exit /b 1
)

:: Start backend server
echo.
echo Starting backend server...
start "StudyGenie Backend" /D server node index.js

:: Wait for backend to start
timeout /t 5 /nobreak >nul

:: Start frontend
echo.
echo Starting frontend...
start "StudyGenie Frontend" /D client npm start

echo.
echo Application is starting...
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000

pause
