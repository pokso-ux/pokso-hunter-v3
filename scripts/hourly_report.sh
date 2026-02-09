#!/bin/bash
# Hourly report trigger for POXSO HUNTER
# This script triggers a report via OpenClaw gateway

PROGRESS_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/PROGRESS.md"
TASKS_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/TASKS.md"
LOG_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/cron_reports.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cron triggered" >> "$LOG_FILE"

# Read progress
if [ -f "$PROGRESS_FILE" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Progress file found" >> "$LOG_FILE"
    head -20 "$PROGRESS_FILE" >> "$LOG_FILE"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Progress file not found" >> "$LOG_FILE"
fi

echo "---" >> "$LOG_FILE"
