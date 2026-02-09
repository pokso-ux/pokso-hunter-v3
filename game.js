// POXSO HUNTER V3 - Minimal 3D Test

window.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('game-container');
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    
    const engine = new BABYLON.Engine(canvas, true);
    
    const createScene = function() {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.2, 0.3, 0.4);
        
        // Caméra
        const camera = new BABYLON.ArcRotateCamera("cam", 0, Math.PI/3, 20, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        
        // Lumière simple
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1.0;
        light.groundColor = new BABYLON.Color3(0.2, 0.2, 0.3);
        
        // Sol
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 40, height: 30}, scene);
        const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.2);
        ground.material = groundMat;
        
        // Joueur (sphère simple)
        const player = BABYLON.MeshBuilder.CreateSphere("player", {diameter: 2}, scene);
        player.position.y = 1;
        const playerMat = new BABYLON.StandardMaterial("playerMat", scene);
        playerMat.diffuseColor = new BABYLON.Color3(0, 0.8, 1);
        playerMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0.4);
        player.material = playerMat;
        
        // Cube test
        const box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);
        box.position = new BABYLON.Vector3(5, 1, 0);
        const boxMat = new BABYLON.StandardMaterial("boxMat", scene);
        boxMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
        box.material = boxMat;
        
        // Contrôles
        const inputMap = {};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
            inputMap[evt.sourceEvent.key.toLowerCase()] = evt.sourceEvent.key.toLowerCase();
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
            inputMap[evt.sourceEvent.key.toLowerCase()] = null;
        }));
        
        // Animation
        scene.registerBeforeRender(function() {
            if(inputMap["w"]) player.position.z += 0.1;
            if(inputMap["s"]) player.position.z -= 0.1;
            if(inputMap["a"]) player.position.x -= 0.1;
            if(inputMap["d"]) player.position.x += 0.1;
            
            player.rotation.y += 0.02;
            camera.target = player.position;
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