/**
 * UIManager - HUD et notifications
 */

class UIManager {
    constructor(game) {
        this.game = game;
        this.notifications = [];
        this.fadeMessages = [];
        
        // Colors
        this.colors = {
            primary: '#00ffff',
            secondary: '#ff00ff',
            danger: '#ff0044',
            success: '#00ff88',
            warning: '#ffaa00',
            text: '#ffffff',
            dark: '#0a0a0f'
        };
    }
    
    notify(text, type = 'info', duration = 3000) {
        this.notifications.push({
            text,
            type,
            duration,
            timeLeft: duration,
            created: Date.now()
        });
    }
    
    fadeMessage(text, x, y, color = '#00ffff') {
        this.fadeMessages.push({
            text,
            x,
            y,
            color,
            life: 1.0,
            velocityY: -20
        });
    }
    
    update(deltaTime) {
        // Update notifications
        this.notifications = this.notifications.filter(n => {
            n.timeLeft -= deltaTime * 1000;
            return n.timeLeft > 0;
        });
        
        // Update fade messages
        this.fadeMessages = this.fadeMessages.filter(m => {
            m.life -= deltaTime * 2;
            m.y += m.velocityY * deltaTime;
            return m.life > 0;
        });
    }
    
    renderHUD(ctx, playerData) {
        // Health bar
        this.drawHealthBar(ctx, playerData);
        
        // Keys counter (mission progress)
        this.drawKeysCounter(ctx, playerData);
        
        // Inventory count
        this.drawInventoryCount(ctx, playerData);
        
        // Notifications
        this.drawNotifications(ctx);
        
        // Fade messages (in world space)
        this.drawFadeMessages(ctx);
    }
    
    drawHealthBar(ctx, playerData) {
        const x = 20;
        const y = 20;
        const width = 200;
        const height = 20;
        
        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, width, height);
        
        // Border
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Health fill
        const healthPercent = playerData.health / playerData.maxHealth;
        const fillColor = healthPercent > 0.5 ? this.colors.success : 
                         healthPercent > 0.25 ? this.colors.warning : this.colors.danger;
        
        ctx.fillStyle = fillColor;
        ctx.fillRect(x + 2, y + 2, (width - 4) * healthPercent, height - 4);
        
        // Text
        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`HP ${Math.floor(playerData.health)}/${playerData.maxHealth}`, x + width/2, y + 14);
    }
    
    drawKeysCounter(ctx, playerData) {
        const x = 20;
        const y = 50;
        
        // Icon
        ctx.fillStyle = this.colors.secondary;
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('🔑', x, y + 12);
        
        // Text
        ctx.fillStyle = this.colors.text;
        ctx.font = '14px Courier New';
        const keysText = `${playerData.keys}/3 KEYS`;
        ctx.fillText(keysText, x + 25, y + 12);
        
        // Mission hint if not complete
        if (playerData.keys < 3) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '10px Courier New';
            ctx.fillText('Collect all keys to open the door', x + 25, y + 26);
        } else {
            ctx.fillStyle = this.colors.success;
            ctx.font = 'bold 10px Courier New';
            ctx.fillText('DOOR UNLOCKED! Find the exit', x + 25, y + 26);
        }
    }
    
    drawInventoryCount(ctx, playerData) {
        const x = 20;
        const y = 85;
        
        ctx.fillStyle = this.colors.primary;
        ctx.font = '14px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`INV: ${playerData.inventory.length} items`, x, y);
    }
    
    drawNotifications(ctx) {
        const startX = 20;
        let startY = 120;
        
        this.notifications.forEach((notif, index) => {
            const alpha = Math.min(1, notif.timeLeft / 500);
            const y = startY + index * 30;
            
            // Background
            ctx.fillStyle = `rgba(10, 10, 15, ${alpha * 0.9})`;
            ctx.fillRect(startX, y, 250, 24);
            
            // Border color based on type
            const colors = {
                info: this.colors.primary,
                success: this.colors.success,
                warning: this.colors.warning,
                danger: this.colors.danger
            };
            
            ctx.strokeStyle = colors[notif.type] || this.colors.primary;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.strokeRect(startX, y, 250, 24);
            
            // Text
            ctx.fillStyle = this.colors.text;
            ctx.font = '12px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText(notif.text, startX + 10, y + 16);
            
            ctx.globalAlpha = 1;
        });
    }
    
    drawFadeMessages(ctx) {
        this.fadeMessages.forEach(msg => {
            ctx.globalAlpha = msg.life;
            ctx.fillStyle = msg.color;
            ctx.font = 'bold 14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(msg.text, msg.x, msg.y);
            ctx.globalAlpha = 1;
        });
    }
    
    drawMenuOverlay(ctx, title, options, selectedIndex) {
        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Title
        ctx.fillStyle = this.colors.primary;
        ctx.font = 'bold 48px Courier New';
        ctx.textAlign = 'center';
        ctx.shadowColor = this.colors.primary;
        ctx.shadowBlur = 20;
        ctx.fillText(title, ctx.canvas.width / 2, 150);
        ctx.shadowBlur = 0;
        
        // Subtitle
        ctx.fillStyle = this.colors.secondary;
        ctx.font = '16px Courier New';
        ctx.fillText('CYBERPUNK HUNTER SIMULATION', ctx.canvas.width / 2, 180);
        
        // Options
        options.forEach((option, index) => {
            const y = 280 + index * 50;
            
            if (index === selectedIndex) {
                // Selected highlight
                ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
                ctx.fillRect(ctx.canvas.width / 2 - 150, y - 30, 300, 40);
                
                ctx.fillStyle = this.colors.primary;
                ctx.font = 'bold 24px Courier New';
                ctx.fillText(`> ${option} <`, ctx.canvas.width / 2, y);
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '20px Courier New';
                ctx.fillText(option, ctx.canvas.width / 2, y);
            }
        });
        
        // Version footer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '12px Courier New';
        ctx.fillText('V3 PRO BUILD - PRESS ESC TO QUIT', ctx.canvas.width / 2, ctx.canvas.height - 30);
    }
    
    drawControlsScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = this.colors.primary;
        ctx.font = 'bold 36px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('CONTROLS', ctx.canvas.width / 2, 80);
        
        const controls = [
            ['MOVEMENT', 'WASD / ARROW KEYS'],
            ['INTERACT', 'SPACE / ENTER'],
            ['INVENTORY', 'I / TAB'],
            ['SAVE GAME', 'F5'],
            ['LOAD GAME', 'F9'],
            ['MENU', 'ESCAPE']
        ];
        
        let y = 150;
        controls.forEach(([action, keys]) => {
            ctx.fillStyle = this.colors.secondary;
            ctx.font = 'bold 18px Courier New';
            ctx.textAlign = 'right';
            ctx.fillText(action, ctx.canvas.width / 2 - 20, y);
            
            ctx.fillStyle = this.colors.text;
            ctx.font = '18px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText(keys, ctx.canvas.width / 2 + 20, y);
            
            y += 40;
        });
        
        // Mission info
        y += 20;
        ctx.fillStyle = this.colors.warning;
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('MISSION: COLLECT 3 KEYS TO OPEN THE EXIT DOOR', ctx.canvas.width / 2, y);
        
        // Footer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '14px Courier New';
        ctx.fillText('PRESS ESC TO RETURN', ctx.canvas.width / 2, ctx.canvas.height - 40);
    }
}
