import * as THREE from "../three/build/three.module.js";
import {OrbitControls} from "../core/OrbitControls.js";
let scene, camera, renderer, canvas, controls, stats, Particles;

function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1,  1000);
    camera.position.set(20, 20, 20);

    renderer = new THREE.WebGLRenderer({antialias: true});
    canvas = renderer.domElement;

    renderer.setSize(w, h);
    document.body.appendChild(canvas);

    new OrbitControls(camera, canvas);

    scene.add( new THREE.AxesHelper(100));
 
    const Geo = new THREE.BufferGeometry();

    const Mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: .1,
        transparent: true,
        opacity: 1.0
    });

    const range = 100;
    const p = [], col =10, row = 10;
    for( let i=0; i<range; i++) {
        const particle = new THREE.Vector3(
            (i % col),
            5,
            Math.floor( i / row )
        );

        p.push(particle);
    }
    Geo.setFromPoints(p);
    Particles = new THREE.Points(Geo, Mat);
    scene.add( Particles );


    window.requestAnimationFrame(time => {
        start = time;
        tick(time)
    });
}
main();
let start;
function tick(time) {
    const position = Particles.geometry.attributes.position.array;
    // console.log(Particles.geometry.attributes.position );
    for( let i=0; i<position.length; i +=3) {
        const key = Math.floor((i / 3) / 10)
        if ( time - start > key * 100 ) {
            position[ i + 1 ]  = Math.sin((time - (key * 100)) * 0.002);
        }
        
    }
    Particles.geometry.attributes.position.needsUpdate = true;
    // console.log(position);
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}