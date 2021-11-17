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


async function loadFile(url) {
    const data = await fetch(url).then(res => res.text());
    return data;
}

function parseData(text) {
    const data = [];
    const settings = {data};
    let max;
    let min;
    // split into lines
    text.split('\n').forEach((line) => {
      // split the line by whitespace
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) {
        // only 2 parts, must be a key/value pair
        settings[parts[0]] = parseFloat(parts[1]);
      } else if (parts.length > 2) {
        // more than 2 parts, must be data
        const values = parts.map((v) => {
          const value = parseFloat(v);
          if (value === settings.NODATA_value) {
            return undefined;
          }
          max = Math.max(max === undefined ? value : max, value);
          min = Math.min(min === undefined ? value : min, value);
          return value;
        });
        data.push(values);
      }
    });
    return Object.assign(settings, {min, max});
}



let renderRequested = false;

function main() {
    const canvas = document.querySelector("#c");
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(75, w / h, 1, 100);
    camera.position.z = 2;

    const scene = new THREE.Scene();
    
    const control = new OrbitControls(camera, canvas);
    control.enableDamping = true;
    control.addEventListener("change", function() {
        if( !renderRequested ) {
            renderRequested = true;
            window.requestAnimationFrame(tick);
        }
        
    });
       
    
    


    loadFile("https://threejsfundamentals.org/threejs/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc").then(res => {
        const d = parseData(res);
        console.log(d);
    });



    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load("../resources/world.jpg", tick);
        const sphere = new THREE.SphereGeometry(1, 64, 32);
        const sphereMat = new THREE.MeshBasicMaterial({map: texture});
        scene.add(new THREE.Mesh(sphere, sphereMat));
    }



    function tick() {
        renderRequested = undefined;
        if( resizeRendererToDisplaySize(renderer)) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        control.update();
        renderer.render(scene, camera);
    }

    window.requestAnimationFrame(tick);
}

main();



