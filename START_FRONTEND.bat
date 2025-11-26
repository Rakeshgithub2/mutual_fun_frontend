@echo off
title Frontend Server - Port 5001
cd /d "C:\mutual fund"
echo.
echo ====================================
echo   STARTING FRONTEND SERVER
echo ====================================
echo.
echo Port: 5001
echo URL: http://localhost:5001
echo.
echo Keep this window open!
echo Press Ctrl+C to stop
echo.
npm run dev
pause
