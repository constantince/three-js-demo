import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";

let scene, camera, renderer, canvas, controls, stats;
function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(5,5,5);

    renderer = new THREE.WebGLRenderer({antialis: true});
    renderer.setSize(w, h);
    renderer.setClearColor(0xEEEEEE);
    canvas = renderer.domElement;

    document.body.appendChild(canvas);

    controls = new OrbitControls(camera, canvas);

    scene.add(new THREE.AxesHelper(500));
    const envSize = 50;
    const envGeo = new THREE.BoxBufferGeometry(envSize, envSize, envSize);
    const envMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.BackSide
    });

    const env = new THREE.Mesh(envGeo, envMat);
    scene.add(env);

    const size = 3;
    const cubeGeo = new THREE.BoxBufferGeometry(size, size, size);
    const cubeMat = new THREE.MeshPhongMaterial();

    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    scene.add(cube);
    const loader = new THREE.TextureLoader();

    const diffuse = new THREE.SpotLight(0xfffff0);
    diffuse.position.set(5, 5, 5);
    scene.add(diffuse);

    scene.add(new THREE.SpotLightHelper(diffuse))

    const ambient = new THREE.AmbientLight(0xffffff);
    // scene.add(ambient);
    
    loader.load("../images/soil_diffuse.jpg", function(texture) {
        cube.material.map = texture;
        
    });

    loader.load("../images/soil_normal.jpg", function(texture) {
        cube.material.normalMap = texture;
        tick();
    });


    // tick();
    
}

main();

function tick() {

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}