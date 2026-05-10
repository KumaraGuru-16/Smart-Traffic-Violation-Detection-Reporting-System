@echo off
echo ============================================
echo   Traffic Violation System - Starting...
echo ============================================
echo.
echo Starting Backend Server (port 5000)...
start "Backend Server" cmd /k "cd backend && npm start"
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul
echo.
echo Starting Frontend Server (port 3000)...
start "Frontend Server" cmd /k "cd frontend && npm start"
echo.
echo ============================================
echo   Both servers are starting!
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ============================================
