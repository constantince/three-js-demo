import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";
import { RenderPass } from "../three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "../three/examples/jsm/postprocessing/EffectComposer.js";
import { FilmPass } from "../three/examples/jsm/postprocessing/FilmPass.js";
import { ShaderPass } from "../three/examples/jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "../three/examples/jsm/shaders/CopyShader.js";
import { TexturePass } from "../three/examples/jsm/postprocessing/TexturePass.js";
import { DotScreenPass } from "../three/examples/jsm/postprocessing/DotScreenPass.js";
let scene, camera, renderer, canvas, controls, stats, earth, clock, composer;

clock = new THREE.Clock();

function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(5,5,5);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);

    controls = new OrbitControls(camera, canvas);

    const light = new THREE.DirectionalLight(0xFFFFFF, 1.3);
    light.position.set(0, 0, 10);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xcccccc, .3);
    scene.add(ambient);


    const earthGeo = new THREE.SphereBufferGeometry(2, 50, 50);
    const earthMat = new THREE.MeshPhongMaterial();
    earth = new THREE.Mesh(earthGeo, earthMat);

    const loader = new THREE.TextureLoader();
    loader.load("../images/planets/Earth.png", function(texture) {
        earth.material.map = texture;
        tick();
    });

    const renderPass = new RenderPass(scene, camera);
    const effectCopy = new ShaderPass(CopyShader);
    effectCopy.renderToScreen = true;

    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectCopy);

    const renderScene = new TexturePass(composer.renderTarget2.texture);

    const effectFilm = new FilmPass(0.8, .32,256, false);
    effectFilm.renderToScreen = false;

    const effectDot = new DotScreenPass();
    effectDot.renderToScreen = true;
    composer.addPass(renderScene);
    composer.addPass(effectDot);
    // composer.addPass(effectCopy);

    
    

    scene.add(earth);

   // scene.add(new THREE.AxesHelper(80))

}

main();



function tick() {

    earth.rotation.y += 0.002;
    // renderer.render(scene, camera);
    composer.render(clock.getDelta());
    window.requestAnimationFrame(tick);
}

window.onresize = function() {

    const w = window.innerWidth, h = window.innerHeight;

    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}