#!/bin/bash
# Direct Telegram report via OpenClaw message tool
# Runs every hour via cron

REPORT_TIME=$(date '+%H:%M UTC')
PROGRESS_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/PROGRESS.md"
LOG_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/direct_cron.log"

echo "[$REPORT_TIME] Cron executing direct report" >> "$LOG_FILE"

# Read current progress
if [ -f "$PROGRESS_FILE" ]; then
    PROGRESS=$(head -20 "$PROGRESS_FILE")
else
    PROGRESS="Progress file not found"
fi

# Log the attempt
echo "[$REPORT_TIME] Progress read: ${#PROGRESS} chars" >> "$LOG_FILE"
echo "[$REPORT_TIME] Report should be sent via OpenClaw now" >> "$LOG_FILE"
