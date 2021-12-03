import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";

let scene, renderer, camera, controls, canvas, clouds;
function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(0, 5, 4);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setClearColor(0xEEEEEE);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);

    controls = new OrbitControls(camera, canvas);

    scene.add(new THREE.AxesHelper());

    const texture = new THREE.TextureLoader();
    texture.load("./web_monitor.png", function(tex) {
        const Geo = new THREE.BufferGeometry();
        const Mat = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            map: tex,
            opacity: .7
            // blending: THREE.AdditiveBlending
        });

        const points = [];
        for( let i=0; i<300; i++) {
            points.push(
                Math.random() * 20 - 20 / 2,
                Math.random() * 20 - 20 / 2,
                Math.random() * 20 - 20 / 2
            )
        }

        Geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points), 3, true));

        clouds = new THREE.Points(Geo, Mat);

        scene.add(clouds);

        tick();

        })

    
        // Mesh.sortParticles = true;

       


   
}

main();

function tick() {
    clouds.rotation.y += 0.002;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

window.onresize = function() {
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}