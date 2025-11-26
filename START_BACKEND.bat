@echo off
title Backend Server - Port 3002
cd /d "C:\mutual fund\mutual-funds-backend"
echo.
echo ====================================
echo   STARTING BACKEND SERVER
echo ====================================
echo.
echo Port: 3002
echo API: http://localhost:3002/api
echo.
echo Keep this window open!
echo Press Ctrl+C to stop
echo.
npm run dev
pause
