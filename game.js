// POXSO HUNTER V3 - Deploy 1770616440
// POXSO HUNTER V3 - Version SIMPLE qui marche
// Pas d'ES modules, tout dans un fichier

// SCENE 1: Boot
class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    
    preload() {
        const g = this.make.graphics();
        
        // ========== PLAYER VOXEL STYLE (Robot Blocky) ==========
        // Corps principal - bloc cyan
        g.fillStyle(0x00d4ff, 1);
        g.fillRect(4, 6, 24, 20);
        
        // Contours corps
        g.lineStyle(2, 0x0099cc, 1);
        g.strokeRect(4, 6, 24, 20);
        
        // Tête - bloc violet
        g.fillStyle(0x9933ff, 1);
        g.fillRect(6, 2, 20, 14);
        
        // Contours tête
        g.lineStyle(2, 0x7711dd, 1);
        g.strokeRect(6, 2, 20, 14);
        
        // Yeux Voxel (style image - carrés roses)
        g.fillStyle(0xff66cc, 1);
        g.fillRect(9, 7, 6, 5);
        g.fillRect(17, 7, 6, 5);
        
        // Glow yeux
        g.fillStyle(0xff99dd, 0.6);
        g.fillRect(10, 8, 4, 3);
        g.fillRect(18, 8, 4, 3);
        
        // Mains jaunes (comme sur l'image)
        g.fillStyle(0xffcc00, 1);
        g.fillRect(0, 14, 6, 10);
        g.fillRect(26, 14, 6, 10);
        
        // Contours mains
        g.lineStyle(1, 0xcc9900, 1);
        g.strokeRect(0, 14, 6, 10);
        g.strokeRect(26, 14, 6, 10);
        
        // Antenne/oreilles
        g.fillStyle(0x00d4ff, 1);
        g.fillRect(2, 6, 4, 8);
        g.fillRect(26, 6, 4, 8);
        
        g.generateTexture('player', 32, 32);
        g.clear();
        
        // ========== TILE FOREST VOXEL STYLE ==========
        // Base herbe foncée
        g.fillStyle(0x1a4a1a, 1);
        g.fillRect(0, 0, 64, 64);
        
        // Herbe claire par-dessus (effet voxel)
        g.fillStyle(0x2d8a2d, 1);
        g.fillRect(4, 4, 56, 56);
        
        // Contours voxel
        g.lineStyle(2, 0x1a5a1a, 1);
        for(let y = 0; y < 64; y += 8) {
            g.moveTo(0, y);
            g.lineTo(64, y);
        }
        for(let x = 0; x < 64; x += 8) {
            g.moveTo(x, 0);
            g.lineTo(x, 64);
        }
        g.strokePath();
        
        // Arbres voxel (style image - blocs empilés)
        // Tronc
        g.fillStyle(0x5a3a1a, 1);
        g.fillRect(44, 36, 8, 20);
        // Feuillage - couches
        g.fillStyle(0x2d8a2d, 1);
        g.fillRect(36, 28, 24, 12);
        g.fillStyle(0x3daa3d, 1);
        g.fillRect(40, 20, 16, 12);
        g.fillStyle(0x4dca4d, 1);
        g.fillRect(44, 12, 8, 12);
        
        // Petits buissons
        g.fillStyle(0x3daa3d, 1);
        g.fillRect(8, 44, 12, 8);
        g.fillRect(20, 48, 8, 6);
        
        // Fleurs néon (style image)
        g.fillStyle(0xff00ff, 0.9);
        g.fillRect(14, 38, 4, 4);
        g.fillStyle(0x00ffff, 0.9);
        g.fillRect(28, 24, 4, 4);
        
        // Pierres
        g.fillStyle(0x666666, 1);
        g.fillRect(8, 16, 6, 5);
        g.fillRect(14, 18, 4, 3);
        
        g.generateTexture('tile_forest', 64, 64);
        g.clear();
        
        // ========== TILE RUST CYBERPUNK STYLE ==========
        // Base métal sombre
        g.fillStyle(0x2a2a3a, 1);
        g.fillRect(0, 0, 64, 64);
        
        // Grille métallique
        g.lineStyle(2, 0x3a3a4a, 1);
        for(let y = 0; y < 64; y += 16) {
            g.moveTo(0, y);
            g.lineTo(64, y);
        }
        for(let x = 0; x < 64; x += 16) {
            g.moveTo(x, 0);
            g.lineTo(x, 64);
        }
        g.strokePath();
        
        // Bâtiments/panneaux voxel style cyberpunk
        // Structure 1
        g.fillStyle(0x4a4a5a, 1);
        g.fillRect(8, 16, 20, 40);
        g.fillStyle(0x5a5a6a, 1);
        g.fillRect(10, 18, 16, 10);
        g.fillRect(10, 30, 16, 10);
        g.fillRect(10, 42, 16, 10);
        
        // Fenêtres néon
        g.fillStyle(0x00ffff, 0.8);
        g.fillRect(12, 20, 4, 6);
        g.fillRect(20, 32, 4, 6);
        g.fillRect(12, 44, 4, 6);
        
        // Structure 2
        g.fillStyle(0x3a3a4a, 1);
        g.fillRect(36, 28, 24, 32);
        g.fillStyle(0xff00ff, 0.7);
        g.fillRect(40, 32, 6, 4);
        g.fillRect(50, 40, 6, 4);
        g.fillRect(40, 48, 6, 4);
        
        // Tuyaux
        g.fillStyle(0x6a6a7a, 1);
        g.fillRect(4, 8, 56, 4);
        g.fillRect(4, 8, 4, 20);
        
        // Rouille
        g.fillStyle(0x8b4513, 0.5);
        g.fillRect(28, 50, 8, 10);
        g.fillRect(52, 12, 6, 8);
        
        // Taches de rouille
        for(let i = 0; i < 8; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const r = 5 + Math.random() * 10;
            g.fillStyle(0x4a2000, 0.7);
            g.fillCircle(x, y, r);
        }
        
        // Rivets métalliques
        g.fillStyle(0x888888, 1);
        g.fillCircle(8, 8, 3);
        g.fillCircle(56, 8, 3);
        g.fillCircle(8, 56, 3);
        g.fillCircle(56, 56, 3);
        g.fillCircle(32, 32, 4);
        
        // Lignes de soudure
        g.lineStyle(2, 0x3a2000, 0.8);
        g.moveTo(0, 20);
        g.lineTo(64, 20);
        g.moveTo(0, 44);
        g.lineTo(64, 44);
        g.strokePath();
        
        g.generateTexture('tile_rust', 64, 64);
        g.clear();
        
        // ========== MUR ==========
        // Base mur sombre
        g.fillStyle(0x333333, 1);
        g.fillRect(0, 0, 64, 64);
        
        // Brique pattern
        g.lineStyle(2, 0x222222, 1);
        g.strokeRect(0, 0, 64, 64);
        g.moveTo(32, 0);
        g.lineTo(32, 32);
        g.moveTo(0, 32);
        g.lineTo(64, 32);
        g.moveTo(16, 32);
        g.lineTo(16, 64);
        g.moveTo(48, 32);
        g.lineTo(48, 64);
        g.strokePath();
        
        // Effet pierre
        for(let i = 0; i < 5; i++) {
            const x = Math.random() * 60;
            const y = Math.random() * 60;
            g.fillStyle(0x555555, 0.3);
            g.fillCircle(x, y, 8);
        }
        
        // Bordure supérieure highlight
        g.fillStyle(0x666666, 1);
        g.fillRect(0, 0, 64, 4);
        
        g.generateTexture('tile_wall', 64, 64);
        g.clear();
        
        // ========== ENEMY VOXEL (Robot Rust) ==========
        // Corps bloc métal
        g.fillStyle(0x8b4513, 1);
        g.fillRect(6, 6, 20, 18);
        
        // Contours
        g.lineStyle(2, 0x5a3010, 1);
        g.strokeRect(6, 6, 20, 18);
        
        // Détail rouille
        g.fillStyle(0xaa5533, 1);
        g.fillRect(8, 8, 6, 6);
        g.fillRect(18, 14, 6, 4);
        
        // Œil laser rouge (voxel)
        g.fillStyle(0xff0000, 1);
        g.fillRect(10, 10, 12, 6);
        g.fillStyle(0xff6666, 0.8);
        g.fillRect(12, 11, 8, 4);
        
        // Lueur œil
        g.fillStyle(0xffaaaa, 1);
        g.fillRect(14, 12, 4, 2);
        
        // Pattes mécaniques (blocs)
        g.fillStyle(0x6b3508, 1);
        g.fillRect(0, 10, 6, 14);
        g.fillRect(26, 10, 6, 14);
        g.fillRect(4, 22, 6, 8);
        g.fillRect(22, 22, 6, 8);
        
        // Contours pattes
        g.lineStyle(1, 0x4a2000, 1);
        g.strokeRect(0, 10, 6, 14);
        g.strokeRect(26, 10, 6, 14);
        
        // Antennes
        g.fillStyle(0x888888, 1);
        g.fillRect(6, 0, 2, 6);
        g.fillRect(24, 0, 2, 6);
        g.fillStyle(0xff0000, 1);
        g.fillRect(5, 0, 4, 2);
        g.fillRect(23, 0, 4, 2);
        
        g.generateTexture('enemy', 32, 32);
        g.clear();
        
        // ========== KEY VOXEL (Coffre mystère style image) ==========
        // Coffre violet (comme sur l'image)
        g.fillStyle(0x9933ff, 1);
        g.fillRect(4, 8, 24, 16);
        
        // Couvercle
        g.fillStyle(0xaa55ff, 1);
        g.fillRect(4, 4, 24, 8);
        
        // Contours
        g.lineStyle(2, 0x7711dd, 1);
        g.strokeRect(4, 4, 24, 20);
        
        // Bande dorée
        g.fillStyle(0xffcc00, 1);
        g.fillRect(4, 12, 24, 4);
        
        // Serrure/question mark
        g.fillStyle(0xff00ff, 1);
        g.fillRect(14, 10, 4, 8);
        g.fillRect(12, 8, 8, 4);
        
        // Glow
        g.fillStyle(0xffffff, 0.6);
        g.fillRect(14, 10, 2, 4);
        
        // Halo doré autour
        g.fillStyle(0xffff00, 0.3);
        g.fillRect(0, 4, 4, 20);
        g.fillRect(28, 4, 4, 20);
        g.fillRect(4, 0, 24, 4);
        g.fillRect(4, 24, 24, 4);
        
        g.generateTexture('key', 32, 32);
        g.clear();
        
        // ========== DOOR VOXEL (Porte Futuriste) ==========
        // Cadre métallique lourd
        g.fillStyle(0x2a2a3a, 1);
        g.fillRect(0, 0, 64, 64);
        
        // Contours cadre
        g.lineStyle(4, 0x1a1a2a, 1);
        g.strokeRect(0, 0, 64, 64);
        
        // Portes coulissantes (voxel)
        g.fillStyle(0x4a4a5a, 1);
        g.fillRect(4, 4, 25, 56);
        g.fillRect(35, 4, 25, 56);
        
        // Détail portes - panneaux
        g.fillStyle(0x5a5a6a, 1);
        g.fillRect(6, 8, 21, 16);
        g.fillRect(6, 28, 21, 12);
        g.fillRect(6, 44, 21, 12);
        g.fillRect(37, 8, 21, 16);
        g.fillRect(37, 28, 21, 12);
        g.fillRect(37, 44, 21, 12);
        
        // Lignes néon sur portes
        g.fillStyle(0xff0000, 1);
        g.fillRect(4, 4, 25, 3);
        g.fillRect(35, 4, 25, 3);
        
        // Serrure centrale (voxel)
        g.fillStyle(0x333333, 1);
        g.fillRect(24, 24, 16, 16);
        g.fillStyle(0x444444, 1);
        g.fillRect(26, 26, 12, 12);
        
        // Voyant serrure (rouge = fermé)
        g.fillStyle(0xff0000, 1);
        g.fillRect(28, 28, 8, 8);
        g.fillStyle(0xff6666, 0.8);
        g.fillRect(30, 30, 4, 4);
        g.fillRect(35, 4, 25, 10);
        
        // Lignes de renforcement
        g.lineStyle(2, 0x555555, 1);
        g.moveTo(4, 20);
        g.lineTo(29, 20);
        g.moveTo(4, 44);
        g.lineTo(29, 44);
        g.moveTo(35, 20);
        g.lineTo(60, 20);
        g.moveTo(35, 44);
        g.lineTo(60, 44);
        g.strokePath();
        
        // Serrure centrale
        g.fillStyle(0x222222, 1);
        g.fillCircle(32, 32, 10);
        
        // Lumière serrure (rouge = fermée, s'allumera en vert)
        g.fillStyle(0xff3300, 1);
        g.fillCircle(32, 32, 6);
        g.fillStyle(0xff6666, 0.8);
        g.fillCircle(32, 30, 3);
        
        // Voyants latéraux
        g.fillStyle(0xff0000, 0.8);
        g.fillCircle(16, 32, 4);
        g.fillCircle(48, 32, 4);
        
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
        
        // Player - Spawn dans la salle de départ
        const spawnRoom = this.rooms.find(r => r.name === 'spawn');
        const spawnX = (spawnRoom.x + spawnRoom.w / 2) * this.tileSize;
        const spawnY = (spawnRoom.y + spawnRoom.h / 2) * this.tileSize;
        this.player = this.physics.add.sprite(spawnX, spawnY, 'player');
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
        
        // Door - Dans la salle boss
        const bossRoom = this.rooms.find(r => r.name === 'boss');
        const doorX = (bossRoom.x + bossRoom.w / 2) * this.tileSize;
        const doorY = (bossRoom.y + bossRoom.h / 2) * this.tileSize;
        this.door = this.physics.add.staticSprite(doorX, doorY, 'door');
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
        
        // MINIMAP STYLE ZELDA
        this.createMinimap();
    }
    
    createMinimap() {
        const mapX = 900;
        const mapY = 120;
        const mapW = 100;
        const mapH = 70;
        
        // Fond de la minimap
        this.minimapBg = this.add.rectangle(mapX, mapY, mapW, mapH, 0x000000, 0.7)
            .setStrokeStyle(2, 0x00ff41)
            .setScrollFactor(0)
            .setDepth(100);
        
        // Titre minimap
        this.add.text(mapX, mapY - 45, 'MAP', {
            fontSize: '12px',
            color: '#00ff41'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        
        // Position joueur sur minimap
        this.minimapPlayer = this.add.circle(mapX, mapY, 3, 0x00ff41)
            .setScrollFactor(0)
            .setDepth(101);
    }
    
    createWorld() {
        this.walls = this.physics.add.staticGroup();
        this.floorTiles = [];
        
        // Carte 80x50 tiles (Zelda style avec salles et couloirs)
        this.mapWidth = 80;
        this.mapHeight = 50;
        this.tileSize = 64;
        
        // Générer le monde vide d'abord
        for(let y = 0; y < this.mapHeight; y++) {
            this.floorTiles[y] = [];
            for(let x = 0; x < this.mapWidth; x++) {
                this.floorTiles[y][x] = 'wall';
            }
        }
        
        // Définir les salles (x, y, width, height, biome)
        const rooms = [
            {x: 5, y: 5, w: 12, h: 10, biome: 'forest', name: 'spawn'},      // Salle de départ
            {x: 20, y: 3, w: 10, h: 8, biome: 'forest', name: 'room1'},      // Salle nord
            {x: 18, y: 16, w: 14, h: 10, biome: 'forest', name: 'room2'},    // Salle sud
            {x: 35, y: 8, w: 12, h: 12, biome: 'rust', name: 'hub'},         // Hub central
            {x: 50, y: 5, w: 10, h: 10, biome: 'rust', name: 'room3'},       // Salle est haut
            {x: 52, y: 20, w: 12, h: 10, biome: 'rust', name: 'room4'},      // Salle est bas
            {x: 65, y: 12, w: 10, h: 12, biome: 'rust', name: 'boss'}        // Salle finale (porte)
        ];
        
        // Créer les salles
        rooms.forEach(room => {
            this.createRoom(room.x, room.y, room.w, room.h, room.biome);
        });
        
        // Connecter les salles avec des couloirs
        this.createCorridor(rooms[0], rooms[1]); // spawn -> room1
        this.createCorridor(rooms[0], rooms[2]); // spawn -> room2
        this.createCorridor(rooms[1], rooms[3]); // room1 -> hub
        this.createCorridor(rooms[2], rooms[3]); // room2 -> hub
        this.createCorridor(rooms[3], rooms[4]); // hub -> room3
        this.createCorridor(rooms[3], rooms[5]); // hub -> room4
        this.createCorridor(rooms[4], rooms[6]); // room3 -> boss
        this.createCorridor(rooms[5], rooms[6]); // room4 -> boss
        
        // Ajouter des détails dans les salles (piliers, obstacles)
        this.addRoomDetails(rooms);
        
        // Rendre la carte
        this.renderMap();
        
        // Mettre à jour les limites du monde
        this.physics.world.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);
        this.cameras.main.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);
        
        // Stocker les rooms pour le spawn
        this.rooms = rooms;
    }
    
    createRoom(x, y, w, h, biome) {
        for(let ry = y; ry < y + h; ry++) {
            for(let rx = x; rx < x + w; rx++) {
                if(ry >= 0 && ry < this.mapHeight && rx >= 0 && rx < this.mapWidth) {
                    this.floorTiles[ry][rx] = biome;
                }
            }
        }
    }
    
    createCorridor(roomA, roomB) {
        // Centre de chaque salle
        const x1 = Math.floor(roomA.x + roomA.w / 2);
        const y1 = Math.floor(roomA.y + roomA.h / 2);
        const x2 = Math.floor(roomB.x + roomB.w / 2);
        const y2 = Math.floor(roomB.y + roomB.h / 2);
        
        // Couloir en L (horizontal puis vertical ou inverse)
        const biome = roomA.biome === 'forest' || roomB.biome === 'forest' ? 'forest' : 'rust';
        
        if(Math.random() > 0.5) {
            // Horizontal puis vertical
            for(let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                this.floorTiles[y1][x] = biome;
                // Couloir plus large
                if(y1 + 1 < this.mapHeight) this.floorTiles[y1 + 1][x] = biome;
            }
            for(let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                this.floorTiles[y][x2] = biome;
                if(x2 + 1 < this.mapWidth) this.floorTiles[y][x2 + 1] = biome;
            }
        } else {
            // Vertical puis horizontal
            for(let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                this.floorTiles[y][x1] = biome;
                if(x1 + 1 < this.mapWidth) this.floorTiles[y][x1 + 1] = biome;
            }
            for(let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                this.floorTiles[y2][x] = biome;
                if(y2 + 1 < this.mapHeight) this.floorTiles[y2 + 1][x] = biome;
            }
        }
    }
    
    addRoomDetails(rooms) {
        rooms.forEach(room => {
            if(room.name === 'spawn') return; // Pas d'obstacles dans la salle de départ
            
            // Ajouter des piliers dans les coins
            this.floorTiles[room.y + 1][room.x + 1] = 'wall';
            this.floorTiles[room.y + 1][room.x + room.w - 2] = 'wall';
            this.floorTiles[room.y + room.h - 2][room.x + 1] = 'wall';
            this.floorTiles[room.y + room.h - 2][room.x + room.w - 2] = 'wall';
            
            // Ajouter des obstacles aléatoires
            const numObstacles = Math.floor(Math.random() * 3);
            for(let i = 0; i < numObstacles; i++) {
                const ox = room.x + 2 + Math.floor(Math.random() * (room.w - 4));
                const oy = room.y + 2 + Math.floor(Math.random() * (room.h - 4));
                this.floorTiles[oy][ox] = 'wall';
            }
        });
    }
    
    renderMap() {
        for(let y = 0; y < this.mapHeight; y++) {
            for(let x = 0; x < this.mapWidth; x++) {
                const px = x * this.tileSize + this.tileSize / 2;
                const py = y * this.tileSize + this.tileSize / 2;
                const tile = this.floorTiles[y][x];
                
                if(tile === 'forest') {
                    this.add.image(px, py, 'tile_forest');
                } else if(tile === 'rust') {
                    this.add.image(px, py, 'tile_rust');
                } else {
                    // Wall
                    this.add.image(px, py, 'tile_wall');
                    this.walls.create(px, py, 'tile_wall');
                }
            }
        }
    }
    
    spawnEnemies(count) {
        // Spawn ennemis dans les salles (sauf spawn et boss)
        const enemyRooms = this.rooms.filter(r => r.name !== 'spawn' && r.name !== 'boss');
        
        for(let i = 0; i < count; i++) {
            const room = enemyRooms[Math.floor(Math.random() * enemyRooms.length)];
            const x = (room.x + 2 + Math.random() * (room.w - 4)) * this.tileSize;
            const y = (room.y + 2 + Math.random() * (room.h - 4)) * this.tileSize;
            const enemy = this.enemies.create(x, y, 'enemy');
            enemy.setData('patrolX', x);
            enemy.setData('patrolY', y);
            enemy.setData('dir', Math.random() > 0.5 ? 1 : -1);
        }
    }
    
    spawnKeys(count) {
        // Placer les clés dans 3 salles différentes (sauf spawn et boss)
        const keyRooms = this.rooms.filter(r => r.name !== 'spawn' && r.name !== 'boss').slice(0, count);
        
        keyRooms.forEach(room => {
            const x = (room.x + room.w / 2) * this.tileSize;
            const y = (room.y + room.h / 2) * this.tileSize;
            const key = this.keysGroup.create(x, y, 'key');
            
            this.tweens.add({
                targets: key,
                y: y - 8,
                duration: 1500,
                yoyo: true,
                repeat: -1
            });
        });
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
        
        // Update minimap
        this.updateMinimap();
    }
    
    updateMinimap() {
        const mapX = 880;
        const mapY = 100;
        const worldW = this.mapWidth * this.tileSize;
        const worldH = this.mapHeight * this.tileSize;
        
        // Convertir position joueur monde → minimap
        const playerMapX = mapX - 55 + (this.player.x / worldW) * 110;
        const playerMapY = mapY - 35 + (this.player.y / worldH) * 70;
        
        this.minimapPlayer.x = Phaser.Math.Clamp(playerMapX, mapX - 55, mapX + 55);
        this.minimapPlayer.y = Phaser.Math.Clamp(playerMapY, mapY - 35, mapY + 35);
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
        
        // Particules de dash (traînée néon)
        for(let i = 0; i < 10; i++) {
            const particle = this.add.circle(
                this.player.x - Math.cos(angle) * i * 8,
                this.player.y - Math.sin(angle) * i * 8,
                4 - i * 0.3,
                0x00ff88,
                0.8 - i * 0.08
            );
            particle.setDepth(50);
            
            this.tweens.add({
                targets: particle,
                alpha: 0,
                scale: 0,
                duration: 300,
                delay: i * 20,
                onComplete: () => particle.destroy()
            });
        }
        
        this.time.delayedCall(150, () => {
            this.player.setAlpha(1);
            this.player.canDash = true;
        });
    }
    
    hitEnemy(player, enemy) {
        // If dashing, kill enemy
        if(!this.player.canDash) {
            const enemyX = enemy.x;
            const enemyY = enemy.y;
            
            // Particules d'explosion rouille
            for(let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 20 + Math.random() * 30;
                const particle = this.add.rectangle(enemyX, enemyY, 6, 6, 0x8b4513);
                particle.setDepth(55);
                
                this.tweens.add({
                    targets: particle,
                    x: enemyX + Math.cos(angle) * dist,
                    y: enemyY + Math.sin(angle) * dist,
                    angle: Math.random() * 360,
                    alpha: 0,
                    duration: 400,
                    ease: 'Power2',
                    onComplete: () => particle.destroy()
                });
            }
            
            // Flash rouge
            const flash = this.add.circle(enemyX, enemyY, 40, 0xff4400, 0.6);
            flash.setDepth(54);
            this.tweens.add({
                targets: flash,
                scale: 1.5,
                alpha: 0,
                duration: 200,
                onComplete: () => flash.destroy()
            });
            
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
        const keyX = key.x;
        const keyY = key.y;
        
        // Particules de collecte (étincelles dorées)
        for(let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            const particle = this.add.circle(keyX, keyY, 3, 0xffcc00, 1);
            particle.setDepth(60);
            
            this.tweens.add({
                targets: particle,
                x: keyX + Math.cos(angle) * 40,
                y: keyY + Math.sin(angle) * 40,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
        
        // Flash lumineux
        const flash = this.add.circle(keyX, keyY, 30, 0xffffaa, 0.8);
        flash.setDepth(59);
        this.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => flash.destroy()
        });
        
        key.destroy();
        this.player.keys++;
        this.keysText.setText(`Keys: ${this.player.keys}/3`);
        
        if(this.player.keys >= 3) {
            this.doorLocked = false;
            this.missionText.setText('DOOR OPEN! Escape!');
            this.missionText.setBackgroundColor('#00aa00');
            
            // Effet porte qui s'ouvre (changement de couleur)
            this.door.setTint(0x88ff88);
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
