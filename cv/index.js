import * as THREE from "../three/build/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";

let scene, camera, renderer, canvas, control, group
function main() {
    const w = window.innerWidth, h = window.innerHeight;

    const cube = new THREE.CubeTextureLoader().setPath("../reflection/images/UnionSquare/").load([
        'posx.jpg',
        'negx.jpg',
        'posy.jpg',
        'negy.jpg',
        'posz.jpg',
        'negz.jpg'
    ]);

    scene = new THREE.Scene();
    scene.background = cube;

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(5, 5, 5);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({antialias: true});
    canvas = renderer.domElement;
    renderer.setSize(w, h);
    document.body.appendChild(canvas);

    group = new THREE.Group();

    const geometry1 = new THREE.SphereBufferGeometry(1, 30, 20, 0, 2 * Math.PI, 0,  Math.PI / 2);
    const material1 = new THREE.MeshBasicMaterial({envMap: cube});
    const sphere1 = new THREE.Mesh(geometry1, material1);
    sphere1.position.y = 2;
    group.add(sphere1);

    const geometry2 = new THREE.CylinderBufferGeometry(1,1, 4, 20, 50);
    const material2 = new THREE.MeshBasicMaterial({envMap: cube});
    const cylinder = new THREE.Mesh(geometry2, material2);
    group.add(cylinder);

    const sphere2 = sphere1.clone();
    sphere2.position.y = -2;
    sphere2.rotation.x = Math.PI;
    group.add(sphere2);

    // group.position.y = 2;
    group.scale.set(0.5, 0.5, 0.5);
    scene.add(group)

    control = new OrbitControls(camera, canvas);

    scene.add(new THREE.AxesHelper(500));

    tick();
}
main();
function tick() {
    group.rotation.z += 0.02;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

window.onresize = function () {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}