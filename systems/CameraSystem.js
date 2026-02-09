/**
 * CameraSystem - Camera follow smooth
 */

class CameraSystem {
    constructor(width, height, worldWidth, worldHeight) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        
        // Smooth follow settings
        this.smoothing = 0.08;
        this.targetX = 0;
        this.targetY = 0;
        
        // Shake effect
        this.shakeDuration = 0;
        this.shakeIntensity = 0;
    }
    
    follow(target) {
        // Calculate target position (center of screen on target)
        this.targetX = target.x - this.width / 2;
        this.targetY = target.y - this.height / 2;
    }
    
    update(deltaTime) {
        // Smooth interpolation
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
        
        // Clamp to world bounds
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.height));
        
        // Apply screen shake
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;
            const shakeX = (Math.random() - 0.5) * this.shakeIntensity;
            const shakeY = (Math.random() - 0.5) * this.shakeIntensity;
            this.x += shakeX;
            this.y += shakeY;
        }
    }
    
    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }
    
    apply(ctx) {
        ctx.save();
        ctx.translate(-Math.floor(this.x), -Math.floor(this.y));
    }
    
    restore(ctx) {
        ctx.restore();
    }
    
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
    
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}
