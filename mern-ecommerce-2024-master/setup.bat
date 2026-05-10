@echo off
echo ========================================
echo   MERN Ecommerce - Setup & Start
echo ========================================
echo.

echo [1/4] Installing server dependencies...
cd /d "%~dp0server"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Server dependencies failed!
    pause
    exit /b 1
)
echo Server dependencies installed successfully!
echo.

echo [2/4] Installing client dependencies...
cd /d "%~dp0client"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Client dependencies failed!
    pause
    exit /b 1
)
echo Client dependencies installed successfully!
echo.

echo [3/4] Starting backend server (port 5000)...
cd /d "%~dp0server"
start "MERN Backend" cmd /k "node server.js"
echo Backend server starting...
timeout /t 3 /nobreak >nul
echo.

echo [4/4] Starting frontend (port 5173)...
cd /d "%~dp0client"
start "MERN Frontend" cmd /k "npm run dev"
echo Frontend starting...
echo.

echo ========================================
echo   Both servers are starting up!
echo   Backend:  http://localhost:8000

echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo IMPORTANT: Make sure you have:
echo   1. Edited server\.env with your MongoDB URI
echo   2. Created a MongoDB Atlas cluster (free tier)
echo.
pause
