import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";

let scene, camera, renderer, canvas, controls, points;
function main() {

    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(10, 18, 19);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setClearColor(0xEEEEEE);
    
    canvas = renderer.domElement;

    document.body.appendChild(canvas);

    var geo = new THREE.BufferGeometry();
    var mat = new THREE.PointsMaterial({
        size: 1,
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors,
        transparent: true,
        opacity: 0.5
    });
    var p = [], color = [];
    for(let i=0; i<300; i++) {
        p.push(
            Math.random() * 30 - 30 / 2,
            Math.random() * 30 - 30 / 2,
            Math.random() * 30 - 30 / 2,
        );
        color.push( 
            Math.random() * 30 - 30 / 2,
            Math.random() * 30 - 30 / 2,
            Math.random() * 30 - 30 / 2
        );
    }
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(p), 3, true));
    geo.setAttribute("color", new THREE.BufferAttribute(new Uint8Array(color), 3, true));
    points = new THREE.Points(geo, mat);
    scene.add(points);



    controls = new OrbitControls(camera, canvas);

    scene.add(new THREE.AxesHelper(100));

    tick();

}

main();

function tick() {
    points.rotation.y += 0.01;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}