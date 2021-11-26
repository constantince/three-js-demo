import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { GUI } from "../core/Dat.gui.js";

let scene, camera, renderer, controls, gui = new GUI(), stats = new Stats();

stats.showPanel(0);
document.body.appendChild(stats.dom);

class C {
    rotationSpeed = 0.0005;
    bouncingSpeed = 0.0005;
    boxSize = 1;
    addCube() {
        const size = Math.random() * this.boxSize;
        const cubeGeo = new THREE.BoxBufferGeometry(size, size, size);
        const cubeMat = new THREE.MeshPhongMaterial({
            color: 0xffffff * Math.random()
        })
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.x = Math.max(Math.min(Math.random() * 12, 6), -6) - 3;
        cube.position.y = Math.max(0.5, Math.round(Math.random()));
        cube.position.z = Math.max(Math.min(Math.random() * 20, 10), -10) - 5;
        cube.castShadow = true;
        scene.add(cube);
    }
}

var c = new C();

gui.add(c, "rotationSpeed", 0, 0.1);
gui.add(c, "bouncingSpeed", 0, 0.1);
gui.add(c, "boxSize", 0, 2);
gui.add(c, "addCube");
function main() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1.0, 1000);
    camera.position.set(5, 4, 4);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xD4D4D4);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AxesHelper(500));

    {
        const planeGeo = new THREE.PlaneGeometry(6, 12);
        const planeMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = 90 * Math.PI / 180;
        plane.receiveShadow = true;
        scene.add(plane);
    }

    {
        const light = new THREE.PointLight(0xffffff, 1.0);
        light.position.set(-8, 18, 7);
        light.shadow.mapSize.width = 1024 * 4;
        light.shadow.mapSize.height = 1024 * 4;
        light.castShadow = true;
        scene.add(light);
    }

    scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

    tick();
}

main();

function tick() {
    stats.begin();

    renderer.render(scene, camera);

    stats.end();
    window.requestAnimationFrame(tick);
}