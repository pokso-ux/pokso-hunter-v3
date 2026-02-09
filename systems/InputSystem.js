/**
 * InputSystem - Gestion des inputs clavier
 */

class InputSystem {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};
        
        // Key mappings
        this.KEYS = {
            UP: ['ArrowUp', 'w', 'W', 'z', 'Z'],
            DOWN: ['ArrowDown', 's', 'S'],
            LEFT: ['ArrowLeft', 'a', 'A', 'q', 'Q'],
            RIGHT: ['ArrowRight', 'd', 'D'],
            ACTION: [' ', 'Enter'],
            INVENTORY: ['i', 'I', 'Tab'],
            ESCAPE: ['Escape'],
            SAVE: ['F5'],
            LOAD: ['F9']
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key]) {
                this.keysPressed[e.key] = true;
            }
            this.keys[e.key] = true;
            
            // Prevent default for game keys
            if (this.isGameKey(e.key)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.keysReleased[e.key] = true;
        });
    }
    
    isGameKey(key) {
        return Object.values(this.KEYS).flat().includes(key);
    }
    
    update() {
        // Clear single-frame events
        this.keysPressed = {};
        this.keysReleased = {};
    }
    
    isKeyDown(keyName) {
        const keyList = this.KEYS[keyName] || [keyName];
        return keyList.some(k => this.keys[k]);
    }
    
    isKeyPressed(keyName) {
        const keyList = this.KEYS[keyName] || [keyName];
        return keyList.some(k => this.keysPressed[k]);
    }
    
    isKeyReleased(keyName) {
        const keyList = this.KEYS[keyName] || [keyName];
        return keyList.some(k => this.keysReleased[k]);
    }
    
    getMovementVector() {
        let x = 0;
        let y = 0;
        
        if (this.isKeyDown('LEFT')) x -= 1;
        if (this.isKeyDown('RIGHT')) x += 1;
        if (this.isKeyDown('UP')) y -= 1;
        if (this.isKeyDown('DOWN')) y += 1;
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            x *= 0.707;
            y *= 0.707;
        }
        
        return { x, y };
    }
}
