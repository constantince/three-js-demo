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


    const loader = new THREE.FontLoader();
    let _font, text;
    loader.load( '../fonts/helvetiker_regular.typeface.json', function ( font ) {
        _font = font;
        const geometry = new THREE.TextGeometry( 'Hello three.js!', {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        } );
        const textMat = new THREE.MeshBasicMaterial({color: 0xff0000});

        text = new THREE.Mesh(geometry, textMat);
        scene.add(text);
    } );

  

    const gui = new GUI();
   
    class C {
        size = 80;
        reDraw() {
            scene.remove(text);
            const geometry = new THREE.TextGeometry( 'Hello three.js!', {
                font: _font,
                size: this.size,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            } );
            const textMat = new THREE.MeshBasicMaterial({color: 0xff0000});
    
            text = new THREE.Mesh(geometry, textMat);
            scene.add(text);
        }
    }

    const c = new C();

    gui.add(c, "size", 0, 100).step(1).onChange(c.reDraw);
    
    
    controls = new OrbitControls(camera, canvas);

    scene.add(new THREE.AxesHelper(500))
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