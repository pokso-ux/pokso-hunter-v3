/**
 * SaveSystem - Gestion de la sauvegarde (localStorage)
 */

class SaveSystem {
    constructor() {
        this.key = 'pokso_hunter_v3_save';
    }
    
    save(data) {
        try {
            const saveData = {
                ...data,
                timestamp: Date.now(),
                version: 'V3_PRO'
            };
            localStorage.setItem(this.key, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }
    
    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }
    
    exists() {
        return localStorage.getItem(this.key) !== null;
    }
    
    clear() {
        localStorage.removeItem(this.key);
    }
    
    export() {
        const data = this.load();
        return data ? JSON.stringify(data, null, 2) : '{}';
    }
}
