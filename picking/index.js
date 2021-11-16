import * as THREE from "../core/three.module.js";

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
    const h = canvas.clientHeight;
    const w = canvas.clientWidth;
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(75, w / h, 1, 1000);
    camera.position.z = 5;

    const scene = new THREE.Scene();

    function makeInstance(geo, color, x) {
        const material = new THREE.MeshPhongMaterial({color});// #44aa88
        const cube = new THREE.Mesh(geo, material);
        cube.position.x = x;
        scene.add(cube);
        return cube;
    }

    const pickPosition = {x: 0, y: 0};
    clearPickPosition();

    function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width  / rect.width,
            y: (event.clientY - rect.top ) * canvas.height / rect.height,
        };
    }
    
    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    }
    
    function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }
    
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    {
         const color = 0xFFFFFF;
         const intensity = 1;
         const light = new THREE.DirectionalLight(color, intensity);
         light.position.set(-1, 2, 4);
         scene.add(light);
    }

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
   
    const cubes = [
        makeInstance(boxGeometry, 0x44aa88,  0),
        makeInstance(boxGeometry, 0x8844aa, -2),
        makeInstance(boxGeometry, 0xaa8844,  2),
    ]
    var tick = function(time) {
        let t = time * 0.001;
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        cubes.forEach((cube, idx) => {
            t *= 1  + idx * .1
            cube.rotation.x = t;
            cube.rotation.y = t;
        });
        renderer.render(scene, camera);

        pick.pick(pickPosition, camera, scene, time);

        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
}

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
    }

    pick(position, camera, scene, time) {


        this.raycaster.setFromCamera(position, camera);
        const intersectObjects = this.raycaster.intersectObjects(scene.children);
        if(intersectObjects.length > 0) {
            console.log(intersectObjects[0]);
        }

    }
}

const pick = new PickHelper();

main();





