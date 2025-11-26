@echo off
echo.
echo ========================================
echo   FIXING BACKEND - COMPLETE RESTART
echo ========================================
echo.

echo Step 1: Killing all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

echo Step 2: Verifying database has funds...
cd "C:\mutual fund\mutual-funds-backend"
node -e "const {MongoClient}=require('mongodb');(async()=>{const c=new MongoClient('mongodb://localhost:27017');await c.connect();const n=await c.db('mutual_funds_db').collection('funds').countDocuments();console.log('Funds in DB:',n);await c.close();})()"

echo.
echo Step 3: Starting backend server...
echo Backend will start in a NEW window
echo Keep that window open!
echo.
start "Backend Server - Port 3002" cmd /k "cd /d C:\mutual fund\mutual-funds-backend && npm run dev"

echo.
echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak

echo.
echo Step 4: Testing API...
powershell -Command "try { $r = Invoke-RestMethod 'http://localhost:3002/api/funds?limit=3'; Write-Host 'SUCCESS! Funds:' $r.pagination.total -ForegroundColor Green; $r.data | ForEach-Object { Write-Host '  -' $_.name } } catch { Write-Host 'ERROR:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo ========================================
echo   Now refresh your browser!
echo   Press Ctrl+Shift+R at localhost:5001
echo ========================================
echo.
pause
