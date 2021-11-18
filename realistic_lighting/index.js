import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { GLTFLoader } from "../core/GLTFLoader.js";
let scene, camera, orbit, renderer, hemiLight,
light;
function main() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerWidth, 1, 1000);
    camera.position.set(0, 30, 30);


    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(new THREE.Color("#d9d9d9"))
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.toneMappingExposure = 2.3;

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.target.set(0, 0, 0);
    // orbit.update();

    hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
    scene.add(hemiLight);

    // light = new THREE.SpotLight(0xffa95c, 4);
    // light.castShadow = true;
    // scene.add( light );

    // light.shadow.bias = -0.0001;
    // light.shadow.mapSize.width = 1024 * 4;
    // light.shadow.mapSize.heigt = 1024 * 4;

    // scene.add(orbit);
    scene.add(new THREE.AxesHelper(1500));


    new GLTFLoader().load("./parrots_of_the_caribbean/scene.gltf", result => {
        let model = result.scene.children[0];
        model.position.set(0, -40, -0);
        // model.traverse(n => {
        //     if(n.isMesh) {
        //         n.castShadow = true;
        //         n.receiveShadow = true;
        //         if(n.material.map) n.material.map.anisotropy = 16;
        //     }
        // })
        scene.add(model);
        tick();
    });
   


}

function tick() {
    // light.position.set(
    //     camera.position.x + 10,
    //     camera.position.y + 10,
    //     camera.position.z + 10
    // );
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

main();

window.onresize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
}