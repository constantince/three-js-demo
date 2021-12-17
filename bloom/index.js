import * as THREE from "../three/build/three.module.js";
import { OrbitControls } from "../core/OrbitControls.js";
import { EffectComposer } from "../three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "../three/examples/jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "../three/examples/jsm/shaders/CopyShader.js";
import { GUI } from "../core/Dat.gui.js";
import { ClearMaskPass, MaskPass } from "../three/examples/jsm/postprocessing/MaskPass.js";
let scene, camera, renderer, canvas, controls, stats, bloomComposer, lamp, gui;
let scene2, light2, cubeM = null, finalComposer;

const darkMaterial = new THREE.MeshBasicMaterial( { color: "white" } );
stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

gui = new GUI();

class C {
    exposure  = 0.98;
    bloomThreshold = 0.04;
    bloomStrength = 5.72;
    bloomRadius = 0.29;
}

const params = new C();

class L {
    distance = 6;
    decay = .97;
}

class P {
    x = 10;
    y = 10;
    z = 10;
}

const BLOOM_LAYER = 1, OTHER_LAYER = 0;
const layer = new THREE.Layers();
layer.set( BLOOM_LAYER );
function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    scene.add(camera);
    scene2.add(camera)


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    // renderer.setClearColor(0xEEEEEE);
    canvas = renderer.domElement;

    document.body.appendChild(canvas);

    controls = new OrbitControls(camera, canvas);

    // scene.add(new THREE.AxesHelper(100));

    
    // // renderScene.renderToScreen = true;
    // const effectCopy = new ShaderPass(CopyShader);
    // effectCopy.renderToScreen = true;

    // composer = new EffectComposer(renderer);
    // composer.renderToScreen = true;
    // composer.addPass(renderScene);
    {
        const cubeGeo = new THREE.BoxBufferGeometry(1.5, 1.5, 1.5);
        const cubeMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.layers.enable( OTHER_LAYER );
        cube.position.x = 2;
        cube.position.y = 3;
        scene.add(cube);
    }

    {
        const lampGeo = new THREE.IcosahedronGeometry(1, 15);
        const lampMat = new THREE.MeshBasicMaterial({color: 0xaabbff});
        lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.layers.enable( BLOOM_LAYER );
        lamp.position.y = 0;
        lamp.position.x = 0;
        scene.add(lamp);
    }
    {
        const size = 20;
        const skyGeo = new THREE.PlaneBufferGeometry(size, size);
        const skyMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        sky.rotation.x = 90 * Math.PI / 180;        
        // scene.add(sky);
    }

    {
        const ballGeo = new THREE.SphereBufferGeometry(1);
        const ballMat = new THREE.MeshBasicMaterial(0xff0000);
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.z = -2;
        ball.position.y = 3;
        // scene.add(ball);
    }

    {
        light2 = new THREE.PointLight({
            color: 0xffffff,
            intensity: 1.2,
            distance: 7,
            decay: .97
        });
        light2.position.set(5, 5, 5);
        scene.add(light2);
        // scene2.add(new THREE.PointLightHelper(light2, 0.2, 0xfff000));
    }

   

    bloomComposer = new EffectComposer( renderer );
    // bloomComposer.renderTarget1.stencilBuffer = true;
    // bloomComposer.renderTarget2.stencilBuffer = true;
    const renderScene = new RenderPass(scene, camera);
    // renderPass.clear = true;
    // const renderPass2 = new RenderPass(scene2, camera);
    // renderPass2.clear = false;
    // const copyShader = new ShaderPass(CopyShader);
    // copyShader.renderToScreen = true;

    // const mask = new MaskPass(scene, camera);
    // const clearMask = new ClearMaskPass();

    // const mask2 = new MaskPass(scene2, camera);

    const bloomPass = new UnrealBloomPass( new THREE.Vector2(w, h), 5.72, 0.29, 0.04 );
    // bloomPass.renderToScreen = false;
    bloomComposer.addPass( renderScene );
    bloomComposer.addPass( bloomPass );
    // bloomComposer.addPass(clearMask);
    scene.add( new THREE.AmbientLight( 0xffffff ) );
    // bloomComposer.addPass( renderPass2 );
    // bloomComposer.addPass(mask2);
   
    // bloomComposer.addPass(clearMask);

    // bloomComposer.addPass(copyShader);

    const finalPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: `
            varying vec2 vUv;

			void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
            `,
            fragmentShader: `
            uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			}
            
            `,
            defines: {}
        } ), "baseTexture"
    );
    finalPass.needsSwap = true;

    finalComposer = new EffectComposer( renderer );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( finalPass );



    
    


    // {
    //     const light = new THREE.DirectionalLight(0xffffff);
    //     light.position.set(10, 10, 10);
    //     // scene.add(light);
    // }

    // const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 3.2, 0.14, 1);
    // renderer.toneMappingExposure = Math.pow( 2.0, 4.0 );

    // composer.addPass(bloom);

    // composer.addPass(effectCopy);

    // renderer.toneMapping = THREE.ReinhardToneMapping;

    gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

        renderer.toneMappingExposure = Math.pow( value, 4.0 );

    } );

    gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

        bloomPass.threshold = Number( value );

    } );

    gui.add( params, 'bloomStrength', 0.0, 10 ).onChange( function ( value ) {

        bloomPass.strength = Number( value );
        window.requestAnimationFrame(tick);

    } );

    gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

        bloomPass.radius = Number( value );
        window.requestAnimationFrame(tick);

    } );

    const lightControls = new L();
    gui.add(lightControls, "distance", 0.0, 100.0).step( 1 ).onChange(function(value) {
        light2.distance = Number(value);
        window.requestAnimationFrame(tick);
    });

    gui.add(lightControls, "decay", 0.0, 2.0).step( 0.01).onChange(function(value) {
        light2.decay = Number(value);
        window.requestAnimationFrame(tick);
    });

    const cameraPosition = new P();
    const cameraArea = gui.addFolder("cameraPosition");
    cameraArea.add(cameraPosition, "x", 1.0, 100.0).step( 1 ).onChange(function(value) {
        camera.position.x = Number(value);
        camera.updateProjectionMatrix();
        window.requestAnimationFrame(tick);
    });

    cameraArea.add(cameraPosition, "y", 1.0, 100.0).step( 1 ).onChange(function(value) {
        camera.position.y = Number(value);
        camera.updateProjectionMatrix();
        window.requestAnimationFrame(tick);
    });

    cameraArea.add(cameraPosition, "z", 1.0, 100.0).step( 1 ).onChange(function(value) {
        camera.position.z = Number(value);
        camera.updateProjectionMatrix();
        window.requestAnimationFrame(tick);
    });


    tick();
}

main();


function dotNotBloom(e) {
    if( e.isMesh && layer.test( e.layers ) === true ) {
        console.log(e.geometry.type);
       cubeM = e.material;
       e.material = darkMaterial;
    }
}

function reverseBloom(e) {
    if(  e.isMesh ) {
        console.log(e.material);
    }
    if( e.isMesh && layer.test( e.layers ) === true ) {
        console.log(e.geometry.type);
        e.material = cubeM;
     }
}

function tick(time) {
   
    stats.update();
    // console.log(camera.position);
    // camera.updateProjectionMatrix();
    // renderer.autoClear = false;
    // lamp.position.x = Math.sin(time * 0.0006) * 5;
    // light2.position.set(lamp.position.x, lamp.position.y, lamp.position.z);
    scene.traverse( dotNotBloom );
    bloomComposer.render();
    scene.traverse( reverseBloom );

    finalComposer.render();

    scene.traverse( reverseBloom );
    // scene.traverse(function(m) {
    //     if( m.isMesh&& m.geometry.type == "SphereGeometry" ){
    //         console.log(m);
    //     }
    // });
   


    // window.requestAnimationFrame(tick);
}


window.onresize = function() {

    
    const w = window.innerWidth, h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}