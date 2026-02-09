# HEARTBEAT.md - POXSO HUNTER V3 PRO

## Check every heartbeat

### 1. Check for report trigger
Look for file: `/root/.openclaw/workspace/pokso-cyberpunk/hunter/v3/logs/.send_report`

If exists:
- Read PROGRESS.md
- Read TASKS.md
- Send report to Telegram (openthepancake)
- Delete trigger file
- DO NOT reply HEARTBEAT_OK

### 2. Development Status Check
Check what was last worked on in the session history.

### 3. Update progress
If significant work done, update PROGRESS.md

## Report Format
📊 RAPPORT [HEURE] - [ETAPE] - [% PROGRESSION]

✅ Fait:
- [items]

🧩 En cours:
- [items]

⏭️ Prochaines tâches:
1. [task]
2. [task]
3. [task]

## Current Status
Phase 2: Core Engine (35%)
Last worked: Player.js, Enemy.js, MenuScene.js, BootScene.js
Next: GameScene.js

## If nothing to report
Reply: HEARTBEAT_OK
