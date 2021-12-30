import * as THREE from "../three/build/three.module.js";
import { Curves } from "../three/examples/jsm/curves/CurveExtras.js";

let scene, camera, renderer, canvas, controls, tube;

const clock = new THREE.Clock();
function main() {
    const w = window.innerWidth, h = window.innerHeight;
    const texture = new THREE.CubeTextureLoader().setPath("../reflection/images/UnionSquare/").load([
        "posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"
    ])
    scene = new THREE.Scene();
    scene.background = texture;

    camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 1000);
    camera.position.set(20, 20, 20);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({antialias: true});
    canvas = renderer.domElement;
    document.body.appendChild(canvas);
    renderer.setSize(w, h);
    
    const curve = new Curves.GrannyKnot();
    const geometry = new THREE.TubeBufferGeometry(curve, 1000, 1, 20, true);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    tube = new THREE.Mesh(geometry, material);
    scene.add(tube);

    scene.add(new THREE.AxesHelper(100));


    tick();
}

function updateCamera() {
    const dt = clock.getElapsedTime();
    const loopTime = 200;
    const t1 = (dt % loopTime) / loopTime;
    const t2 = ((dt + 0.1) % loopTime) / loopTime;

    const pos1 = tube.geometry.parameters.path.getPointAt(t1);
    const pos2 = tube.geometry.parameters.path.getPointAt(t2);

    camera.position.copy(pos1);
    camera.lookAt(pos2);
}


function tick() {
    updateCamera();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

main();