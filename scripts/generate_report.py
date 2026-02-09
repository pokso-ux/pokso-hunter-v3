#!/usr/bin/env python3
"""
POXSO HUNTER - Hourly Progress Report
Sends automatic progress reports to Telegram
"""

import os
import sys
import json
from datetime import datetime

# Read progress files
PROGRESS_FILE = "/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/PROGRESS.md"
TASKS_FILE = "/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/TASKS.md"
LOG_FILE = "/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/cron_reports.log"

def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(f"[{datetime.now().isoformat()}] {msg}\n")

def read_progress():
    try:
        with open(PROGRESS_FILE, "r") as f:
            return f.read()
    except:
        return "Progress file not found"

def read_tasks():
    try:
        with open(TASKS_FILE, "r") as f:
            return f.read()
    except:
        return "Tasks file not found"

def generate_report():
    now = datetime.now().strftime("%Y-%m-%d %H:%M UTC")
    progress = read_progress()
    tasks = read_tasks()
    
    report = f"""
📊 RAPPORT AUTOMATIQUE - POXSO HUNTER

🕒 {now}

📄 PROGRESS.md:
{progress[:500]}

📋 TASKS.md:
{tasks[:500]}

---
Prochain rapport dans 1 heure.
"""
    return report

if __name__ == "__main__":
    log("Report generator started")
    report = generate_report()
    log(f"Generated report: {len(report)} chars")
    print(report)
    log("Report complete")
