import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { GUI } from "../core/Dat.gui.js";
const w = window.innerWidth;
const h = window.innerHeight;
let scene, camera, renderer, canvas, controls, cube, sphere, stats, gui;

stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


gui = new GUI();

const c = new function() {
    this.rotationSpeed = 0.0009;
    this.bouncingSpeed = 0.0009;
}

gui.add(c, "rotationSpeed", 0, 0.005);
gui.add(c, "bouncingSpeed", 0, 0.005);

function main() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);

    camera.position.set(4, 8, 5);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMap.enabled = true;


    canvas = renderer.domElement;
    renderer.setSize(w, h);
    document.body.appendChild(canvas);

    controls = new OrbitControls(camera, canvas)

    {
        const planeGeo = new THREE.PlaneGeometry(5, 18, 1, 1);
        const planeMat = new THREE.MeshLambertMaterial({
            color: 0xcccccc,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.receiveShadow = true;
        plane.rotation.x = -90 *  Math.PI / 180;
        plane.position.y = -.5;
        scene.add(plane);
    }

    {
        const ambient = new THREE.AmbientLight({
            color: 0x404040,
            intensity: -1
        });
        // scene.add(ambient);

        const spot = new THREE.SpotLight({
            color: 0xffffff
        });
        spot.shadow.mapSize.width = 1024 * 4;
        spot.shadow.mapSize.height = 1024 * 4;
        spot.position.set(-5, 14, 8);
        spot.castShadow = true;
        scene.add(spot);
    }

    {
        const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
        const cubeMat = new THREE.MeshLambertMaterial({color: 0xff0000});
        cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.z = 4;
        scene.add(cube);
    }
    {
        const sphereGeo = new THREE.SphereGeometry(1, 100, 100);
        const sphereMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
        sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        sphere.position.z = -4;
        sphere.position.y = .5;
        scene.add(sphere);
    }

    scene.add(new THREE.AxesHelper(500));
    tick();
}
// console.log(Stats);
function tick(time) {
    stats.begin()
    cube.rotation.y = time * c.rotationSpeed;
    sphere.position.y = Math.abs(Math.sin(time * c.bouncingSpeed)) + 0.5;
    sphere.position.z = Math.cos(time * c.bouncingSpeed) - 4;
    renderer.render(scene, camera);
    stats.end();
    window.requestAnimationFrame(tick);
}

window.onresize = function() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}

main();