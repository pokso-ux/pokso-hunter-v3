// POXSO HUNTER V3 - Deploy 1770616440
// POXSO HUNTER V3 - Version SIMPLE qui marche
// Pas d'ES modules, tout dans un fichier

// SCENE 1: Boot
class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    
    preload() {
        const g = this.make.graphics();
        
        // Player
        g.fillStyle(0x00ff41);
        g.fillCircle(16, 16, 14);
        g.fillStyle(0xffffff);
        g.fillCircle(12, 12, 4);
        g.generateTexture('player', 32, 32);
        g.clear();
        
        // Tiles
        g.fillStyle(0x2d5a2d);
        g.fillRect(0, 0, 64, 64);
        g.generateTexture('tile_forest', 64, 64);
        g.clear();
        
        g.fillStyle(0x8b4513);
        g.fillRect(0, 0, 64, 64);
        g.generateTexture('tile_rust', 64, 64);
        g.clear();
        
        g.fillStyle(0x333333);
        g.fillRect(0, 0, 64, 64);
        g.lineStyle(2, 0x555555);
        g.strokeRect(0, 0, 64, 64);
        g.generateTexture('tile_wall', 64, 64);
        g.clear();
        
        // Enemy
        g.fillStyle(0x8b4513);
        g.fillCircle(16, 16, 14);
        g.fillStyle(0xff4400);
        g.fillCircle(16, 14, 6);
        g.generateTexture('enemy', 32, 32);
        g.clear();
        
        // Key
        g.fillStyle(0xffaa00);
        g.fillCircle(16, 10, 6);
        g.fillRect(14, 14, 4, 12);
        g.generateTexture('key', 32, 32);
        g.clear();
        
        // Door
        g.fillStyle(0x444444);
        g.fillRect(0, 0, 64, 64);
        g.fillStyle(0xffaa00);
        g.fillCircle(32, 32, 8);
        g.generateTexture('door', 64, 64);
        g.clear();
    }
    
    create() {
        this.scene.start('MenuScene');
    }
}

// SCENE 2: Menu
class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }
    
    create() {
        this.cameras.main.setBackgroundColor('#0a0a1a');
        
        this.add.text(512, 150, 'POXSO HUNTER', {
            fontSize: '56px',
            color: '#00ff41',
            stroke: '#00aa00',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        this.add.text(512, 220, 'V3 PRO', {
            fontSize: '24px',
            color: '#ff00ff'
        }).setOrigin(0.5);
        
        // Bouton Play
        const playBtn = this.add.rectangle(512, 320, 200, 50, 0x1a1a3a)
            .setStrokeStyle(2, 0x00ff41)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(512, 320, 'PLAY', {
            fontSize: '24px',
            color: '#00ff41'
        }).setOrigin(0.5);
        
        playBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

// SCENE 3: Game
class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }
    
    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');
        
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Create world
        this.createWorld();
        
        // Player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.speed = 200;
        this.player.canDash = true;
        this.player.health = 100;
        this.player.keys = 0;
        
        // Camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.2);
        
        // Collisions player-walls
        this.physics.add.collider(this.player, this.walls);
        
        // Enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemies(5);
        this.physics.add.collider(this.enemies, this.walls);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        
        // Keys
        this.keysGroup = this.physics.add.group();
        this.spawnKeys(3);
        this.physics.add.overlap(this.player, this.keysGroup, this.collectKey, null, this);
        
        // Door
        this.door = this.physics.add.staticSprite(3776, 1280, 'door');
        this.doorLocked = true;
        this.physics.add.overlap(this.player, this.door, this.checkDoor, null, this);
        
        // UI
        this.healthText = this.add.text(20, 20, 'HP: 100', {
            fontSize: '20px',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setDepth(100);
        
        this.keysText = this.add.text(20, 55, 'Keys: 0/3', {
            fontSize: '20px',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setDepth(100);
        
        this.add.text(20, 560, 'WASD/Arrows: Move | SPACE: Dash', {
            fontSize: '14px',
            backgroundColor: '#000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(100);
        
        // Mission text
        this.missionText = this.add.text(512, 80, 'Mission: Find 3 keys!', {
            fontSize: '22px',
            backgroundColor: '#000',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    }
    
    createWorld() {
        this.walls = this.physics.add.staticGroup();
        
        for(let y = 0; y < 40; y++) {
            for(let x = 0; x < 60; x++) {
                const px = x * 64;
                const py = y * 64;
                const tile = x < 30 ? 'tile_forest' : 'tile_rust';
                
                this.add.image(px + 32, py + 32, tile);
                
                // Walls at borders and transition
                if(x === 0 || x === 59 || y === 0 || y === 39 || 
                   (x === 30 && (y < 15 || y > 24))) {
                    this.walls.create(px + 32, py + 32, 'tile_wall');
                }
            }
        }
        
        this.physics.world.setBounds(0, 0, 3840, 2560);
        this.cameras.main.setBounds(0, 0, 3840, 2560);
    }
    
    spawnEnemies(count) {
        for(let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(200, 3600);
            const y = Phaser.Math.Between(200, 2300);
            const enemy = this.enemies.create(x, y, 'enemy');
            enemy.setData('patrolX', x);
            enemy.setData('patrolY', y);
            enemy.setData('dir', Math.random() > 0.5 ? 1 : -1);
        }
    }
    
    spawnKeys(count) {
        for(let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(200, 3600);
            const y = Phaser.Math.Between(200, 2300);
            const key = this.keysGroup.create(x, y, 'key');
            
            this.tweens.add({
                targets: key,
                y: y - 8,
                duration: 1500,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    update() {
        // Movement
        let vx = 0, vy = 0;
        
        if(this.cursors.left.isDown || this.wasd.A.isDown) vx = -this.player.speed;
        else if(this.cursors.right.isDown || this.wasd.D.isDown) vx = this.player.speed;
        
        if(this.cursors.up.isDown || this.wasd.W.isDown) vy = -this.player.speed;
        else if(this.cursors.down.isDown || this.wasd.S.isDown) vy = this.player.speed;
        
        if(vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }
        
        this.player.setVelocity(vx, vy);
        
        // Flip
        if(vx < 0) this.player.setFlipX(true);
        else if(vx > 0) this.player.setFlipX(false);
        
        // Dash
        if(Phaser.Input.Keyboard.JustDown(this.space) && this.player.canDash && (vx !== 0 || vy !== 0)) {
            this.dash(vx, vy);
        }
        
        // Update enemies
        this.enemies.getChildren().forEach(enemy => {
            this.updateEnemy(enemy);
        });
    }
    
    updateEnemy(enemy) {
        const patrolX = enemy.getData('patrolX');
        const patrolY = enemy.getData('patrolY');
        const dir = enemy.getData('dir');
        
        // Simple patrol
        enemy.x += dir * 1;
        
        // Change direction if too far
        if(Math.abs(enemy.x - patrolX) > 100) {
            enemy.setData('dir', -dir);
        }
        
        // Check distance to player
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        if(dist < 300) {
            // Chase player
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            enemy.x += Math.cos(angle) * 2;
            enemy.y += Math.sin(angle) * 2;
        }
    }
    
    dash(vx, vy) {
        this.player.canDash = false;
        const angle = Math.atan2(vy, vx);
        this.player.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
        this.player.setAlpha(0.5);
        
        this.time.delayedCall(150, () => {
            this.player.setAlpha(1);
            this.player.canDash = true;
        });
    }
    
    hitEnemy(player, enemy) {
        // If dashing, kill enemy
        if(!this.player.canDash) {
            enemy.destroy();
            return;
        }
        
        // Take damage
        this.player.health -= 10;
        this.healthText.setText(`HP: ${this.player.health}`);
        this.cameras.main.shake(100, 0.01);
        
        if(this.player.health <= 0) {
            this.player.health = 100;
            this.player.x = 400;
            this.player.y = 300;
            this.healthText.setText('HP: 100');
        }
    }
    
    collectKey(player, key) {
        key.destroy();
        this.player.keys++;
        this.keysText.setText(`Keys: ${this.player.keys}/3`);
        
        if(this.player.keys >= 3) {
            this.doorLocked = false;
            this.missionText.setText('DOOR OPEN! Escape!');
            this.missionText.setBackgroundColor('#00aa00');
        }
    }
    
    checkDoor(player, door) {
        if(!this.doorLocked) {
            this.add.text(512, 300, 'YOU ESCAPED!', {
                fontSize: '48px',
                color: '#00ff41',
                backgroundColor: '#000',
                padding: { x: 30, y: 15 }
            }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
            
            this.time.delayedCall(3000, () => {
                this.scene.start('MenuScene');
            });
        }
    }
}

// CONFIG
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#0a0a0a',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene]
};

new Phaser.Game(config);
