// Player.js - Entité joueur complète
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_idle');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configuration physics
        this.setCollideWorldBounds(true);
        this.body.setSize(24, 24);
        this.body.setOffset(4, 4);
        
        // Stats
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.baseSpeed = 200;
        this.speed = this.baseSpeed;
        this.dashSpeed = 500;
        this.dashDuration = 150;
        this.dashCooldown = 800;
        this.canDash = true;
        this.isDashing = false;
        this.isInvincible = false;
        
        // Direction
        this.facing = 'down';
        
        // Inventaire
        this.keys = 0;
        this.inventory = [];
        
        // Animation
        this.createAnimations();
        this.play('idle_down');
    }
    
    createAnimations() {
        const anims = this.scene.anims;
        
        // Idle animations
        anims.create({
            key: 'idle_down',
            frames: [{ key: 'player_idle', frame: 0 }],
            frameRate: 1
        });
        
        anims.create({
            key: 'idle_up',
            frames: [{ key: 'player_idle', frame: 1 }],
            frameRate: 1
        });
        
        anims.create({
            key: 'idle_left',
            frames: [{ key: 'player_idle', frame: 2 }],
            frameRate: 1
        });
        
        anims.create({
            key: 'idle_right',
            frames: [{ key: 'player_idle', frame: 3 }],
            frameRate: 1
        });
        
        // Run animations
        anims.create({
            key: 'run_down',
            frames: anims.generateFrameNumbers('player_run', { start: 0, end: 1 }),
            frameRate: 12,
            repeat: -1
        });
        
        anims.create({
            key: 'run_up',
            frames: anims.generateFrameNumbers('player_run', { start: 2, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
        
        anims.create({
            key: 'run_left',
            frames: anims.generateFrameNumbers('player_run', { start: 4, end: 5 }),
            frameRate: 12,
            repeat: -1
        });
        
        anims.create({
            key: 'run_right',
            frames: anims.generateFrameNumbers('player_run', { start: 6, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
    }
    
    update(cursors, wasd, spaceKey) {
        if (this.isDashing) return;
        
        let vx = 0;
        let vy = 0;
        let moving = false;
        
        // Input handling
        if (cursors.left.isDown || wasd.A.isDown) {
            vx = -this.speed;
            this.facing = 'left';
            moving = true;
        } else if (cursors.right.isDown || wasd.D.isDown) {
            vx = this.speed;
            this.facing = 'right';
            moving = true;
        }
        
        if (cursors.up.isDown || wasd.W.isDown) {
            vy = -this.speed;
            this.facing = 'up';
            moving = true;
        } else if (cursors.down.isDown || wasd.S.isDown) {
            vy = this.speed;
            this.facing = 'down';
            moving = true;
        }
        
        // Normalize diagonal
        if (vx !== 0 && vy !== 0) {
            const factor = 1 / Math.sqrt(2);
            vx *= factor;
            vy *= factor;
        }
        
        this.setVelocity(vx, vy);
        
        // Animation
        const animKey = moving ? `run_${this.facing}` : `idle_${this.facing}`;
        if (this.anims.currentAnim?.key !== animKey) {
            this.play(animKey, true);
        }
        
        // Flip sprite for left/right
        if (this.facing === 'left') {
            this.setFlipX(true);
        } else if (this.facing === 'right') {
            this.setFlipX(false);
        }
        
        // Dash
        if (Phaser.Input.Keyboard.JustDown(spaceKey) && this.canDash && moving) {
            this.dash(vx, vy);
        }
    }
    
    dash(vx, vy) {
        if (vx === 0 && vy === 0) return;
        
        this.isDashing = true;
        this.isInvincible = true;
        this.canDash = false;
        
        // Calculate dash direction
        const angle = Math.atan2(vy, vx);
        
        // Set dash velocity
        this.setVelocity(
            Math.cos(angle) * this.dashSpeed,
            Math.sin(angle) * this.dashSpeed
        );
        
        // Visual effects
        this.setTexture('player_dash');
        this.setAlpha(0.7);
        
        // Create dash trail particles
        this.createDashTrail();
        
        // End dash
        this.scene.time.delayedCall(this.dashDuration, () => {
            this.isDashing = false;
            this.setAlpha(1);
            
            // Return to normal sprite
            const currentAnim = this.anims.currentAnim?.key || 'idle_down';
            this.setTexture('player_idle');
            this.play(currentAnim, true);
            
            // Brief invincibility after dash
            this.scene.time.delayedCall(100, () => {
                this.isInvincible = false;
            });
        });
        
        // Cooldown
        this.scene.time.delayedCall(this.dashCooldown, () => {
            this.canDash = true;
        });
    }
    
    createDashTrail() {
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 30, () => {
                const trail = this.scene.add.ghost = this.scene.add.circle(
                    this.x, this.y, 10, 0x00ff41, 0.5
                );
                
                this.scene.tweens.add({
                    targets: trail,
                    alpha: 0,
                    scale: 0.5,
                    duration: 300,
                    onComplete: () => trail.destroy()
                });
            });
        }
    }
    
    takeDamage(amount, sourceX, sourceY) {
        if (this.isInvincible || this.isDashing) return false;
        
        this.health -= amount;
        
        // Flash red
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
        
        // Knockback
        if (sourceX !== undefined && sourceY !== undefined) {
            const angle = Phaser.Math.Angle.Between(sourceX, sourceY, this.x, this.y);
            this.setVelocity(
                Math.cos(angle) * 300,
                Math.sin(angle) * 300
            );
        }
        
        // Brief invincibility
        this.isInvincible = true;
        this.scene.time.delayedCall(500, () => {
            this.isInvincible = false;
        });
        
        // Screen shake
        this.scene.cameras.main.shake(100, 0.01);
        
        return true;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    addKey() {
        this.keys++;
        return this.keys;
    }
    
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}
