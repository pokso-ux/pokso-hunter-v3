// POXSO HUNTER V3 - Babylon.js 3D Version

// Attendre que Babylon.js soit chargé
window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.getElementById('game-container').appendChild(canvas);
    
    const engine = new BABYLON.Engine(canvas, true);
    
    const createScene = function() {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.1);
        
        // Fog atmosphérique
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.02;
        scene.fogColor = new BABYLON.Color3(0.05, 0.05, 0.1);
        
        // Caméra isométrique
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 50;
        
        // Lumières
        const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0.3;
        hemiLight.diffuse = new BABYLON.Color3(0.2, 0.3, 0.5);
        
        // Glow layer pour effet néon
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 0.6;
        
        // ========== JOUEUR 3D (Robot Voxel) ==========
        const player = new BABYLON.TransformNode("player", scene);
        player.position.y = 1;
        
        // Corps cyan
        const body = BABYLON.MeshBuilder.CreateBox("body", {size: 1.5}, scene);
        body.parent = player;
        body.position.y = 0.75;
        const bodyMat = new BABYLON.StandardMaterial("bodyMat", scene);
        bodyMat.diffuseColor = new BABYLON.Color3(0, 0.83, 1);
        bodyMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0.4);
        body.material = bodyMat;
        
        // Tête violette
        const head = BABYLON.MeshBuilder.CreateBox("head", {size: 1}, scene);
        head.parent = player;
        head.position.y = 2;
        const headMat = new BABYLON.StandardMaterial("headMat", scene);
        headMat.diffuseColor = new BABYLON.Color3(0.6, 0.2, 1);
        headMat.emissiveColor = new BABYLON.Color3(0.2, 0.05, 0.3);
        head.material = headMat;
        
        // Yeux roses
        const leftEye = BABYLON.MeshBuilder.CreateSphere("leftEye", {diameter: 0.3}, scene);
        leftEye.parent = head;
        leftEye.position = new BABYLON.Vector3(-0.25, 0.1, 0.4);
        const eyeMat = new BABYLON.StandardMaterial("eyeMat", scene);
        eyeMat.diffuseColor = new BABYLON.Color3(1, 0.4, 0.8);
        eyeMat.emissiveColor = new BABYLON.Color3(1, 0.2, 0.5);
        leftEye.material = eyeMat;
        
        const rightEye = leftEye.clone("rightEye");
        rightEye.parent = head;
        rightEye.position = new BABYLON.Vector3(0.25, 0.1, 0.4);
        
        // Mains jaunes
        const leftHand = BABYLON.MeshBuilder.CreateBox("leftHand", {size: 0.6}, scene);
        leftHand.parent = player;
        leftHand.position = new BABYLON.Vector3(-1, 0.8, 0);
        const handMat = new BABYLON.StandardMaterial("handMat", scene);
        handMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
        leftHand.material = handMat;
        
        const rightHand = leftHand.clone("rightHand");
        rightHand.parent = player;
        rightHand.position = new BABYLON.Vector3(1, 0.8, 0);
        
        // ========== SOL (Zones Forest + Rust) ==========
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 60, height: 40}, scene);
        const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        
        // Texture procédurale pour le sol
        const groundTexture = new BABYLON.DynamicTexture("groundTex", {width: 512, height: 512}, scene);
        const ctx = groundTexture.getContext();
        
        // Zone Forest (moitié gauche)
        ctx.fillStyle = "#1a4a1a";
        ctx.fillRect(0, 0, 256, 512);
        ctx.fillStyle = "#2d8a2d";
        for(let i = 0; i < 50; i++) {
            ctx.fillRect(Math.random() * 256, Math.random() * 512, 20, 20);
        }
        
        // Zone Rust (moitié droite)
        ctx.fillStyle = "#2a2a3a";
        ctx.fillRect(256, 0, 256, 512);
        ctx.fillStyle = "#4a4a5a";
        for(let i = 0; i < 30; i++) {
            ctx.fillRect(256 + Math.random() * 256, Math.random() * 512, 30, 30);
        }
        
        groundTexture.update();
        groundMat.diffuseTexture = groundTexture;
        ground.material = groundMat;
        
        // ========== MURS (Style Voxel) ==========
        const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
        wallMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        
        function createWall(x, z, w, d) {
            const wall = BABYLON.MeshBuilder.CreateBox("wall", {width: w, height: 3, depth: d}, scene);
            wall.position = new BABYLON.Vector3(x, 1.5, z);
            wall.material = wallMat;
            return wall;
        }
        
        // Bordures de la carte
        createWall(0, -20, 60, 2);
        createWall(0, 20, 60, 2);
        createWall(-30, 0, 2, 40);
        createWall(30, 0, 2, 40);
        
        // Murs intérieurs (salles)
        createWall(-15, 0, 2, 15);
        createWall(15, 0, 2, 15);
        createWall(0, -10, 20, 2);
        createWall(0, 10, 20, 2);
        
        // ========== CLÉS (Coffres Dorés) ==========
        const keys = [];
        const keyPositions = [
            new BABYLON.Vector3(-20, 0.5, -10),
            new BABYLON.Vector3(20, 0.5, -10),
            new BABYLON.Vector3(0, 0.5, 15)
        ];
        
        keyPositions.forEach((pos, i) => {
            const chest = BABYLON.MeshBuilder.CreateBox("key" + i, {width: 0.8, height: 0.6, depth: 0.6}, scene);
            chest.position = pos;
            chest.position.y = 0.5;
            const chestMat = new BABYLON.StandardMaterial("chestMat", scene);
            chestMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
            chestMat.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0);
            chest.material = chestMat;
            keys.push(chest);
            
            // Animation flottante
            const anim = new BABYLON.Animation("float", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            const keysAnim = [];
            keysAnim.push({frame: 0, value: 0.5});
            keysAnim.push({frame: 30, value: 0.8});
            keysAnim.push({frame: 60, value: 0.5});
            anim.setKeys(keysAnim);
            chest.animations.push(anim);
            scene.beginAnimation(chest, 0, 60, true);
        });
        
        // ========== PORTE ==========
        const door = BABYLON.MeshBuilder.CreateBox("door", {width: 4, height: 4, depth: 1}, scene);
        door.position = new BABYLON.Vector3(25, 2, 0);
        const doorMat = new BABYLON.StandardMaterial("doorMat", scene);
        doorMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.25);
        door.material = doorMat;
        
        // Lumières néon sur la porte
        const doorLight = new BABYLON.PointLight("doorLight", new BABYLON.Vector3(25, 3, 2), scene);
        doorLight.diffuse = new BABYLON.Color3(1, 0, 0);
        doorLight.intensity = 0.5;
        
        // ========== ENNEMIS ==========
        const enemies = [];
        for(let i = 0; i < 5; i++) {
            const enemy = new BABYLON.TransformNode("enemy" + i, scene);
            enemy.position = new BABYLON.Vector3(
                (Math.random() - 0.5) * 40,
                0.8,
                (Math.random() - 0.5) * 30
            );
            
            const enemyBody = BABYLON.MeshBuilder.CreateBox("eBody", {size: 1.2}, scene);
            enemyBody.parent = enemy;
            enemyBody.position.y = 0.6;
            const enemyMat = new BABYLON.StandardMaterial("enemyMat", scene);
            enemyMat.diffuseColor = new BABYLON.Color3(0.55, 0.27, 0.05);
            enemyMat.emissiveColor = new BABYLON.Color3(0.2, 0.1, 0.02);
            enemyBody.material = enemyMat;
            
            const enemyEye = BABYLON.MeshBuilder.CreateSphere("eEye", {diameter: 0.4}, scene);
            enemyEye.parent = enemy;
            enemyEye.position = new BABYLON.Vector3(0, 1.2, 0.4);
            const eEyeMat = new BABYLON.StandardMaterial("eEyeMat", scene);
            eEyeMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
            eEyeMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
            enemyEye.material = eEyeMat;
            
            enemies.push({
                mesh: enemy,
                startPos: enemy.position.clone(),
                direction: 1
            });
        }
        
        // ========== CONTRÔLES ==========
        const inputMap = {};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
            inputMap[evt.sourceEvent.key.toLowerCase()] = true;
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
            inputMap[evt.sourceEvent.key.toLowerCase()] = false;
        }));
        
        // ========== GAME LOOP ==========
        let playerSpeed = 0.15;
        let keysCollected = 0;
        let canDash = true;
        
        scene.registerBeforeRender(function() {
            // Mouvement joueur
            const moveVector = new BABYLON.Vector3(0, 0, 0);
            if(inputMap["w"] || inputMap["arrowup"]) moveVector.z += 1;
            if(inputMap["s"] || inputMap["arrowdown"]) moveVector.z -= 1;
            if(inputMap["a"] || inputMap["arrowleft"]) moveVector.x -= 1;
            if(inputMap["d"] || inputMap["arrowright"]) moveVector.x += 1;
            
            if(moveVector.length() > 0) {
                moveVector.normalize().scaleInPlace(playerSpeed);
                player.position.addInPlace(moveVector);
                
                // Rotation vers la direction
                player.lookAt(player.position.add(moveVector));
                
                // Animation marche
                body.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
            }
            
            // Dash
            if(inputMap[" "] && canDash && moveVector.length() > 0) {
                canDash = false;
                const dashVector = moveVector.normalize().scale(3);
                player.position.addInPlace(dashVector);
                
                // Effet dash (particules)
                for(let i = 0; i < 10; i++) {
                    const p = BABYLON.MeshBuilder.CreateSphere("p", {diameter: 0.2}, scene);
                    p.position = player.position.clone();
                    p.material = bodyMat;
                    setTimeout(() => p.dispose(), 300);
                }
                
                setTimeout(() => canDash = true, 500);
            }
            
            // Limites carte
            player.position.x = Math.max(-28, Math.min(28, player.position.x));
            player.position.z = Math.max(-18, Math.min(18, player.position.z));
            
            // Caméra suit joueur
            camera.target = player.position;
            
            // Animation ennemis
            enemies.forEach(enemy => {
                enemy.mesh.position.x += 0.02 * enemy.direction;
                if(Math.abs(enemy.mesh.position.x - enemy.startPos.x) > 5) {
                    enemy.direction *= -1;
                }
                enemy.mesh.lookAt(new BABYLON.Vector3(
                    enemy.mesh.position.x + enemy.direction,
                    enemy.mesh.position.y,
                    enemy.mesh.position.z
                ));
            });
            
            // Collecte clés
            keys.forEach((key, i) => {
                if(key && key.intersectsMesh(body, false)) {
                    key.dispose();
                    keys[i] = null;
                    keysCollected++;
                    
                    // Effet collecte
                    const flash = BABYLON.MeshBuilder.CreateSphere("flash", {diameter: 2}, scene);
                    flash.position = player.position.clone();
                    flash.position.y += 2;
                    const flashMat = new BABYLON.StandardMaterial("flash", scene);
                    flashMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
                    flash.material = flashMat;
                    setTimeout(() => flash.dispose(), 200);
                    
                    if(keysCollected >= 3) {
                        doorLight.diffuse = new BABYLON.Color3(0, 1, 0);
                    }
                }
            });
        });
        
        return scene;
    };
    
    const scene = createScene();
    
    engine.runRenderLoop(function() {
        scene.render();
    });
    
    window.addEventListener('resize', function() {
        engine.resize();
    });
});