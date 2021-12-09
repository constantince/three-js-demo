import { ConvexGeometry } from "../core/ConvexGeometry.js";
import { OrbitControls } from "../core/OrbitControls.js";
import * as THREE from "../core/three.module.js";

let scene, camera, renderer, canvas, control, stats, allObjects;

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

    scene.add(new THREE.AxesHelper(500));

    const points = createPoints(40, 1);

    const BGeo = new ConvexGeometry(points);
    const BMat = new THREE.MeshPhongMaterial({
        color: 0xff00f0,
        transparent: true,
        opacity: 1.0
    });

    const B = new THREE.Mesh(BGeo, BMat);


    const light = new THREE.DirectionalLight({
        color: 0xff0f0f,
        intensity: 1.2
    });

    light.position.set(500, 500, 500);

    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const INSTANCECOUNT = 100;
    const instanceGeo = new THREE.InstancedBufferGeometry().copy(BGeo);
    instanceGeo.instanceCount = INSTANCECOUNT;

    let a_position = [], a_scale = [], a_color = [];
    for(let i=0; i<INSTANCECOUNT; i++) {
        a_position.push(
            Math.random() * 100 - 100 / 5,
            Math.random() * 100 - 100 / 5,
            Math.random() * 100 - 100 / 5
        );

        a_color.push( Math.random(),  Math.random(), Math.random());

    }

    instanceGeo.setAttribute("a_position", new THREE.InstancedBufferAttribute(
        new Float32Array(a_position),
        3,
        false 
    ));

    instanceGeo.setAttribute("a_color", new THREE.InstancedBufferAttribute(
        new Float32Array(a_color),
        3,
        false
    ));

    const frag = `
        varying vec3 v_color;
        void main() {
            gl_FragColor = vec4(v_color, 1.0);
        }
    `;

    const vertex = `
        attribute vec3 a_position;
        attribute vec3 a_color;
        varying vec3 v_color;

        void main() {
            vec3 transform = position.xyz;

            transform += a_position;

            v_color = a_color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(transform, 1.0);
        }
    `;

    const vertex1 = `           
        #define PHONG

        varying vec3 vViewPosition;
        attribute vec3 a_position;
        uniform float u_time;

        #include <common>
        #include <uv_pars_vertex>
        #include <uv2_pars_vertex>
        #include <displacementmap_pars_vertex>
        #include <envmap_pars_vertex>
        #include <color_pars_vertex>
        #include <fog_pars_vertex>
        #include <normal_pars_vertex>
        #include <morphtarget_pars_vertex>
        #include <skinning_pars_vertex>
        #include <shadowmap_pars_vertex>
        #include <logdepthbuf_pars_vertex>
        #include <clipping_planes_pars_vertex>

        void main() {

            #include <uv_vertex>
            #include <uv2_vertex>
            #include <color_vertex>

            #include <beginnormal_vertex>
            #include <morphnormal_vertex>
            #include <skinbase_vertex>
            #include <skinnormal_vertex>
            #include <defaultnormal_vertex>
            #include <normal_vertex>

            #include <begin_vertex>
            #include <morphtarget_vertex>
            #include <skinning_vertex>
            #include <displacementmap_vertex>
            #include <project_vertex>
            #include <logdepthbuf_vertex>
            #include <clipping_planes_vertex>

            vViewPosition = - mvPosition.xyz;

            gl_Position.x += a_position.x + sin(u_time * 0.002);
            gl_Position.y += a_position.y;
            gl_Position.z += a_position.z;

            #include <worldpos_vertex>
            #include <envmap_vertex>
            #include <shadowmap_vertex>
            #include <fog_vertex>

        }
    `;

    const instanceMat = new THREE.ShaderMaterial({
        fragmentShader: THREE.ShaderLib.phong.fragmentShader,
        vertexShader: vertex1,
        uniforms: THREE.UniformsUtils.merge( [
            THREE.ShaderLib.phong.uniforms,
            {u_time: THREE.Uniform[0]}
        ]),
        lights: true
    });

    allObjects = new THREE.Mesh(instanceGeo, instanceMat);

    scene.add(allObjects);






    // scene.add(B);



    tick();

}

main();

function tick(time) {
    stats.update();

    allObjects.material.uniforms.u_time.value = time;
    // allObjects.geometry.verticesNeedUpdate = true;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

window.onresize = function () {
    const w = innerWidth, h = innerHeight;

    camera.aspect = w/h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}