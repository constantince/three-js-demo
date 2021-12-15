import * as THREE from "../three/build/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { StereoEffect } from "../three/examples/jsm/effects/StereoEffect.js";

let scene, camera, renderer, canvas, controls, effect;

function main() {
    const w = window.innerWidth, h = window.innerHeight;
    const cubeTexture = new THREE.CubeTextureLoader()
    .setPath("../reflection/images/UnionSquare/")
    .load([
        'posx.jpg', 'negx.jpg',
        'posy.jpg', 'negy.jpg',
        'posz.jpg', 'negz.jpg'
    ]);

    scene = new THREE.Scene();
    scene.background = cubeTexture;
    camera = new THREE.PerspectiveCamera(60, w/h, 1, 1000);
    camera.position.z = 30;
    camera.position.y = 30;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(w, h);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);

    controls = new OrbitControls(camera, canvas);

    {
        const planeGeo = new THREE.PlaneBufferGeometry(30, 30, 10, 10);
        const planeMat = new THREE.MeshBasicMaterial({
            color: 0xEEEEEE,
            side: THREE.BackSide
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = 90 * Math.PI / 180;
        // plane.material.wireframe = true;
        // scene.add(plane);
    }


    cubeTexture.mapping = THREE.CubeRefractionMapping;
    const sphereGeo = new THREE.SphereBufferGeometry(10);
    const sphereMat = new THREE.MeshBasicMaterial({
        envMap: cubeTexture,
        refractionRatio: 0.95
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 2;
    scene.add(sphere);

    effect = new StereoEffect( renderer )
    // scene.add(new THREE.AxesHelper(100))

    tick();
}

main();

function tick() {

    effect.render(scene, camera);
    window.requestAnimationFrame(tick);
}