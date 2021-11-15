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

  const renderWith = 512;
  const renderHeight = 512;

function main() {
    const canvas = document.getElementById("c");
    const h = canvas.clientHeight;
    const w = canvas.clientWidth;
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(75, w / h, 1, 1000);
    camera.position.z = 5;

    const rtcamera = new THREE.PerspectiveCamera(75, w / h, 1, 1000);
    rtcamera.position.z = 2;

    const renderTarget = new THREE.WebGLRenderTarget(renderWith, renderHeight);

    const rtScene = new THREE.Scene();
    rtScene.background = new THREE.Color("red");
    const scene = new THREE.Scene();
    function makeInstance(geo, color, x) {
        const material = new THREE.MeshPhongMaterial({color});// #44aa88
        const cube = new THREE.Mesh(geo, material);
        cube.position.x = x;
        rtScene.add(cube);
        return cube;
    }

    {
         const color = 0xFFFFFF;
         const intensity = 1;
         const light = new THREE.DirectionalLight(color, intensity);
         light.position.set(-1, 2, 4);
         rtScene.add(light);
        //  scene.add(light);
    }

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
   
    const cubes = [
        makeInstance(boxGeometry, 0x44aa88,  0),
        makeInstance(boxGeometry, 0x8844aa, -2),
        makeInstance(boxGeometry, 0xaa8844,  2),
    ];

    

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    // {
        // create render buffer;

        const cubeMat = new THREE.MeshPhongMaterial({
            map: renderTarget.texture 
        });

       

    // }

    const cube = new THREE.Mesh(boxGeometry, cubeMat);

    scene.add(cube);

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

        renderer.setRenderTarget(renderTarget);
        renderer.render(rtScene, camera);
        renderer.setRenderTarget(null);

        cube.rotation.x = time * 0.001;
        cube.rotation.y = time * 0.001;
        renderer.render(scene, rtcamera);
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
}

main();



