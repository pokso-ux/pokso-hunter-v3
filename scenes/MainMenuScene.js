// MainMenuScene.js - Menu principal
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }
    
    create() {
        // Background
        this.cameras.main.setBackgroundColor('#0a0a1a');
        
        // Title
        const title = this.add.text(512, 150, 'POXSO HUNTER', {
            fontSize: '64px',
            fontFamily: 'Courier New',
            color: '#00ff41',
            stroke: '#00aa00',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(512, 220, 'V3 PRO - Cyberpunk Edition', {
            fontSize: '24px',
            color: '#ff00ff'
        }).setOrigin(0.5);
        
        // Menu buttons
        this.createButton(512, 320, 'PLAY', () => {
            this.scene.start('GameScene');
        });
        
        this.createButton(512, 400, 'CONTROLS', () => {
            this.showControls();
        });
        
        this.createButton(512, 480, 'QUIT', () => {
            window.close();
        });
        
        // Decorative particles
        this.createParticles();
    }
    
    createButton(x, y, text, callback) {
        const bg = this.add.rectangle(x, y, 200, 50, 0x1a1a3a)
            .setStrokeStyle(2, 0x00ff41)
            .setInteractive({ useHandCursor: true });
        
        const label = this.add.text(x, y, text, {
            fontSize: '24px',
            color: '#00ff41'
        }).setOrigin(0.5);
        
        bg.on('pointerover', () => {
            bg.setFillStyle(0x2a4a3a);
            label.setColor('#ffffff');
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(0x1a1a3a);
            label.setColor('#00ff41');
        });
        
        bg.on('pointerdown', callback);
        
        return { bg, label };
    }
    
    showControls() {
        // Dark overlay
        const overlay = this.add.rectangle(512, 300, 600, 400, 0x000000, 0.9);
        
        const controlsText = this.add.text(512, 280, 
            'CONTROLS\n\n' +
            'WASD / ARROWS - Move\n' +
            'SPACE - Dash\n' +
            'I - Inventory\n' +
            'E - Interact\n\n' +
            'Mission: Collect 3 keys\n' +
            'to open the door!', {
            fontSize: '20px',
            color: '#00ff41',
            align: 'center'
        }).setOrigin(0.5);
        
        const backBtn = this.createButton(512, 480, 'BACK', () => {
            overlay.destroy();
            controlsText.destroy();
            backBtn.bg.destroy();
            backBtn.label.destroy();
        });
    }
    
    createParticles() {
        for(let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, 1024);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.Between(2, 6);
            
            const p = this.add.circle(x, y, size, 0x00ff41, 0.3);
            
            this.tweens.add({
                targets: p,
                y: y - 100,
                alpha: 0,
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }
}

export default MainMenuScene;
