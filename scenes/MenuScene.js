// MenuScene.js - Menu principal
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        console.log('MenuScene: create');
        
        this.cameras.main.setBackgroundColor('#0a0a1a');
        this.cameras.main.fadeIn(500);
        
        // Particules d'ambiance
        this.createBackgroundParticles();
        
        // Titre
        const title = this.add.text(512, 120, 'POXSO HUNTER', {
            fontFamily: 'Courier New, monospace',
            fontSize: '64px',
            color: '#00ff41',
            stroke: '#00aa00',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Animation titre
        this.tweens.add({
            targets: title,
            y: 125,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Sous-titre
        this.add.text(512, 190, 'V3 PRO - Cyberpunk Edition', {
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            color: '#ff00ff'
        }).setOrigin(0.5);
        
        // Version
        this.add.text(512, 220, 'Build 2026.02.08', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#666'
        }).setOrigin(0.5);
        
        // Boutons
        this.createButton(512, 320, 'PLAY', () => this.startGame());
        this.createButton(512, 390, 'CONTROLS', () => this.showControls());
        this.createButton(512, 460, 'CREDITS', () => this.showCredits());
        
        // Instructions rapides
        this.add.text(512, 550, 'Press ENTER to start', {
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            color: '#888'
        }).setOrigin(0.5);
        
        // Input clavier
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    }

    createBackgroundParticles() {
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, 1024);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.Between(2, 5);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.4);
            
            const p = this.add.circle(x, y, size, 0x00ff41, alpha);
            
            this.tweens.add({
                targets: p,
                y: y - 150,
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 3000),
                ease: 'Sine.easeOut'
            });
        }
    }

    createButton(x, y, text, callback) {
        const bg = this.add.rectangle(x, y, 220, 50, 0x1a1a3a)
            .setStrokeStyle(2, 0x00ff41)
            .setInteractive({ useHandCursor: true });
        
        const label = this.add.text(x, y, text, {
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            color: '#00ff41'
        }).setOrigin(0.5);
        
        // Hover effects
        bg.on('pointerover', () => {
            bg.setFillStyle(0x2a4a3a);
            bg.setStrokeStyle(3, 0x00ff41);
            label.setColor('#ffffff');
            this.tweens.add({
                targets: [bg, label],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(0x1a1a3a);
            bg.setStrokeStyle(2, 0x00ff41);
            label.setColor('#00ff41');
            this.tweens.add({
                targets: [bg, label],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        bg.on('pointerdown', () => {
            bg.setFillStyle(0x3a6a4a);
            this.cameras.main.fadeOut(200);
            this.time.delayedCall(200, callback);
        });
        
        return { bg, label };
    }

    startGame() {
        this.scene.start('GameScene');
    }

    showControls() {
        // Overlay modal
        const overlay = this.add.rectangle(512, 300, 700, 450, 0x000000, 0.95)
            .setStrokeStyle(3, 0x00ff41);
        
        const title = this.add.text(512, 120, 'CONTROLS', {
            fontFamily: 'Courier New, monospace',
            fontSize: '36px',
            color: '#00ff41'
        }).setOrigin(0.5);
        
        const controls = [
            '',
            'MOVEMENT',
            '  WASD or ARROW KEYS    Move',
            '',
            'ACTIONS',
            '  SPACE                 Dash (invincible)',
            '  E                     Interact with door',
            '  I                     Open/Close Inventory',
            '',
            'GAMEPLAY',
            '  Find 3 golden keys',
            '  Open the escape door',
            '  Avoid Rust Walkers!',
            '',
            '  Press ESC to close'
        ];
        
        let y = 170;
        controls.forEach(line => {
            this.add.text(512, y, line, {
                fontFamily: 'Courier New, monospace',
                fontSize: line.startsWith('  ') ? '18px' : '20px',
                color: line.includes('MOVEMENT') || line.includes('ACTIONS') || line.includes('GAMEPLAY') ? '#ff00ff' : '#ccc',
                fontStyle: line.includes('MOVEMENT') || line.includes('ACTIONS') || line.includes('GAMEPLAY') ? 'bold' : 'normal'
            }).setOrigin(0.5);
            y += 22;
        });
        
        // Close button
        const closeBtn = this.createButton(512, 520, 'BACK', () => {
            overlay.destroy();
            title.destroy();
            this.children.list.slice().forEach(child => {
                if (child !== closeBtn.bg && child !== closeBtn.label && 
                    child.type === 'Text' && child.y >= 120 && child.y <= 550) {
                    child.destroy();
                }
            });
            closeBtn.bg.destroy();
            closeBtn.label.destroy();
        });
        
        this.input.keyboard.once('keydown-ESC', () => {
            closeBtn.bg.emit('pointerdown');
        });
    }

    showCredits() {
        const overlay = this.add.rectangle(512, 300, 600, 350, 0x000000, 0.95)
            .setStrokeStyle(3, 0x00ff41);
        
        this.add.text(512, 140, 'CREDITS', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            color: '#00ff41'
        }).setOrigin(0.5);
        
        this.add.text(512, 220, 'POXSO HUNTER V3 PRO\n\nDeveloped by OpenClaw\nfor openthepancake\n\nBuilt with Phaser 3\nProcedural Graphics\n\n2026', {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#ccc',
            align: 'center'
        }).setOrigin(0.5);
        
        const closeBtn = this.createButton(512, 450, 'BACK', () => {
            overlay.destroy();
            this.scene.restart();
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuScene;
}
