@echo off
echo ================================
echo   EcoUAZ - Starting Application
echo ================================
echo.

echo [1/2] Checking if backend dependencies are installed...
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed!
)

echo.
echo [2/2] Checking if frontend dependencies are installed...
cd client
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed!
)
cd ..

echo.
echo ================================
echo   Starting Servers...
echo ================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001 (or next available port)
echo.
echo Press Ctrl+C to stop both servers
echo ================================
echo.

:: Start backend in new window
start "EcoUAZ Backend" cmd /k "npm run dev"

:: Wait a bit for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend in new window
start "EcoUAZ Frontend" cmd /k "cd client && npm start"

echo.
echo Both servers are starting in separate windows!
echo You can close this window.
echo.
pause
