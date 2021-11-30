import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { ConvexGeometry } from "../core/ConvexGeometry.js";
import { createMultiMaterialObject } from "../core/SceneUtils.js"
import { LatheGeometry } from "../three/geometries/LatheGeometry.js";
import { GUI} from "../core/Dat.gui.js";
let scene, camera, renderer, canvas, controls, stats = new Stats(), group, convexHull, group2;
let lathe;
stats.showPanel(0);
document.body.appendChild(stats.dom);

function createPoints() {
    let points = [];
    for(let i=0; i<20; i++) {
        points.push(
            new THREE.Vector3(
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10
            ) 
        )
    }
    return points;
}



function createPoints2(count = 30) {
    let points = [], height = 3;
    for( let i=0; i<count; i++) {
        points.push(new THREE.Vector2(
            (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12,
            (i - count) + count /2
        ))
    }
    return points;
}


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

   

    scene.add(new THREE.AxesHelper(500));

    const points = createPoints();

    group = new THREE.Object3D();
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xFF0000
    });
    for(let i=0; i<points.length; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.1);
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.copy(points[i]);
        group.add(sphere);
    }
    const points2 = createPoints2();
    group2 = new THREE.Object3D();
    for(let i=0; i<points2.length; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.1);
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.copy(new THREE.Vector3(points2[i].x, points2[i].y, 0 ));
        group2.add(sphere);
    }

    scene.add(group2);
    // scene.add(group);

    const ConvexHullGeo = new ConvexGeometry(points);

    const solidMesh = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });

    const wireFrameMesh = new THREE.MeshBasicMaterial();
    wireFrameMesh.wireframe = true;

    convexHull = new createMultiMaterialObject(
        ConvexHullGeo, [solidMesh, wireFrameMesh]
    );

    function createLatheGeo(segments, phiStart, phiLength) {
        const latheGeo = new LatheGeometry(points2, c.segments, c.phiStart, c.phiLength);
        lathe = new createMultiMaterialObject(
            latheGeo, [solidMesh, wireFrameMesh]
        );
        scene.add(lathe);
    }

    const gui = new GUI();
    const PI = Math.PI;
    class C {
        segments = 12;
        phiStart = PI;
        phiLength = PI;
        redraw() {
            scene.remove(lathe);
            createLatheGeo(this.segments, this.phiStart, this.phiLength);
        }
    }
    const c = new C();
    
    gui.add(c, "segments", 1, 50).step(1).onChange(c.redraw);
    gui.add(c, "phiStart", 0, 2 * PI).onChange(c.redraw);
    gui.add(c, "phiLength", 0, 2 * PI).onChange(c.redraw);

    // scene.add(convexHull);

    controls = new OrbitControls(camera, canvas);

    tick();
}

function tick() {
    stats.begin();
    // console.log(c.segments)
    // group.rotation.y += 0.005;
    // convexHull.rotation.y += 0.005
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
    stats.end();
    // console.log(camera.position)
}

window.onresize = function() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

main();