// POXSO HUNTER V3 - Complete 3D Game

window.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('game-container');
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    
    const engine = new BABYLON.Engine(canvas, true);
    
    const createScene = function() {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.1, 0.15, 0.2);
        
        // Caméra
        const camera = new BABYLON.ArcRotateCamera("cam", -Math.PI/2, Math.PI/2.5, 30, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 15;
        camera.upperRadiusLimit = 50;
        
        // Lumières
        const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0.9;
        hemiLight.groundColor = new BABYLON.Color3(0.2, 0.25, 0.3);
        
        // Glow pour effet néon
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 0.4;
        
        // ========== TERRAIN ==========
        // Zone 1: Forest (gauche)
        const ground1 = BABYLON.MeshBuilder.CreateGround("g1", {width: 30, height: 40}, scene);
        ground1.position.x = -15;
        const mat1 = new BABYLON.StandardMaterial("m1", scene);
        mat1.diffuseColor = new BABYLON.Color3(0.15, 0.4, 0.15);
        mat1.specularColor = new BABYLON.Color3(0.1, 0.2, 0.1);
        ground1.material = mat1;
        
        // Zone 2: Rust (droite)
        const ground2 = BABYLON.MeshBuilder.CreateGround("g2", {width: 30, height: 40}, scene);
        ground2.position.x = 15;
        const mat2 = new BABYLON.StandardMaterial("m2", scene);
        mat2.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.15);
        mat2.specularColor = new BABYLON.Color3(0.2, 0.15, 0.1);
        ground2.material = mat2;
        
        // ========== JOUEUR ==========
        const player = BABYLON.MeshBuilder.CreateBox("player", {height: 1.8, width: 1, depth: 0.8}, scene);
        player.position.y = 0.9;
        const pMat = new BABYLON.StandardMaterial("pMat", scene);
        pMat.diffuseColor = new BABYLON.Color3(0, 0.7, 0.9);
        pMat.emissiveColor = new BABYLON.Color3(0, 0.2, 0.3);
        player.material = pMat;
        
        // Yeux
        const leftEye = BABYLON.MeshBuilder.CreateSphere("le", {diameter: 0.25}, scene);
        leftEye.parent = player;
        leftEye.position = new BABYLON.Vector3(-0.25, 0.3, 0.4);
        const eyeMat = new BABYLON.StandardMaterial("eyeMat", scene);
        eyeMat.emissiveColor = new BABYLON.Color3(1, 0.5, 0.8);
        leftEye.material = eyeMat;
        
        const rightEye = leftEye.clone("re");
        rightEye.position.x = 0.25;
        
        // ========== ARBRES ==========
        function createTree(x, z, zone) {
            const trunk = BABYLON.MeshBuilder.CreateCylinder("trunk", {height: 2, diameter: 0.5}, scene);
            trunk.position = new BABYLON.Vector3(x, 1, z);
            const tMat = new BABYLON.StandardMaterial("tMat", scene);
            tMat.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.1);
            trunk.material = tMat;
            
            const leaves = BABYLON.MeshBuilder.CreateCylinder("leaves", {height: 2.5, diameterTop: 0, diameterBottom: 2.5}, scene);
            leaves.position = new BABYLON.Vector3(x, 2.5, z);
            const lMat = new BABYLON.StandardMaterial("lMat", scene);
            if(zone === 'forest') {
                lMat.diffuseColor = new BABYLON.Color3(0.1, 0.6, 0.2);
                lMat.emissiveColor = new BABYLON.Color3(0, 0.2, 0.1);
            } else {
                lMat.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.1);
                lMat.emissiveColor = new BABYLON.Color3(0.2, 0.1, 0);
            }
            leaves.material = lMat;
        }
        
        // Placer arbres Forest
        createTree(-20, -10, 'forest');
        createTree(-25, 5, 'forest');
        createTree(-18, 12, 'forest');
        createTree(-22, -5, 'forest');
        createTree(-15, -15, 'forest');
        createTree(-8, 8, 'forest');
        
        // Placer arbres Rust
        createTree(20, -12, 'rust');
        createTree(25, 8, 'rust');
        createTree(18, 15, 'rust');
        createTree(22, -8, 'rust');
        createTree(12, -5, 'rust');
        createTree(15, 10, 'rust');
        
        // ========== ROCHERS ==========
        for(let i = 0; i < 12; i++) {
            const rock = BABYLON.MeshBuilder.CreateSphere("rock" + i, {diameter: 1 + Math.random()}, scene);
            rock.position = new BABYLON.Vector3(
                (Math.random() - 0.5) * 50,
                0.3,
                (Math.random() - 0.5) * 35
            );
            rock.scaling.y = 0.5;
            const rMat = new BABYLON.StandardMaterial("rMat", scene);
            rMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.45);
            rock.material = rMat;
        }
        
        // ========== CLÉS ==========
        const keys = [];
        const keyPos = [
            new BABYLON.Vector3(-20, 0.5, 0),
            new BABYLON.Vector3(20, 0.5, 0),
            new BABYLON.Vector3(0, 0.5, 15)
        ];
        
        keyPos.forEach((pos, i) => {
            const key = BABYLON.MeshBuilder.CreatePolyhedron("key" + i, {type: 1, size: 0.4}, scene);
            key.position = pos;
            key.position.y = 0.8;
            const kMat = new BABYLON.StandardMaterial("kMat", scene);
            kMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
            kMat.emissiveColor = new BABYLON.Color3(0.8, 0.6, 0);
            key.material = kMat;
            keys.push(key);
            
            // Animation rotation
            scene.registerBeforeRender(function() {
                if(key) key.rotation.y += 0.02;
            });
        });
        
        // ========== PORTE ==========
        const doorFrame = BABYLON.MeshBuilder.CreateBox("doorF", {width: 4, height: 4, depth: 1}, scene);
        doorFrame.position = new BABYLON.Vector3(0, 2, -18);
        const dMat = new BABYLON.StandardMaterial("dMat", scene);
        dMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        doorFrame.material = dMat;
        
        // Lumière porte
        const doorLight = BABYLON.PointLight("dl", new BABYLON.Vector3(0, 3, -17), scene);
        doorLight.diffuse = new BABYLON.Color3(1, 0, 0);
        doorLight.intensity = 0.8;
        doorLight.range = 8;
        
        // ========== ENNEMIS ==========
        const enemies = [];
        for(let i = 0; i < 6; i++) {
            const enemy = BABYLON.MeshBuilder.CreateBox("e" + i, {height: 1.5, width: 0.8, depth: 0.8}, scene);
            enemy.position = new BABYLON.Vector3(
                (Math.random() - 0.5) * 40,
                0.75,
                (Math.random() - 0.5) * 30
            );
            const eMat = new BABYLON.StandardMaterial("eMat", scene);
            eMat.diffuseColor = new BABYLON.Color3(0.6, 0.3, 0.1);
            eMat.emissiveColor = new BABYLON.Color3(0.2, 0.1, 0);
            enemy.material = eMat;
            
            enemies.push({
                mesh: enemy,
                startX: enemy.position.x,
                dir: 1,
                speed: 0.03 + Math.random() * 0.02
            });
        }
        
        // ========== CONTRÔLES ==========
        const input = {};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(e) {
            input[e.sourceEvent.key.toLowerCase()] = true;
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(e) {
            input[e.sourceEvent.key.toLowerCase()] = false;
        }));
        
        // ========== GAME LOOP ==========
        let keysCollected = 0;
        let canDash = true;
        
        scene.registerBeforeRender(function() {
            // Mouvement
            const speed = 0.12;
            let moved = false;
            
            if(input["w"]) { player.position.z += speed; moved = true; }
            if(input["s"]) { player.position.z -= speed; moved = true; }
            if(input["a"]) { player.position.x -= speed; moved = true; }
            if(input["d"]) { player.position.x += speed; moved = true; }
            
            // Limites
            player.position.x = Math.max(-28, Math.min(28, player.position.x));
            player.position.z = Math.max(-18, Math.min(18, player.position.z));
            
            // Dash
            if(input[" "] && canDash && moved) {
                canDash = false;
                const dash = 2.5;
                if(input["w"]) player.position.z += dash;
                if(input["s"]) player.position.z -= dash;
                if(input["a"]) player.position.x -= dash;
                if(input["d"]) player.position.x += dash;
                setTimeout(() => canDash = true, 600);
            }
            
            // Animation marche
            if(moved) {
                player.rotation.y += 0.1;
            }
            
            // Caméra suit
            camera.target = player.position;
            
            // Ennemis patrouille
            enemies.forEach(e => {
                e.mesh.position.x += e.speed * e.dir;
                if(Math.abs(e.mesh.position.x - e.startX) > 5) {
                    e.dir *= -1;
                }
                e.mesh.lookAt(new BABYLON.Vector3(e.mesh.position.x + e.dir, e.mesh.position.y, e.mesh.position.z));
            });
            
            // Collecte clés
            keys.forEach((k, i) => {
                if(k && player.intersectsMesh(k, false)) {
                    k.dispose();
                    keys[i] = null;
                    keysCollected++;
                    
                    if(keysCollected >= 3) {
                        doorLight.diffuse = new BABYLON.Color3(0, 1, 0);
                    }
                }
            });
            
            // Porte
            if(keysCollected >= 3 && player.intersectsMesh(doorFrame, false)) {
                alert("YOU ESCAPED!");
                location.reload();
            }
        });
        
        return scene;
    };
    
    const scene = createScene();
    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
});