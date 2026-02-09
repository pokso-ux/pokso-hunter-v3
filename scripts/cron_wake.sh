#!/bin/bash
# Trigger OpenClaw cron wake for hourly report
# This tells OpenClaw to send the progress report

# Use curl to trigger OpenClaw gateway wake endpoint
# The message will be processed by the agent

curl -s -X POST http://localhost:8080/api/cron/wake \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Envoie un rapport de progression POXSO HUNTER maintenant à openthepancake sur Telegram. Lis PROGRESS.md et TASKS.md dans /root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/ puis envoie le rapport avec l heure actuelle, l etape en cours, le pourcentage de progression, ce qui est fait, ce qui est en cours, et les prochaines taches."
  }' 2>/dev/null || echo "Direct wake not available"

# Fallback: create trigger file for heartbeat detection
touch /root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/.send_report_now

echo "[$(date)] Report triggered" >> /root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/cron_wake.log
