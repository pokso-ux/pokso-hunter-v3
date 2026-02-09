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
        scene.clearColor = new BABYLON.Color3(0.15, 0.15, 0.25);
        
        // Pas de fog pour test
        // scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        // scene.fogDensity = 0.008;
        // scene.fogColor = new BABYLON.Color3(0.15, 0.15, 0.25);
        
        // Caméra isométrique - position de départ au centre
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 35, BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 10;
        camera.upperRadiusLimit = 60;
        
        // Lumière ambiante forte
        const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        hemiLight.intensity = 1.2;
        hemiLight.diffuse = new BABYLON.Color3(0.7, 0.7, 0.8);
        hemiLight.groundColor = new BABYLON.Color3(0.4, 0.4, 0.5);
        
        // Glow layer
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 0.5;
        
        // Directional light
        const dirLight = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
        dirLight.position = new BABYLON.Vector3(10, 20, 10);
        dirLight.intensity = 0.8;
        
        // ShadowGenerator pour ombres réalistes
        const shadowGenerator = new BABYLON.ShadowGenerator(2048, dirLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        
        // Lumières colorées par zone
        const forestLight = new BABYLON.PointLight("forestLight", new BABYLON.Vector3(-15, 8, 0), scene);
        forestLight.diffuse = new BABYLON.Color3(0.2, 0.8, 0.4);
        forestLight.intensity = 0.6;
        forestLight.range = 25;
        
        const rustLight = new BABYLON.PointLight("rustLight", new BABYLON.Vector3(15, 8, 0), scene);
        rustLight.diffuse = new BABYLON.Color3(0.9, 0.3, 0.1);
        rustLight.intensity = 0.6;
        rustLight.range = 25;
        
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
        shadowGenerator.addShadowCaster(body);
        
        // Tête violette
        const head = BABYLON.MeshBuilder.CreateBox("head", {size: 1}, scene);
        head.parent = player;
        head.position.y = 2;
        const headMat = new BABYLON.StandardMaterial("headMat", scene);
        headMat.diffuseColor = new BABYLON.Color3(0.6, 0.2, 1);
        headMat.emissiveColor = new BABYLON.Color3(0.2, 0.05, 0.3);
        head.material = headMat;
        shadowGenerator.addShadowCaster(head);
        
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
        shadowGenerator.addShadowCaster(leftHand);
        
        const rightHand = leftHand.clone("rightHand");
        rightHand.parent = player;
        rightHand.position = new BABYLON.Vector3(1, 0.8, 0);
        shadowGenerator.addShadowCaster(rightHand);
        
        // ========== SOL (Zones Forest + Rust) ==========
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 60, height: 40}, scene);
        const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.2);
        ground.material = groundMat;
        ground.receiveShadows = true;
        
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
        
        // ========== ARBRES 3D ==========
        function createTree(x, z) {
            const treeGroup = new BABYLON.TransformNode("tree", scene);
            treeGroup.position = new BABYLON.Vector3(x, 0, z);
            
            // Tronc
            const trunk = BABYLON.MeshBuilder.CreateCylinder("trunk", {height: 2, diameter: 0.6}, scene);
            trunk.parent = treeGroup;
            trunk.position.y = 1;
            const trunkMat = new BABYLON.StandardMaterial("trunkMat", scene);
            trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.1);
            trunk.material = trunkMat;
            shadowGenerator.addShadowCaster(trunk);
            
            // Feuillage - 3 cônes empilés
            const leavesMat = new BABYLON.StandardMaterial("leavesMat", scene);
            leavesMat.diffuseColor = new BABYLON.Color3(0.1, 0.6, 0.2);
            leavesMat.emissiveColor = new BABYLON.Color3(0, 0.2, 0.1);
            
            const leaves1 = BABYLON.MeshBuilder.CreateCylinder("leaves1", {height: 1.5, diameterTop: 0, diameterBottom: 2.5}, scene);
            leaves1.parent = treeGroup;
            leaves1.position.y = 2.5;
            leaves1.material = leavesMat;
            shadowGenerator.addShadowCaster(leaves1);
            
            const leaves2 = BABYLON.MeshBuilder.CreateCylinder("leaves2", {height: 1.2, diameterTop: 0, diameterBottom: 2}, scene);
            leaves2.parent = treeGroup;
            leaves2.position.y = 3.2;
            leaves2.material = leavesMat;
            shadowGenerator.addShadowCaster(leaves2);
            
            const leaves3 = BABYLON.MeshBuilder.CreateCylinder("leaves3", {height: 1, diameterTop: 0, diameterBottom: 1.5}, scene);
            leaves3.parent = treeGroup;
            leaves3.position.y = 3.8;
            leaves3.material = leavesMat;
            shadowGenerator.addShadowCaster(leaves3);
        }
        
        // Ajouter des arbres dans la zone forest
        createTree(-25, -15);
        createTree(-22, 12);
        createTree(-18, -8);
        createTree(-12, 16);
        createTree(-8, -12);
        createTree(-5, 8);
        
        // ========== ROCHERS ==========
        function createRock(x, z, scale) {
            const rock = BABYLON.MeshBuilder.CreateSphere("rock", {diameter: 1, segments: 6}, scene);
            rock.position = new BABYLON.Vector3(x, 0.3 * scale, z);
            rock.scaling = new BABYLON.Vector3(scale, scale * 0.6, scale);
            rock.rotation = new BABYLON.Vector3(Math.random(), Math.random(), Math.random());
            
            const rockMat = new BABYLON.StandardMaterial("rockMat", scene);
            rockMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.45);
            rock.material = rockMat;
            shadowGenerator.addShadowCaster(rock);
        }
        
        // Ajouter des rochers
        createRock(-28, -5, 1.2);
        createRock(-26, 5, 0.8);
        createRock(5, -18, 1.5);
        createRock(10, 15, 1);
        createRock(20, -12, 0.9);
        
        // ========== CLÉS AMÉLIORÉES (Gemmes 3D) ==========
        const keys = [];
        const keyPositions = [
            new BABYLON.Vector3(-20, 1, -10),
            new BABYLON.Vector3(20, 1, -10),
            new BABYLON.Vector3(0, 1, 15)
        ];
        
        keyPositions.forEach((pos, i) => {
            const gemGroup = new BABYLON.TransformNode("gem" + i, scene);
            gemGroup.position = pos;
            
            // Gemme centrale (octaèdre)
            const gem = BABYLON.MeshBuilder.CreatePolyhedron("gem" + i, {type: 1, size: 0.4}, scene);
            gem.parent = gemGroup;
            const gemMat = new BABYLON.StandardMaterial("gemMat" + i, scene);
            gemMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
            gemMat.emissiveColor = new BABYLON.Color3(0.8, 0.6, 0);
            gemMat.specularColor = new BABYLON.Color3(1, 1, 1);
            gemMat.alpha = 0.9;
            gem.material = gemMat;
            
            // Halo lumineux
            const halo = BABYLON.MeshBuilder.CreateSphere("halo" + i, {diameter: 1.2}, scene);
            halo.parent = gemGroup;
            const haloMat = new BABYLON.StandardMaterial("haloMat" + i, scene);
            haloMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0);
            haloMat.alpha = 0.2;
            halo.material = haloMat;
            
            // Particules flottantes autour
            for(let j = 0; j < 5; j++) {
                const particle = BABYLON.MeshBuilder.CreateSphere("p" + j, {diameter: 0.1}, scene);
                particle.parent = gemGroup;
                particle.position = new BABYLON.Vector3(
                    Math.cos(j * 1.2) * 0.6,
                    Math.sin(j * 1.5) * 0.3,
                    Math.sin(j * 1.2) * 0.6
                );
                const pMat = new BABYLON.StandardMaterial("pMat" + j, scene);
                pMat.emissiveColor = new BABYLON.Color3(1, 0.9, 0.5);
                particle.material = pMat;
            }
            
            keys.push({mesh: gem, group: gemGroup});
            
            // Animation rotation + flottement
            const rotAnim = new BABYLON.Animation("rot", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            const rotKeys = [];
            rotKeys.push({frame: 0, value: 0});
            rotKeys.push({frame: 60, value: Math.PI * 2});
            rotAnim.setKeys(rotKeys);
            gemGroup.animations.push(rotAnim);
            scene.beginAnimation(gemGroup, 0, 60, true);
            
            const floatAnim = new BABYLON.Animation("float", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            const floatKeys = [];
            floatKeys.push({frame: 0, value: 1});
            floatKeys.push({frame: 30, value: 1.3});
            floatKeys.push({frame: 60, value: 1});
            floatAnim.setKeys(floatKeys);
            gemGroup.animations.push(floatAnim);
            scene.beginAnimation(gemGroup, 0, 60, true);
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
        
        // ========== ARBRES 3D ==========
        function createTree(x, z) {
            const tree = new BABYLON.TransformNode("tree", scene);
            tree.position = new BABYLON.Vector3(x, 0, z);
            
            // Tronc
            const trunk = BABYLON.MeshBuilder.CreateCylinder("trunk", {height: 2, diameter: 0.4}, scene);
            trunk.parent = tree;
            trunk.position.y = 1;
            const trunkMat = new BABYLON.StandardMaterial("trunkMat", scene);
            trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.1);
            trunk.material = trunkMat;
            shadowGenerator.addShadowCaster(trunk);
            
            // Feuillage (3 cônes)
            const leavesMat = new BABYLON.StandardMaterial("leavesMat", scene);
            leavesMat.diffuseColor = new BABYLON.Color3(0.1, 0.6, 0.2);
            leavesMat.emissiveColor = new BABYLON.Color3(0, 0.2, 0.1);
            
            const leaves1 = BABYLON.MeshBuilder.CreateCylinder("leaves1", {height: 1.5, diameterTop: 0, diameterBottom: 2}, scene);
            leaves1.parent = tree;
            leaves1.position.y = 2.5;
            leaves1.material = leavesMat;
            shadowGenerator.addShadowCaster(leaves1);
            
            const leaves2 = BABYLON.MeshBuilder.CreateCylinder("leaves2", {height: 1.2, diameterTop: 0, diameterBottom: 1.6}, scene);
            leaves2.parent = tree;
            leaves2.position.y = 3.2;
            leaves2.material = leavesMat;
            shadowGenerator.addShadowCaster(leaves2);
            
            const leaves3 = BABYLON.MeshBuilder.CreateCylinder("leaves3", {height: 1, diameterTop: 0, diameterBottom: 1.2}, scene);
            leaves3.parent = tree;
            leaves3.position.y = 3.8;
            leaves3.material = leavesMat;
            shadowGenerator.addShadowCaster(leaves3);
        }
        
        // Placer des arbres dans la zone Forest
        for(let i = 0; i < 15; i++) {
            const x = -25 + Math.random() * 20;
            const z = -15 + Math.random() * 30;
            createTree(x, z);
        }
        
        // ========== ROCHERS ==========
        function createRock(x, z) {
            const rock = BABYLON.MeshBuilder.CreateSphere("rock", {diameter: 1 + Math.random()}, scene);
            rock.position = new BABYLON.Vector3(x, 0.3, z);
            rock.scaling = new BABYLON.Vector3(1 + Math.random() * 0.5, 0.6, 1 + Math.random() * 0.5);
            const rockMat = new BABYLON.StandardMaterial("rockMat", scene);
            rockMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.45);
            rock.material = rockMat;
            shadowGenerator.addShadowCaster(rock);
        }
        
        // Placer des rochers
        for(let i = 0; i < 10; i++) {
            const x = -28 + Math.random() * 56;
            const z = -18 + Math.random() * 36;
            createRock(x, z);
        }
        
        // ========== PARTICULES AMBIANCE ==========
        const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene);
        particleSystem.emitter = new BABYLON.Vector3(0, 5, 0);
        particleSystem.minEmitBox = new BABYLON.Vector3(-30, 0, -20);
        particleSystem.maxEmitBox = new BABYLON.Vector3(30, 10, 20);
        particleSystem.color1 = new BABYLON.Color4(0.2, 0.8, 1, 0.3);
        particleSystem.color2 = new BABYLON.Color4(0.1, 0.5, 0.8, 0.2);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.15;
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 5;
        particleSystem.emitRate = 50;
        particleSystem.gravity = new BABYLON.Vector3(0, 0.5, 0);
        particleSystem.start();
        
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
            
            // Ajouter ombres
            shadowGenerator.addShadowCaster(enemyBody);
            
            enemies.push({
                mesh: enemy,
                body: enemyBody,
                startPos: enemy.position.clone(),
                direction: 1,
                speed: 0.03 + Math.random() * 0.02,
                chaseRange: 10,
                isChasing: false
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
        
        // ========== HUD ==========
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        // Barre de vie
        const healthBar = new BABYLON.GUI.Rectangle();
        healthBar.width = "200px";
        healthBar.height = "20px";
        healthBar.cornerRadius = 10;
        healthBar.color = "#00ff88";
        healthBar.thickness = 2;
        healthBar.background = "#000000";
        healthBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        healthBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        healthBar.left = "20px";
        healthBar.top = "20px";
        advancedTexture.addControl(healthBar);
        
        const healthFill = new BABYLON.GUI.Rectangle();
        healthFill.width = "100%";
        healthFill.height = "100%";
        healthFill.background = "#00ff88";
        healthFill.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        healthBar.addControl(healthFill);
        
        const healthText = new BABYLON.GUI.TextBlock();
        healthText.text = "HP: 100";
        healthText.color = "white";
        healthText.fontSize = 14;
        healthBar.addControl(healthText);
        
        // Compteur de clés
        const keysText = new BABYLON.GUI.TextBlock();
        keysText.text = "Keys: 0/3";
        keysText.color = "#ffcc00";
        keysText.fontSize = 20;
        keysText.fontWeight = "bold";
        keysText.shadowColor = "#ffaa00";
        keysText.shadowBlur = 10;
        keysText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        keysText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        keysText.left = "20px";
        keysText.top = "50px";
        advancedTexture.addControl(keysText);
        
        // ========== GAME LOOP ==========
        let playerSpeed = 0.15;
        let keysCollected = 0;
        let canDash = true;
        let playerHealth = 100;
        
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
            
            // Animation ennemis avec IA améliorée
            enemies.forEach(enemy => {
                const distToPlayer = BABYLON.Vector3.Distance(enemy.mesh.position, player.position);
                
                if(distToPlayer < enemy.chaseRange) {
                    // Mode poursuite
                    enemy.isChasing = true;
                    const chaseDir = player.position.subtract(enemy.mesh.position).normalize();
                    enemy.mesh.position.addInPlace(chaseDir.scale(enemy.speed * 2));
                    enemy.mesh.lookAt(player.position);
                    
                    // Animation marche
                    enemy.body.rotation.z = Math.sin(Date.now() * 0.015) * 0.15;
                } else {
                    // Mode patrouille
                    enemy.isChasing = false;
                    enemy.mesh.position.x += enemy.speed * enemy.direction;
                    if(Math.abs(enemy.mesh.position.x - enemy.startPos.x) > 5) {
                        enemy.direction *= -1;
                    }
                    enemy.mesh.lookAt(new BABYLON.Vector3(
                        enemy.mesh.position.x + enemy.direction,
                        enemy.mesh.position.y,
                        enemy.mesh.position.z
                    ));
                }
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
                    
                    // Mise à jour HUD
                    keysText.text = "Keys: " + keysCollected + "/3";
                    
                    if(keysCollected >= 3) {
                        doorLight.diffuse = new BABYLON.Color3(0, 1, 0);
                        keysText.text = "DOOR OPEN!";
                        keysText.color = "#00ff00";
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