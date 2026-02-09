// Enemy.js - Ennemi Rust Walker
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_idle1');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Physics
        this.body.setSize(24, 24);
        this.body.setOffset(4, 4);
        
        // Stats
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.speed = 80;
        this.chaseSpeed = 120;
        this.damage = 15;
        this.detectionRange = 250;
        this.attackRange = 40;
        this.attackCooldown = 800;
        
        // AI state
        this.patrolCenter = { x, y };
        this.patrolRadius = 120;
        this.state = 'patrol'; // patrol, chase, attack
        this.lastAttack = 0;
        this.patrolDirection = { x: 1, y: 0 };
        this.patrolTimer = 0;
        
        // Animation
        this.createAnimations();
        this.play('enemy_idle');
        
        // Set new patrol target
        this.setNewPatrolTarget();
    }
    
    createAnimations() {
        const anims = this.scene.anims;
        
        if (!anims.exists('enemy_idle')) {
            anims.create({
                key: 'enemy_idle',
                frames: [
                    { key: 'enemy_idle1' },
                    { key: 'enemy_idle2' }
                ],
                frameRate: 2,
                repeat: -1
            });
        }
    }
    
    update(time, delta, player) {
        if (!player || !player.active) return;
        
        const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        
        switch(this.state) {
            case 'patrol':
                this.updatePatrol(delta);
                if (distToPlayer < this.detectionRange) {
                    this.state = 'chase';
                    this.setTint(0xff6666);
                }
                break;
                
            case 'chase':
                this.updateChase(player);
                if (distToPlayer > this.detectionRange * 1.3) {
                    this.state = 'patrol';
                    this.clearTint();
                    this.setNewPatrolTarget();
                } else if (distToPlayer < this.attackRange) {
                    this.state = 'attack';
                }
                break;
                
            case 'attack':
                this.setVelocity(0, 0);
                if (time - this.lastAttack > this.attackCooldown) {
                    this.attack(player);
                    this.lastAttack = time;
                }
                if (distToPlayer > this.attackRange * 1.2) {
                    this.state = 'chase';
                }
                break;
        }
        
        // Face the player when chasing/attacking
        if (this.state !== 'patrol' && player.x < this.x) {
            this.setFlipX(true);
        } else if (this.state !== 'patrol') {
            this.setFlipX(false);
        }
    }
    
    updatePatrol(delta) {
        this.patrolTimer += delta;
        
        // Change direction periodically
        if (this.patrolTimer > 2000) {
            this.patrolTimer = 0;
            const angle = Math.random() * Math.PI * 2;
            this.patrolDirection = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
        }
        
        // Move
        this.setVelocity(
            this.patrolDirection.x * this.speed * 0.5,
            this.patrolDirection.y * this.speed * 0.5
        );
        
        // Face movement direction
        if (this.patrolDirection.x < 0) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }
        
        // Stay within patrol radius
        const distFromCenter = Phaser.Math.Distance.Between(
            this.x, this.y, this.patrolCenter.x, this.patrolCenter.y
        );
        
        if (distFromCenter > this.patrolRadius) {
            const angle = Phaser.Math.Angle.Between(
                this.x, this.y, this.patrolCenter.x, this.patrolCenter.y
            );
            this.patrolDirection = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
        }
    }
    
    updateChase(player) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocity(
            Math.cos(angle) * this.chaseSpeed,
            Math.sin(angle) * this.chaseSpeed
        );
    }
    
    setNewPatrolTarget() {
        const angle = Math.random() * Math.PI * 2;
        this.patrolDirection = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        this.patrolTimer = 0;
    }
    
    attack(player) {
        // Lunge animation
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocity(
            Math.cos(angle) * 300,
            Math.sin(angle) * 300
        );
        
        // Deal damage if close enough
        this.scene.time.delayedCall(100, () => {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (dist < this.attackRange + 20) {
                player.takeDamage(this.damage, this.x, this.y);
            }
        });
        
        // Visual feedback
        this.setScale(1.2);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 200
        });
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        // Flash
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (this.state !== 'chase') {
                this.clearTint();
            } else {
                this.setTint(0xff6666);
            }
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        // Death particles
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.circle(
                this.x, this.y, 4, 0x8b4513
            );
            const angle = (Math.PI * 2 / 8) * i;
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Math.cos(angle) * 50,
                y: this.y + Math.sin(angle) * 50,
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
        
        // Death animation
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Enemy;
}
