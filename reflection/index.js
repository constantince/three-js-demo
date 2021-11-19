import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
let scene, camera, renderer, controls, sphereCamera;
function main() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 3);

    

    renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

   
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    // scene.add(new THREE.AxesHelper());

    const urls = [
        './images/UnionSquare/posx.jpg', './images/UnionSquare/negx.jpg',
        './images/UnionSquare/posy.jpg', './images/UnionSquare/negy.jpg', 
        './images/UnionSquare/posz.jpg', './images/UnionSquare/negz.jpg', 
    ];
    let loader = new THREE.CubeTextureLoader();
    scene.background = loader.load(urls, function() {
        window.requestAnimationFrame(tick);
    });


    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        miniFilter: THREE.LinearMipMapLinearFilter
    })

    sphereCamera = new THREE.CubeCamera(1, 10000, cubeRenderTarget);
    sphereCamera.position.set(0, 0, 0);
    scene.add( sphereCamera);

    let sphereMaterial = new THREE.MeshBasicMaterial({
        envMap: cubeRenderTarget.texture
    });
    let sphereGeo = new THREE.SphereGeometry(.5, 100, 100);
    let sphereMat = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphereMat.position.set(0, 0, 0);
    scene.add(sphereMat);
}

function tick() {
    renderer.render(scene, camera);
    sphereCamera.update(renderer, scene);
    window.requestIdleCallback(tick);
}

main();

window.onresize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight)
}