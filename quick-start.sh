#!/bin/bash

# Quick Start Script for Apartment Complaint System (macOS/Linux)

echo ""
echo "============================================================"
echo "  Apartment Complaint & Management System - Quick Start"
echo "============================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[1/3] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: npm install failed"
        exit 1
    fi
    echo "[✓] Dependencies installed"
else
    echo "[✓] Dependencies already installed"
fi

echo ""
echo "[2/3] Seeding demo data..."
node seed-demo-data.js
if [ $? -ne 0 ]; then
    echo "WARNING: Could not seed demo data. Make sure MongoDB is running!"
    echo ""
    echo "For MongoDB:"
    echo "- Install from: https://www.mongodb.com/try/download/community"
    echo "- Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
    echo ""
fi

echo ""
echo "[3/3] Starting server..."
echo ""
echo "============================================================"
echo "  Server starting on http://localhost:5000"
echo "  Press Ctrl+C to stop the server"
echo "============================================================"
echo ""

npm start
