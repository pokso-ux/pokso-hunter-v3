#!/bin/bash
# watchdog.sh - Surveillance du process de dev

PROJECT_DIR="/root/.openclaw/workspace/pokso-cyberpunk"
HEARTBEAT_FILE="$PROJECT_DIR/hunter/v3/logs/heartbeat.txt"
LOG_FILE="$PROJECT_DIR/hunter/v3/logs/watchdog.log"
MAX_AGE=5400  # 90 minutes en secondes

# Créer les dossiers si besoin
mkdir -p "$PROJECT_DIR/hunter/v3/logs"

# Vérifier si heartbeat existe
if [ ! -f "$HEARTBEAT_FILE" ]; then
    echo "[$(date)] WARNING: No heartbeat file found" >> "$LOG_FILE"
    exit 0
fi

# Vérifier l'âge du heartbeat
LAST_HEARTBEAT=$(stat -c %Y "$HEARTBEAT_FILE" 2>/dev/null || stat -f %m "$HEARTBEAT_FILE" 2>/dev/null)
CURRENT_TIME=$(date +%s)
AGE=$((CURRENT_TIME - LAST_HEARTBEAT))

if [ $AGE -gt $MAX_AGE ]; then
    echo "[$(date)] ALERT: Heartbeat too old (${AGE}s), restarting dev process..." >> "$LOG_FILE"
    
    # Log l'action
    echo "[$(date)] Restarting POXSO HUNTER dev..." >> "$LOG_FILE"
    
    # Redémarrer (à adapter selon le process)
    # Exemple: relancer un script node
    # cd "$PROJECT_DIR" && node hunter/v3/scripts/dev.js >> "$LOG_FILE" 2>&1 &
    
else
    echo "[$(date)] OK: Heartbeat fresh (${AGE}s ago)" >> "$LOG_FILE"
fi
