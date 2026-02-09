#!/bin/bash
# pokso-cron-trigger.sh - Trigger hourly report
# This runs every hour and creates a trigger file

TRIGGER_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/.send_report"
LOG_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/cron_trigger.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cron triggered - creating trigger file" >> "$LOG_FILE"

# Create trigger file that the agent will check
touch "$TRIGGER_FILE"

# Also generate the report content
python3 /root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/scripts/generate_report.py >> "$LOG_FILE" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Trigger file created" >> "$LOG_FILE"
