@echo off
REM Quick Start Script for Apartment Complaint System
REM Run this script to set up and start the application

echo.
echo ============================================================
echo   Apartment Complaint & Management System - Quick Start
echo ============================================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo [1/3] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
    echo [✓] Dependencies installed
) else (
    echo [✓] Dependencies already installed
)

echo.
echo [2/3] Seeding demo data...
REM Check if MongoDB is running
node seed-demo-data.js
if %errorlevel% neq 0 (
    echo WARNING: Could not seed demo data. Make sure MongoDB is running!
    echo.
    echo For MongoDB:
    echo - Install from: https://www.mongodb.com/try/download/community
    echo - Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
    echo.
    pause
)

echo.
echo [3/3] Starting server...
echo.
echo ============================================================
echo   Server starting on http://localhost:5000
echo   Press Ctrl+C to stop the server
echo ============================================================
echo.

call npm start
