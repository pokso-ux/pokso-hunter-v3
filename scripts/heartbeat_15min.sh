#!/bin/bash
# Create heartbeat trigger every 15 minutes

echo "$(date '+%s')" > /root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/.send_report
echo "[$(date '+%H:%M')] 15-min trigger" >> /root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/heartbeat_15min.log
