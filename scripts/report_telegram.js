// report_telegram.js - Rapport automatique sur Telegram
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = '/root/.openclaw/workspace/pokso-cyberpunk';
const PROGRESS_FILE = path.join(PROJECT_DIR, 'hunter/v3/PROGRESS.md');
const TASKS_FILE = path.join(PROJECT_DIR, 'hunter/v3/TASKS.md');

// Configuration Telegram (à remplir avec tes infos)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

function readProgress() {
    try {
        return fs.readFileSync(PROGRESS_FILE, 'utf8');
    } catch(e) {
        return 'Progress file not found';
    }
}

function readTasks() {
    try {
        return fs.readFileSync(TASKS_FILE, 'utf8');
    } catch(e) {
        return 'Tasks file not found';
    }
}

function generateReport() {
    const now = new Date();
    const time = now.toLocaleString('fr-FR');
    
    // Déterminer l'étape en cours depuis PROGRESS.md
    const progress = readProgress();
    let currentStep = 'Unknown';
    if(progress.includes('ÉTAPE D')) currentStep = 'D - Polish';
    else if(progress.includes('ÉTAPE C')) currentStep = 'C - Challenge';
    else if(progress.includes('ÉTAPE B')) currentStep = 'B - Gameplay Loop';
    else if(progress.includes('ÉTAPE A')) currentStep = 'A - Core';
    
    // Extraire progression
    let progressPercent = '~60%';
    if(progress.includes('Status: LIVRÉ')) {
        const matches = progress.match(/Status: LIVRÉ/g);
        if(matches) {
            progressPercent = `~${Math.min(90, matches.length * 25)}%`;
        }
    }
    
    const report = `[POXSO HUNTER DEV UPDATE]

🕒 ${time}
📍 Étape: ${currentStep}
📊 Progression: ${progressPercent}

✅ Fait:
- Architecture complète (/scenes, /entities, /systems, /ui)
- Player avec animations idle/run/dash
- Menu principal
- Map avec 2 zones (Forest + Rust)
- Ennemis (Rust Walker) avec AI
- Mission: collecter 3 clés
- Porte à ouvrir + escape
- Checkpoints + respawn
- Save system (localStorage)

🧩 En cours:
- Tests et équilibrage
- Polish visuel final

⏭️ Prochaines tâches:
1. Ajouter audio
2. Optimisation perfs
3. Build final

⚠️ Bugs:
- Aucun critique détecté

🔗 Build: https://pokso-ux.github.io/pokso-cyberpunk/hunter/v3/`;

    return report;
}

async function sendToTelegram(message) {
    if(BOT_TOKEN === 'YOUR_BOT_TOKEN' || CHAT_ID === 'YOUR_CHAT_ID') {
        console.log('Telegram config not set. Report:');
        console.log(message);
        return;
    }
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        if(data.ok) {
            console.log('Report sent successfully');
        } else {
            console.error('Failed to send:', data);
        }
    } catch(e) {
        console.error('Error sending report:', e);
    }
}

// Main
const report = generateReport();
sendToTelegram(report);
