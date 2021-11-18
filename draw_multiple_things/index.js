import * as THREE from "../core/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import * as BufferGeometryUtils from "../core/BufferGeometryUtils.js";
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

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load("../resources/world.jpg", tick);
        const sphere = new THREE.SphereGeometry(1, 64, 32);
        const sphereMat = new THREE.MeshBasicMaterial({map: texture});
        scene.add(new THREE.Mesh(sphere, sphereMat));
    }

    function addBoxes(file) {
        const {min, max, data} = file;
        const range = max - min;
       
        // make one box geometry
        // const boxWidth = 1;
        // const boxHeight = 1;
        // const boxDepth = 1;
        // const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        // make it so it scales away from the positive Z axis
        // geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));
       
        // these helpers will make it easy to position the boxes
        // We can rotate the lon helper on its Y axis to the longitude
        const lonHelper = new THREE.Object3D();
        scene.add(lonHelper);
        // We rotate the latHelper on its X axis to the latitude
        const latHelper = new THREE.Object3D();
        lonHelper.add(latHelper);
        // The position helper moves the object to the edge of the sphere
        const positionHelper = new THREE.Object3D();
        positionHelper.position.z = 1;
        latHelper.add(positionHelper);

        const originHelper = new THREE.Object3D();
        originHelper.position.z = 0.5;
        positionHelper.add(originHelper);
       
        const lonFudge = Math.PI * .5;
        const latFudge = Math.PI * -0.135;
        const geometries = [];
        const color = new THREE.Color();
        data.forEach((row, latNdx) => {
          row.forEach((value, lonNdx) => {
            if (value === undefined) {
              return;
            }
            const amount = (value - min) / range;
            // const material = new THREE.MeshBasicMaterial();
            // const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
            // const saturation = 1;
            // const lightness = THREE.MathUtils.lerp(0.1, 1.0, amount);
            // material.color.setHSL(hue, saturation, lightness);
            // const mesh = new THREE.Mesh(geometry, material);
            // scene.add(mesh);

            const boxWidth = 1;
            const boxHeight = 1;
            const boxDepth = 1;
            const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
       
            // adjust the helpers to point to the latitude and longitude
            lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
            latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;
       
            // use the world matrix of the position helper to
            // position this mesh.
            // positionHelper.updateWorldMatrix(true, false);
            // mesh.applyMatrix4(positionHelper.matrixWorld);
       
            // mesh.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));

            positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
            originHelper.updateWorldMatrix(true, false);
            geometry.applyMatrix4(originHelper.matrixWorld);

                // compute a color
            const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
            const saturation = 1;
            const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount);
            color.setHSL(hue, saturation, lightness);
            // get the colors as an array of values from 0 to 255
            const rgb = color.toArray().map(v => v * 255);
        
            // make an array to store colors for each vertex
            const numVerts = geometry.getAttribute('position').count;
            const itemSize = 3;  // r, g, b
            const colors = new Uint8Array(itemSize * numVerts);
        
            // copy the color into the colors array for each vertex
            colors.forEach((v, ndx) => {
            colors[ndx] = rgb[ndx % 3];
            });
        
            const normalized = true;
            const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
            geometry.setAttribute('color', colorAttrib);
       
            geometries.push(geometry);

          });
        });

        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
            geometries, false);
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true
        });
        const mesh = new THREE.Mesh(mergedGeometry, material);
        scene.add(mesh);
    }


    loadFile("https://threejsfundamentals.org/threejs/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc")
    .then(parseData)
    .then(addBoxes)
    .then(tick);


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



