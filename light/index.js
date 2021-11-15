import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}
function main() {
    const canvas = document.getElementById("c");
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const renderer = new THREE.WebGLRenderer({canvas});

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);

    const camera = new THREE.PerspectiveCamera(75, w / h, 1, 1000);
    camera.position.set(0 ,10, 20);

    const control = new OrbitControls(camera, canvas);
    control.target.set(0, 5, 0);
    control.update();



    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;

    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);


    {
        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
    }

    {
        const cubeSize = 4;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({color: "#8AC"});
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
        scene.add(mesh);
    }

    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHieghtDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHieghtDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: "#CA8"});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set( -sphereRadius - 1, sphereRadius + 2, 0);
        scene.add(mesh);
    }

    {
        // const color = 0xFFFFFF;
        // const intensity = 1;
        // const light = new THREE.AmbientLight(color, intensity);
        // scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(0, 10, 0);
        // light.target.position.set(-5, 0, 0);
        scene.add(light);
        // scene.add(light.target);

        const helper = new THREE.PointLightHelper(light);
        scene.add(helper);
    }
   


    function tick() {
        if( resizeRendererToDisplaySize(renderer)) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

}

main();

