#!/bin/bash
# pokso-report.sh - Rapport manuel toutes les heures

LOG_FILE="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/heartbeat.txt"
REPORT_LOG="/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/reports.log"

while true; do
    # Attendre le prochain round hour
    CURRENT_MIN=$(date +%M)
    SLEEP_MIN=$((60 - CURRENT_MIN))
    SLEEP_SEC=$((SLEEP_MIN * 60))
    
    echo "[$(date)] Sleeping ${SLEEP_SEC}s until next hour..." >> "$REPORT_LOG"
    sleep "$SLEEP_SEC"
    
    # Créer le rapport
    echo "[$(date)] === POXSO HUNTER REPORT ===" >> "$REPORT_LOG"
    
    # Lire PROGRESS.md
    if [ -f "/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/PROGRESS.md" ]; then
        cat "/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/PROGRESS.md" >> "$REPORT_LOG"
    fi
    
    echo "" >> "$REPORT_LOG"
    
    # Attendre 1 minute pour éviter double exécution
    sleep 60
done
