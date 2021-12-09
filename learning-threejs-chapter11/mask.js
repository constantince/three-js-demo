import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";
import { EffectComposer } from "../three/examples/jsm/postprocessing/EffectComposer.js";
import { ClearMaskPass, MaskPass } from "../three/examples/jsm/postprocessing/MaskPass.js";
import { RenderPass } from "../three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../three/examples/jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "../three/examples/jsm/shaders/CopyShader.js";
import { SepiaShader } from "../three/examples/jsm/shaders/SepiaShader.js";
import { ColorifyShader } from "../three/examples/jsm/shaders/ColorifyShader.js";
// import { s } from "../three/examples/jsm/postprocessing/C";
let sceneEarth, sceneMars, sceneBg, cameraBg, camera, controls, renderer, canvas, stats, composer, clock;
let earth, mars;
clock = new THREE.Clock();

function main() {
    const loader = new THREE.TextureLoader();
    const w = window.innerWidth, h = window.innerHeight;
    // scene for eacth
    sceneEarth = new THREE.Scene();
    sceneMars = new THREE.Scene();
    sceneBg = new THREE.Scene();

    cameraBg = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 1000);
    
    sceneBg.add(cameraBg);

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(-10, 15, 20);
    camera.lookAt(0 ,0 ,0);
    sceneMars.add(camera);
    sceneEarth.add(camera);


    const bgGeo = new THREE.PlaneBufferGeometry(1, 1);
    const bgMat = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        depthTest: false,
        map: loader.load("../images/starry-deep-outer-space-galaxy.jpg")
    });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    // sceneBg.add(new THREE.AxesHelper());
    bg.position.z = -100;
    bg.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
    sceneBg.add(bg);

    const earthGeo = new THREE.SphereBufferGeometry(4, 100, 100);
    const earthMat = new THREE.MeshPhongMaterial({
        map: loader.load("../images/planets/Earth.png"),
        normalMap: loader.load("../images/planets/EarthNormal.png")
    });
    earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.z = 10;

    const lightInEarth = new THREE.DirectionalLight(0xffffff, 1.2);
    lightInEarth.position.set(500, 500, 500);
    // sceneEarth.add(new THREE.AxesHelper(500));
    sceneEarth.add(lightInEarth);
    sceneEarth.add(earth);


    const marsGeo = new THREE.SphereBufferGeometry(3, 100, 100);
    const marsMat = new THREE.MeshPhongMaterial({
        map: loader.load("../images/planets/Mars_2k-050104.png")
    });

    const lightInMars = new THREE.DirectionalLight(0xcccccc, 1.2);
    lightInMars.position.set(500, 500, 500);
    sceneMars.add(lightInMars);

    mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.z = -10;
    sceneMars.add(mars);

    renderer = new THREE.WebGLRenderer({antialis: true});
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000);
    canvas = renderer.domElement;

    document.body.appendChild(canvas);



    const bgPass = new RenderPass(sceneBg, cameraBg);
    
    
    const renderPass = new RenderPass(sceneEarth, camera);
    renderPass.clear = false;

    const renderPass2 = new RenderPass(sceneMars, camera);
    renderPass2.clear = false;

    var effectCopy = new ShaderPass(CopyShader);
    effectCopy.renderToScreen = false;

    const cubeScene = new THREE.Scene();
    cubeScene.add(camera);

    const size = 3;
    const cubeGeo = new THREE.BoxBufferGeometry(size, size, size);
    const cubeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.x = 10;
    cube.position.z = -5;

    cubeScene.add(cube);

    const renderPass3 = new RenderPass(cubeScene, camera);
    renderPass3.clear = false;

    const marsMask = new MaskPass(sceneMars, camera);
    const clearMask = new ClearMaskPass();

    const earthMask = new MaskPass(sceneEarth, camera);

    const effectSepia = new ShaderPass(SepiaShader);
    effectSepia.uniforms['amount'].value = 0.8;

    const brighness = new ShaderPass(ColorifyShader);
    brighness.uniforms['color'].value.setRGB(0.5, 0.5, 1);

    const cubeMask = new MaskPass(cubeScene, camera);
    const myShader = new ShaderPass({
        uniforms: [

        ],
        vertexShader: `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            void main() {

                gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
            }
        `
    });


    composer = new EffectComposer(renderer);
    composer.renderTarget1.stencilBuffer = true;
    composer.renderTarget2.stencilBuffer = true;

    composer.addPass(bgPass);
    composer.addPass(renderPass);
    composer.addPass(renderPass2);
    composer.addPass(renderPass3);
    // composer.addPass(clearMask);
    composer.addPass(marsMask);
    composer.addPass(effectSepia);
    composer.addPass(clearMask);

    composer.addPass(earthMask);
    composer.addPass(brighness);
    composer.addPass(clearMask);

    composer.addPass(cubeMask);
    composer.addPass(myShader);
    composer.addPass(clearMask);

    composer.addPass(effectCopy);

    controls = new OrbitControls(camera, canvas);

    tick();

}

main();

function tick() {
    renderer.autoClear = false;
    mars.rotation.y += 0.002;
    earth.rotation.y += 0.002;
    const delta = clock.getDelta();
    composer.render(delta);
    window.requestAnimationFrame(tick);
}