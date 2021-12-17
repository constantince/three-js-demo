
import * as THREE from "../three/build/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";

let scene, camera, renderer, canvas;
let plane, sphere;
function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(10, 10, 10);

    renderer = new THREE.WebGLRenderer({antialias: true});
    canvas = renderer.domElement;
    renderer.setSize(w, h);

    new OrbitControls(camera, canvas);
    scene.add( new THREE.AxesHelper(100) );

    document.body.appendChild(canvas);
    const size = 50;
    const PlaneGeo = new THREE.BoxBufferGeometry(size, size, size);
    const PlaneMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.BackSide,
        roughness: 0.1,
        metalness: 0.1
    });
    plane = new THREE.Mesh(PlaneGeo, PlaneMat);
    scene.add(plane);

    const SphereGeo = new THREE.SphereBufferGeometry(.5);
    const SphereMat = new THREE.MeshBasicMaterial({color: 0xff0000});
    sphere = new THREE.Mesh(SphereGeo, SphereMat);
    scene.add(sphere);

    {
        const pointLight = new THREE.PointLight({intensity: 1.8, color: 0xffffff})
        scene.add( pointLight );
    }

    tick();
}

main();

function tick(time) {

    sphere.position.z = Math.sin(time * 0.002) * 2.5;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}