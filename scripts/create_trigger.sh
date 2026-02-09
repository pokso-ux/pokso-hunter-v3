#!/bin/bash
# Create report trigger every minute

TRIGGER_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/.send_report"
LOG_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/cron_minute.log"

echo "$(date '+%Y-%m-%d %H:%M:%S')" > "$TRIGGER_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Trigger created by cron" >> "$LOG_FILE"
