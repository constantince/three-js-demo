import { ConvexGeometry } from "../core/ConvexGeometry.js";
import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";
import { RenderPass } from "../three/examples/jsm/postprocessing/RenderPass.js";
import { DotScreenPass } from "../three/examples/jsm/postprocessing/DotScreenPass.js";
import { EffectComposer } from "../three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "../three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ClearMaskPass, MaskPass } from "../three/examples/jsm/postprocessing/MaskPass.js";
import { ShaderPass } from "../three/examples/jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "../three/examples/jsm/shaders/CopyShader.js";
import { ColorifyShader } from "../three/examples/jsm/shaders/ColorifyShader.js";
let scene, camera, renderer, canvas, control, stats, allObjects, obj, effectComposer;

stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function createPoints(count, size) {
    const points = [];
    for(let i=0; i<count; i++) {
        points.push(new THREE.Vector3(
            Math.random() * size - size / 2,
            Math.random() * size - size / 2,
            Math.random() * size - size / 2
        ));
    }
    return points;
}

function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(5, 5, 5);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({antialias: true});
    canvas = renderer.domElement;
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000);
    document.body.append(canvas);

    control = new OrbitControls(camera, canvas);

    // scene.add(new THREE.AxesHelper(500));

    const points = createPoints(4, 1);

    const size = 1;
    const BGeo = new THREE.BoxBufferGeometry(size, size, size);
    const BMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color("#83a5b9"),
        transparent: true,
        opacity: 1.0,
        flatShading: true,
        reflectivity: 0.4,
        shininess: 80,
    });

    

   
    

    const MAXCOUNT = 1000;

    obj = new THREE.Object3D();
    scene.add(obj);

    for( let i=0; i<MAXCOUNT; i++) {
        const B = new THREE.Mesh(BGeo, BMat);
        B.position.set(Math.random() - 0.5, Math.random() - 0.5,Math.random() - 0.5 ).normalize();
        B.position.multiplyScalar(Math.random() * 500);
        B.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
        B.scale.x = B.scale.y = B.scale.z = Math.random();

        obj.add(B);
    }

    const lightDistance = 200;
    const sceneSun = new THREE.Scene();
    sceneSun.add(camera);
    const sunGeo = new THREE.SphereBufferGeometry(20);
    const sunMat = new THREE.MeshBasicMaterial({color: 0xff0000})
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(lightDistance, lightDistance, lightDistance);
    sceneSun.add(sun);

    const light = new THREE.DirectionalLight({
        color: 0xffffff,
    });

    light.position.set(lightDistance, lightDistance, lightDistance);
    scene.add(light);

    // const dotMask = 
    const randerPass = new RenderPass(scene, camera);
    // randerPass.clear = false;
    const renderPass2 = new RenderPass(sceneSun, camera);
    renderPass2.clear = false;

    const copyShder = new ShaderPass(CopyShader);
    copyShder.renderToScreen = true;

    // const bloom = new UnrealBloomPass(new THREE.Vector2( w, h ), 1.5, 0.4, 0.85);
    const bloom = new ShaderPass(ColorifyShader);
    bloom.renderToScreen = true;

    const maskBloom = new MaskPass(sceneSun, camera);
    const maskDot = new MaskPass(scene, camera);


    const clearMask = new ClearMaskPass();
    
    effectComposer = new EffectComposer(renderer);
    effectComposer.renderTarget1.stencilBuffer = true;
    effectComposer.renderTarget2.stencilBuffer = true;

    const dotEffect = new DotScreenPass();

    effectComposer.addPass(randerPass);
    effectComposer.addPass(renderPass2);

    effectComposer.addPass(maskBloom);
    effectComposer.addPass(bloom);
    effectComposer.addPass(clearMask);

    effectComposer.addPass(maskDot);
    effectComposer.addPass(dotEffect);
    effectComposer.addPass(clearMask);


    effectComposer.addPass(copyShder);

   



    tick();

}

main();

function tick(time) {
    renderer.autoClear = false;
    stats.update();
    obj.rotation.y += 0.005;
    obj.rotation.x += 0.01;
    // allObjects.material.uniforms.u_time.value = time;
    // allObjects.geometry.verticesNeedUpdate = true;
    effectComposer.render();
    window.requestAnimationFrame(tick);
}

window.onresize = function () {
    const w = innerWidth, h = innerHeight;

    camera.aspect = w/h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}