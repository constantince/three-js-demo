import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";
import { mergeBufferGeometries } from "../core/BufferGeometryUtils.js";


let scene, camera, renderer, canvas, controls, stats, mesh, clock;

stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

const fragmet = `
    varying vec3 v_color;
    void main() {
        gl_FragColor = vec4(v_color, 1.0);
    }
`;

const vertex = `
    #define PI 3.1415926535


    attribute vec3 a_position;
    attribute float a_scale;
    attribute vec3 a_color;
    varying vec3 v_color;
    uniform float u_time;

    mat2 rotate2d( float a) {
        return mat2(
            cos(a), -sin(a),
            sin(a), cos(a)
        );
    }

    void main() {
        v_color = a_color;
        vec3 transformed = position.xyz;
        transformed *= a_scale;
        transformed.x += a_position.x;
        transformed.z += a_position.z;
        transformed.xz = rotate2d(u_time * 0.5) * transformed.xz;
        transformed.y += a_position.y;
       
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }

`;



function main() {
    const w = window.innerWidth, h = window.innerHeight;
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    
    camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.set(5, 5, 8);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({antialis: true});
    renderer.setSize(w, h);
    renderer.setClearColor(0xEEEEEE);
    canvas = renderer.domElement;

    controls = new OrbitControls(camera, canvas);

    scene.add(new THREE.AxesHelper(500));

    document.body.appendChild(canvas);

    const baseGeometry = new THREE.SphereBufferGeometry(1, 8, 8);

    const instancedGeometry = new THREE.InstancedBufferGeometry().copy(baseGeometry);
    const instanceCount = 10000;
    instancedGeometry.instanceCount = instanceCount;

    const material = new THREE.ShaderMaterial({
        fragmentShader: fragmet,
        vertexShader: vertex,
        uniforms: {
            u_time: new THREE.Uniform(0)
        }
    });

    let a_scale = [];
    let a_color = [];
    let a_position = [];
    const colors = [new THREE.Color("#ff3030"), new THREE.Color("#121214")];
    for(let i=0; i<instanceCount; i++) {
        // let c = colors[new THREE.Color(`${Math.random() * 0xFFFFFF}`)];
        a_color.push(Math.random(), Math.random(), Math.random());
        a_scale.push(Math.max(0.1, 1 - i * 0.001));
        a_position.push(
            Math.random() * 30 - 15,
            Math.random() * 30 - 15,
            Math.random() * 30 - 15
        )
    }

    instancedGeometry.setAttribute("a_scale", 
    new THREE.InstancedBufferAttribute(new Float32Array(a_scale), 1, false)
    );

    instancedGeometry.setAttribute("a_color",
    new THREE.InstancedBufferAttribute(new Float32Array(a_color), 3, false)
    );

    instancedGeometry.setAttribute("a_position",
    new THREE.InstancedBufferAttribute(new Float32Array(a_position), 3, false)
    );

    mesh = new THREE.Mesh(instancedGeometry, material);

   

    // color.start();

    scene.add(mesh);

    tick();

}

main();

function tick() {
    stats.update();
    mesh.material.uniforms.u_time.value = clock.getElapsedTime();
    // mesh.uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

window.onresize = function() {
    const w = window.innerWidth, h = window.innerHeight;

    camera.aspect = w/h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

}