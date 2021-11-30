import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { ConvexGeometry } from "../core/ConvexGeometry.js";
import { createMultiMaterialObject } from "../core/SceneUtils.js"
import { LatheGeometry } from "../three/geometries/LatheGeometry.js";
import { GUI} from "../core/Dat.gui.js";
let scene, camera, renderer, canvas, controls, stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


function main() {
    scene = new THREE.Scene();
    const w = window.innerWidth, h = window.innerHeight;

    camera = new THREE.PerspectiveCamera(60, w/h, 1, 1000);
    // camera = new THREE.OrthographicCamera(w / -2, w /2, h/2, h/-2, 1, 100);
    scene.add(camera);
    camera.position.set(19, 19, 19);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setClearColor(0xEEEEEE);

    canvas = renderer.domElement;
    document.body.appendChild(canvas);

   
    const x = 0, y = 0;
    scene.add(new THREE.AxesHelper(500));
    controls = new OrbitControls(camera, canvas);

    const shape = new THREE.Shape();
    shape.moveTo(x + 5, x + 5);
    shape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );

    // const shapeGeo = new THREE.ShapeBufferGeometry( shape );
    // const shapeMat = new THREE.MeshBasicMaterial({
    //     color: 0x00ff00,
    //     side: THREE.DoubleSide
    // });
    // const sMesh = new THREE.Mesh(shapeGeo, shapeMat);
    // scene.add(circle);
    const settings = {
        steps: 2,
        depth: 106,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    };
    const exGeo = new THREE.ExtrudeGeometry(shape, settings);
    const exMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const ex = new THREE.Mesh(exGeo, exMat);

    scene.add( ex );

    tick();
}

function tick() {
    stats.begin();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
    stats.end();
}

window.onresize = function() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

main();