#!/bin/bash
# Report trigger - runs every minute for testing
# Creates trigger file that agent will detect

TRIGGER_DIR="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs"
TRIGGER_FILE="$TRIGGER_DIR/.report_trigger"
LOG_FILE="$TRIGGER_DIR/minute_cron.log"

# Create trigger file with timestamp
echo "$(date '+%Y-%m-%d %H:%M:%S')" > "$TRIGGER_FILE"

# Log
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Trigger created" >> "$LOG_FILE"
