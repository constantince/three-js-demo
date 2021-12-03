import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";
import { mergeBufferGeometries } from "../core/BufferGeometryUtils.js";


let scene, camera, renderer, canvas, controls, stats;

stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(5, 5, 8);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({antialis: true});
    renderer.setSize(w, h);
    renderer.setClearColor(0xEEEEEE);
    canvas = renderer.domElement;

    controls = new OrbitControls(camera, canvas);

    scene.add(new THREE.AxesHelper(500));

    document.body.appendChild(canvas);

    const size = 1;
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: false
    })
    var cubes = [];
    for(let i=0; i<30; i++) {
        const cube = addCube();
        cubes.push(cube);
       
    }
    const geo = mergeBufferGeometries(cubes);
    const world = new THREE.Mesh(geo, mat);

    scene.add(world);

    function addCube() {
        const cubeGeo = new THREE.BoxBufferGeometry(size, size, size);
        const cubeMat = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xFFFFFF,
            transparent: true,
            opacity: 0.5
        });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(
            Math.random() * 50 - 25,
            Math.random() * 50 - 25,
            Math.random() * 50 - 25
        );

        return cubeGeo;
    }


    tick();
}

main();

function tick() {
    stats.update()
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

window.onresize = function() {
    const w = window.innerWidth, h = window.innerHeight;

    camera.aspect = w/h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

}