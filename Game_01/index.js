import * as THREE from "../three/build/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
let scene, camera, renderer, canvas, player, cameras = [], cameraIndex = 0, floor, grid, clock;
let forward = 0, turn = 0;
const STEP = 0.5;
function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 1000);
    camera.position.set(10, 3, 10);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({antialias: true});
    canvas = renderer.domElement;
    renderer.setSize(w, h);
    document.body.appendChild( canvas );

    clock = new THREE.Clock();

    {
        const geometry = new THREE.PlaneBufferGeometry(100, 100);
        const material = new THREE.MeshBasicMaterial({color: 0xffffbb, side: THREE.DoubleSide});
        floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = Math.PI / -2;
        scene.add(floor);
    }

    {
        grid = new THREE.GridHelper(100, 100);
        scene.add(grid);
    }

    {
        const fogColor = new THREE.Color(0x605050);
        scene.background = fogColor;
        scene.fog = new THREE.FogExp2(fogColor, 0.02);
    }

    player = new THREE.Group();
    scene.add(player);

    {
       
        const playerClothes = new THREE.Color("#5DADE2");
        const bodyGeo = new THREE.CylinderBufferGeometry(0.6, 0.3, 1.5, 20, 30);
        const bodyMat = new THREE.MeshPhongMaterial({color: playerClothes});
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.scale.z = 0.75;
        body.position.y = .75;
        player.add(body);

        const headGeo = new THREE.SphereBufferGeometry(.35, 30, 30, 0, Math.PI * 2, 0, Math.PI / 2);
        const headMat = new THREE.MeshPhongMaterial({color: playerClothes});
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.7;
        player.add(head);

       
    }
    {
        const light = new THREE.DirectionalLight({color: 0xffffff});
        light.position.set(10, 10, 10);
        scene.add(light);
    }

    function movePlayer(code) {
       
        switch (code) {
            case 37:// left
                turn = 1;
                break;
            case 38: // up
                forward = 1;
                break;
            case 39: // right
                turn = -1;
                break;
            case 40: // down
                forward = -1;
                break;
        }
    }

    function movePlayer2(code) {
       
        switch (code) {
            case 37:// left
                turn = 0;
                break;
            case 38: // up
                forward = 0;
                break;
            case 39: // right
                turn = 0;
                break;
            case 40: // down
                forward = 0;
                break;
        }
    }

    

    function keyDown(e) {
        movePlayer(e.keyCode)
    }

    function keyUp(e) {
        movePlayer2(e.keyCode)
    }


    function addKeyboardControl() {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
    }

    const cameraFollow = new THREE.Object3D();
    cameraFollow.position.copy(camera.position);
    // player.add(cameraFollow)
    cameras.push(cameraFollow);

    const cameraOverhead = new THREE.Object3D();
    cameraOverhead.position.set(4, 20, -8);
    // player.add(cameraOverhead);
    cameras.push(cameraOverhead);

    new OrbitControls(camera, canvas);
    addKeyboardControl();
    scene.add( new THREE.AxesHelper(500) );
    tick();



}

function tick() {
   
    const pos = player.position.clone();
    const dt = clock.getDelta();
    if( forward === 1) {
        player.translateZ(forward * dt * 5);
        player.rotateY(turn * dt * 2);
    }






    camera.lookAt(pos);
    pos.y += 2;
    pos.z -= 5;
    pos.x += 0;
   
    if( cameraIndex === 0) {
        camera.position.lerp(pos, 0.05);
    } else {
        camera.position.lerp(cameras[cameraIndex].getWorldPosition(new THREE.Vector3()), 0.05);
    }
   
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

document.getElementById("camera-type-change").addEventListener("click", () => {
    cameraIndex = cameraIndex === 1 ? 0 : 1;
}, false);

main();