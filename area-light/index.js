import * as THREE from "../three/build/three.module.js";;
import { OrbitControls } from "../core/OrbitControls.js";
import { RectAreaLightUniformsLib } from "../three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "../three/examples/jsm/helpers/RectAreaLightHelper.js";
import { GUI } from "../core/Dat.gui.js";
let scene, camera, renderer, canvas, controls, gui, stats;
let cube, sphere;
stats = new Stats();
stats.showPanel(0);

document.body.appendChild(stats.dom);

gui = new GUI();

const Floor = {
    roughness: 0.1,
    metalness: 0.1,
}

const floorMaterials = gui.addFolder("floor materials");



function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 100);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({antialias: true});
    canvas = renderer.domElement;
    document.body.appendChild(canvas);
    renderer.setSize(w, h); 
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.outputEncoding = THREE.sRGBEncoding;

    controls = new OrbitControls(camera, canvas);
    

    // scene.add(new THREE.AxesHelper(100));

    RectAreaLightUniformsLib.init();
    
    const geoFloor = new THREE.BoxGeometry( 20, 0.01, 20 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    scene.add( mshStdFloor );
    

    {
        // scene.add(new THREE.AmbientLight(0xffffff, 0.2))
    }

    {
        const blueLampGeo = new THREE.RectAreaLight(0x0000ff, 5, 1, 2.5);
        blueLampGeo.rotation.y = 180 * Math.PI / 180;
        blueLampGeo.position.y = 1.25;
        scene.add(blueLampGeo);
        scene.add( new RectAreaLightHelper(blueLampGeo))
    }

    {
        const redLampGeo = new THREE.RectAreaLight(0xff0000, 5, 1, 2.5);
        redLampGeo.rotation.y = 180 * Math.PI / 180;
        redLampGeo.position.y = 1.25;
        redLampGeo.position.x = 2;
        scene.add(redLampGeo);
        scene.add( new RectAreaLightHelper(redLampGeo))
    }

    {
        const greenLamp = new THREE.RectAreaLight(0x00ff00, 5, 1, 2.5);
        greenLamp.rotation.y = 180 * Math.PI / 180;
        greenLamp.position.y = 1.25;
        greenLamp.position.x = 4;
        scene.add(greenLamp);
        scene.add( new RectAreaLightHelper(greenLamp))
    }

    {
        const sphereGeo = new THREE.SphereBufferGeometry(1, 100);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0x808080,
            metalness: 0.1,
            roughness: 0.0
        });
        sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(2.5, 1, 4.5);
        scene.add(sphere);
        controls.target.copy(sphere.position);
    }
    {
        const cubeGeo = new THREE.BoxBufferGeometry(1, 1, 1);
        const cubeMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.0
        });
        cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(2.5, 0.5, 2);
        scene.add(cube);
    }

    floorMaterials.add(Floor, "roughness", 0, 1).step(0.01).onChange(function(value) {
        mshStdFloor.material.roughness = Number(value);
    });

    floorMaterials.add(Floor, "metalness", 0, 1).step(0.01).onChange(function(value) {
        mshStdFloor.material.metalness = Number(value);
    });

    tick();
}
main();

function tick() {
    stats.update();
    cube.rotation.y += 0.002;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}