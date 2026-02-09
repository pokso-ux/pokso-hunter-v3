// BootScene.js - Chargement des assets
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log('BootScene: preload started');
        
        // Créer tous les assets procéduraux
        this.createPlayerTextures();
        this.createEnemyTextures();
        this.createTileTextures();
        this.createLootTextures();
        this.createUITextures();
        this.createEffectTextures();
        
        console.log('BootScene: all textures created');
    }

    createPlayerTextures() {
        const g = this.make.graphics();
        
        // Player idle (4 frames pour animation)
        for (let i = 0; i < 4; i++) {
            const offset = Math.sin(i * Math.PI / 2) * 2;
            g.fillStyle(0x00ff41);
            g.fillCircle(16 + i * 32, 16 + offset, 14);
            g.fillStyle(0x006622);
            g.fillCircle(12 + i * 32, 12 + offset, 5);
            g.fillStyle(0xffffff);
            g.fillCircle(10 + i * 32, 10 + offset, 3);
        }
        g.generateTexture('player_idle', 128, 32);
        g.clear();
        
        // Player run (8 frames)
        for (let i = 0; i < 8; i++) {
            const stretch = i % 2 === 0 ? 1 : 0.85;
            g.fillStyle(0x00ff41);
            g.fillEllipse(16 + i * 32, 16, 28 * stretch, 30);
            g.fillStyle(0xffffff);
            g.fillCircle(14 + i * 32, 12, 3);
        }
        g.generateTexture('player_run', 256, 32);
        g.clear();
        
        // Player dash
        g.fillStyle(0x00ff41, 0.7);
        g.fillCircle(16, 16, 12);
        g.fillStyle(0xaaffaa, 0.5);
        g.fillCircle(10, 16, 8);
        g.generateTexture('player_dash', 32, 32);
        g.destroy();
    }

    createEnemyTextures() {
        const g = this.make.graphics();
        
        // Rust Walker - frame 1
        g.fillStyle(0x8b4513);
        g.fillCircle(16, 16, 15);
        g.fillStyle(0x5a2d0d);
        g.fillCircle(12, 12, 4);
        g.fillCircle(20, 12, 4);
        g.fillStyle(0xff4400);
        g.fillCircle(16, 18, 5);
        g.generateTexture('enemy_idle1', 32, 32);
        g.clear();
        
        // Rust Walker - frame 2 (pulsing)
        g.fillStyle(0x9b5523);
        g.fillCircle(16, 16, 16);
        g.fillStyle(0x6a3d1d);
        g.fillCircle(12, 12, 5);
        g.fillCircle(20, 12, 5);
        g.fillStyle(0xff6600);
        g.fillCircle(16, 18, 6);
        g.generateTexture('enemy_idle2', 32, 32);
        g.destroy();
    }

    createTileTextures() {
        const g = this.make.graphics();
        
        // Forest floor
        g.fillStyle(0x1a4a1a);
        g.fillRect(0, 0, 64, 64);
        g.fillStyle(0x2d5a2d);
        g.fillCircle(20, 20, 10);
        g.fillCircle(50, 40, 8);
        g.fillCircle(35, 55, 6);
        g.generateTexture('tile_forest', 64, 64);
        g.clear();
        
        // Rust floor
        g.fillStyle(0x4a2a1a);
        g.fillRect(0, 0, 64, 64);
        g.fillStyle(0x6a4a2a);
        g.fillCircle(30, 30, 15);
        g.fillCircle(10, 50, 8);
        g.fillCircle(55, 15, 6);
        g.generateTexture('tile_rust', 64, 64);
        g.clear();
        
        // Wall
        g.fillStyle(0x2a2a3a);
        g.fillRect(0, 0, 64, 64);
        g.lineStyle(3, 0x4a4a5a);
        g.strokeRect(2, 2, 60, 60);
        g.lineStyle(1, 0x3a3a4a);
        g.moveTo(0, 32);
        g.lineTo(64, 32);
        g.moveTo(32, 0);
        g.lineTo(32, 64);
        g.strokePath();
        g.generateTexture('tile_wall', 64, 64);
        g.clear();
        
        // Checkpoint
        g.fillStyle(0x00ff41, 0.3);
        g.fillCircle(32, 32, 30);
        g.lineStyle(3, 0x00ff41);
        g.strokeCircle(32, 32, 25);
        g.generateTexture('checkpoint', 64, 64);
        g.destroy();
    }

    createLootTextures() {
        const g = this.make.graphics();
        
        // Key
        g.fillStyle(0xffaa00);
        g.fillCircle(16, 10, 8);
        g.fillRect(13, 14, 6, 14);
        g.fillRect(13, 20, 10, 4);
        g.generateTexture('loot_key', 32, 32);
        g.clear();
        
        // Health pack
        g.fillStyle(0xff0044);
        g.fillCircle(16, 16, 12);
        g.fillStyle(0xffffff);
        g.fillRect(10, 14, 12, 4);
        g.fillRect(14, 10, 4, 12);
        g.generateTexture('loot_health', 32, 32);
        g.clear();
        
        // Speed boost
        g.fillStyle(0x00aaff);
        g.fillCircle(16, 16, 12);
        g.fillStyle(0xffffff);
        g.fillTriangle(12, 20, 20, 20, 16, 10);
        g.generateTexture('loot_speed', 32, 32);
        g.destroy();
    }

    createUITextures() {
        const g = this.make.graphics();
        
        // Heart
        g.fillStyle(0xff0044);
        g.fillCircle(10, 10, 8);
        g.fillCircle(22, 10, 8);
        g.fillTriangle(6, 14, 26, 14, 16, 28);
        g.generateTexture('ui_heart', 32, 32);
        g.clear();
        
        // Key icon
        g.fillStyle(0xffaa00);
        g.fillCircle(8, 8, 5);
        g.fillRect(6, 11, 4, 8);
        g.generateTexture('ui_key', 16, 20);
        g.destroy();
    }

    createEffectTextures() {
        const g = this.make.graphics();
        
        // Particle
        g.fillStyle(0x00ff41);
        g.fillCircle(8, 8, 6);
        g.generateTexture('particle_green', 16, 16);
        g.clear();
        
        // Dust
        g.fillStyle(0xaaaaaa, 0.6);
        g.fillCircle(8, 8, 5);
        g.generateTexture('particle_dust', 16, 16);
        g.destroy();
    }

    create() {
        console.log('BootScene: create, starting MenuScene');
        this.scene.start('MenuScene');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BootScene;
}
