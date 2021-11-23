import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { FlakesTexture }  from "../core/FlakesTexture.js";
import { RGBELoader } from "../core/RGBELoader.js";
let scene, camera, renderer, controls, canvas;
function main() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 500);
    camera.position.set(0, 10, 10);

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled  = true;
    canvas = renderer.domElement;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);

    controls = new OrbitControls(camera, canvas);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableDamping = true;
    controls.enableZoom = true;

    scene.add(new THREE.AxesHelper(500));

    let envmaploader = new THREE.PMREMGenerator(renderer);

    new RGBELoader().setPath('./texture').load('/cayley_interior_4k.hdr', function(harmap) {
        let envmap = envmaploader.fromCubemap(harmap);
        {
            const BallMaterial = {
                clearcoat: 1.0,
                clearcoatRoughness :0.1,
                metalness: 0.9,
                roughness:0.2,
                color: 0x8418ca,
                // normalMap: texture,
                normalScale: new THREE.Vector2(0.15,0.15),
                envMap: envmap.texture
            }
            const sphereGeo = new THREE.SphereGeometry(.5, 100, 100);
            const sphereMaterial = new THREE.MeshPhysicalMaterial(BallMaterial);
            const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
            sphere.position.y = .5;
            sphere.castShadow = true;
            scene.add(sphere);
        }

        tick();
    });
    
    const texture = new THREE.CanvasTexture(new FlakesTexture());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    {
        const planeSize = 40;
        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
    
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);
    
    
        
        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
        

        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.receiveShadow = true;
        plane.rotation.x = 90 * Math.PI / 180;
        plane.position.set(0, -.5, 0);
        scene.add(plane);
    }


    

    {
        const pointLight = new THREE.PointLight(0xffffff, 1.0);
        pointLight.position.set(4, 4, 4);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024*4;
        pointLight.shadow.mapSize.height = 1024*4;
        scene.add(pointLight);
        scene.add(new THREE.PointLightHelper(pointLight));
        const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
        scene.add(cameraHelper);
    }

}

main();

function tick() {
    renderer.render(scene, camera);
    controls.update();
    window.requestAnimationFrame(tick);
}

window.onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,  window.innerHeight);
}