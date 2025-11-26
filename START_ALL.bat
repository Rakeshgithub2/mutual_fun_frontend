@echo off
title Starting All Servers
echo.
echo ====================================
echo   MUTUAL FUND PLATFORM
echo ====================================
echo.
echo Starting Backend Server...
start "Backend - Port 3002" cmd /k "cd /d C:\mutual fund\mutual-funds-backend && npm run dev"
timeout /t 5 /nobreak > nul
echo.
echo Starting Frontend Server...
start "Frontend - Port 5001" cmd /k "cd /d C:\mutual fund && npm run dev"
echo.
echo ====================================
echo   SERVERS STARTED!
echo ====================================
echo.
echo Backend:  http://localhost:3002
echo Frontend: http://localhost:5001
echo.
echo Check the opened terminal windows for server logs
echo.
pause
