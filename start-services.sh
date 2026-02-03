#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "--- Starting Intelligent Resume Screening System ---"

# 1. Start Python ML Engine in the background
echo "[INFO] Starting Python ML Engine on port 5001..."
cd /app/ml_engine
# Using unbuffered output (-u) so logs show up immediately
python -u app.py &
ML_PID=$!

# Wait a few seconds to ensure Python starts (optional but helpful)
sleep 5

# Check if Python process is still running
if ! kill -0 $ML_PID > /dev/null 2>&1; then
    echo "[ERROR] ML Engine failed to start."
    exit 1
fi
echo "[INFO] ML Engine started (PID: $ML_PID)"

# 2. Start Node.js Server
echo "[INFO] Starting Node.js Server..."
cd /app/server
# npm start executes "node server.js"
npm start
