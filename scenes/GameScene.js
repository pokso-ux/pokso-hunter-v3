// GameScene.js - Scène principale du jeu
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    
    create() {
        // Systems
        this.inputSystem = {
            cursors: this.input.keyboard.createCursorKeys(),
            wasd: this.input.keyboard.addKeys('W,A,S,D'),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            keyI: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            keyE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        };
        
        // World
        this.createWorld();
        
        // Player
        this.player = new Player(this, 400, 300);
        this.physics.add.collider(this.player, this.walls);
        
        // Camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.2);
        
        // Enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemies(5);
        this.physics.add.collider(this.enemies, this.walls);
        this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, null, this);
        
        // Loots (keys)
        this.loots = this.physics.add.group();
        this.spawnKeys(3);
        this.physics.add.overlap(this.player, this.loots, this.collectKey, null, this);
        
        // Door
        this.createDoor();
        
        // UI
        this.createUI();
        
        // Mission state
        this.mission = {
            keysNeeded: 3,
            keysCollected: 0,
            doorOpen: false
        };
        
        // Events
        this.events.on('playerDeath', this.onPlayerDeath, this);
        
        // Checkpoint
        this.checkpoint = { x: 400, y: 300 };
        
        // Save load
        this.loadGame();
    }
    
    createWorld() {
        this.cameras.main.setBackgroundColor('#0a0a1a');
        
        this.walls = this.physics.add.staticGroup();
        
        // Generate map
        for(let y = 0; y < 40; y++) {
            for(let x = 0; x < 60; x++) {
                const px = x * 64;
                const py = y * 64;
                
                // Two zones
                const isForest = x < 30;
                const tile = isForest ? 'tile_forest' : 'tile_rust';
                this.add.image(px + 32, py + 32, tile);
                
                // Walls at borders and zone transition
                if(x === 0 || x === 59 || y === 0 || y === 39 || 
                   (x === 30 && (y < 15 || y > 25))) {
                    const wall = this.walls.create(px + 32, py + 32, 'tile_wall');
                    wall.body.setSize(64, 64);
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
            const enemy = new Enemy(this, x, y);
            this.enemies.add(enemy);
        }
    }
    
    spawnKeys(count) {
        for(let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(200, 3600);
            const y = Phaser.Math.Between(200, 2300);
            const key = this.loots.create(x, y, 'loot_key');
            
            // Float animation
            this.tweens.add({
                targets: key,
                y: y - 10,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createDoor() {
        // Door at the far right
        this.door = this.physics.add.staticSprite(3776, 1280, 'door_locked');
        this.door.body.setSize(64, 64);
        
        // Interaction zone
        this.doorZone = this.add.zone(3776, 1280, 100, 100);
        this.physics.add.existing(this.doorZone);
    }
    
    createUI() {
        // Health bar
        this.healthBg = this.add.rectangle(100, 30, 204, 24, 0x000000)
            .setScrollFactor(0).setDepth(100);
        this.healthBar = this.add.rectangle(100, 30, 200, 20, 0xff0044)
            .setScrollFactor(0).setDepth(100);
        
        // Keys counter
        this.keysText = this.add.text(20, 60, 'Keys: 0/3', {
            fontSize: '20px',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setDepth(100);
        
        // Mission text
        this.missionText = this.add.text(512, 80, 'Mission: Find 3 keys!', {
            fontSize: '24px',
            backgroundColor: '#000',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        
        // Controls hint
        this.add.text(20, 570, 'WASD: Move | SPACE: Dash | I: Inv | E: Interact', {
            fontSize: '14px',
            backgroundColor: '#000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(100);
    }
    
    handleEnemyCollision(player, enemy) {
        if(player.isDashing) {
            // Kill enemy if dashing through
            enemy.takeDamage(50);
        } else {
            // Take damage
            player.takeDamage(10);
            this.updateHealthBar();
        }
    }
    
    collectKey(player, key) {
        key.destroy();
        this.mission.keysCollected++;
        this.player.keys++;
        
        this.keysText.setText(`Keys: ${this.mission.keysCollected}/3`);
        
        // Show notification
        this.showNotification(`Key ${this.mission.keysCollected}/3 found!`);
        
        // Check if all keys collected
        if(this.mission.keysCollected >= this.mission.keysNeeded) {
            this.openDoor();
        }
    }
    
    openDoor() {
        this.mission.doorOpen = true;
        this.door.setTexture('door_open');
        this.missionText.setText('Mission: Door is open! Escape!');
        this.showNotification('DOOR OPEN! Escape!');
        
        // Save game
        this.saveGame();
    }
    
    showNotification(text) {
        const notif = this.add.text(512, 200, text, {
            fontSize: '28px',
            backgroundColor: '#00aa00',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
        
        this.tweens.add({
            targets: notif,
            y: 150,
            alpha: 0,
            duration: 2000,
            onComplete: () => notif.destroy()
        });
    }
    
    updateHealthBar() {
        const pct = this.player.health / this.player.maxHealth;
        this.healthBar.width = 200 * pct;
    }
    
    onPlayerDeath() {
        this.showNotification('YOU DIED! Respawning...');
        
        this.time.delayedCall(1500, () => {
            this.player.health = this.player.maxHealth;
            this.player.x = this.checkpoint.x;
            this.player.y = this.checkpoint.y;
            this.player.setVelocity(0, 0);
            this.updateHealthBar();
        });
    }
    
    update() {
        const { cursors, wasd, space, keyI, keyE } = this.inputSystem;
        
        // Update player
        this.player.update(cursors, wasd, space);
        
        // Update enemies
        this.enemies.getChildren().forEach(enemy => {
            if(enemy.active) enemy.update(this.time.now, 16);
        });
        
        // Inventory toggle
        if(Phaser.Input.Keyboard.JustDown(keyI)) {
            this.showNotification(`Inventory: ${this.player.keys} keys`);
        }
        
        // Door interaction
        if(Phaser.Input.Keyboard.JustDown(keyE)) {
            const distToDoor = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, this.door.x, this.door.y
            );
            
            if(distToDoor < 80) {
                if(this.mission.doorOpen) {
                    this.showNotification('YOU ESCAPED! VICTORY!');
                    this.time.delayedCall(2000, () => {
                        this.scene.start('MainMenuScene');
                    });
                } else {
                    this.showNotification(`Need ${3 - this.mission.keysCollected} more keys!`);
                }
            }
        }
        
        // Zone text
        const zone = this.player.x < 1920 ? 'Forest' : 'Rust Lands';
        // (zone text removed for cleaner UI)
    }
    
    saveGame() {
        const saveData = {
            keys: this.player.keys,
            health: this.player.health,
            x: this.player.x,
            y: this.player.y
        };
        localStorage.setItem('pokso_hunter_save', JSON.stringify(saveData));
    }
    
    loadGame() {
        const save = localStorage.getItem('pokso_hunter_save');
        if(save) {
            const data = JSON.parse(save);
            this.player.keys = data.keys || 0;
            this.player.health = data.health || 100;
            this.player.x = data.x || 400;
            this.player.y = data.y || 300;
            this.updateHealthBar();
        }
    }
}

export default GameScene;
