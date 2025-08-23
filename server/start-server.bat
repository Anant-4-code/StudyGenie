@echo off
echo Starting StudyGenie Server...
node -v
npm -v
echo.
echo Checking if port 5001 is in use...
netstat -ano | findstr :5001

echo.
echo Starting server...
node index.js

if %errorlevel% neq 0 (
    echo.
    echo Server failed to start. Error code: %errorlevel%
    echo.
    echo Checking for Node.js processes...
    tasklist | findstr /i "node"
    echo.
    echo Please check the error messages above.
) else (
    echo.
    echo Server started successfully on port 5001
)

pause
