@echo off
echo Starting StudyGenie Server...
node -v
npm -v

echo.
echo Setting environment variables...
set NODE_ENV=development
set PORT=5000
set MONGO_URI=mongodb://localhost:27017/studygenie
set JWT_SECRET=your_secure_jwt_secret_key_here
set JWT_EXPIRE=30d
set FRONTEND_URL=http://localhost:3000
set UPLOAD_DIR=./uploads

echo.
echo Checking if port 5000 is in use...
netstat -ano | findstr :5000

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
