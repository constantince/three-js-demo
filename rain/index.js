import * as THREE from "../core/three.module.js";

let scene, camera, ambient, directionalLight, renderer, cloudGeo, cloudMaterial
,cloudParticles = [], flash, rainGeo, rainMaterial, rain, rainCount = 15000, frameCount = 0;
function main() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    ambient = new THREE.AmbientLight(0x55555);
    scene.add(ambient);

    directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    flash = new THREE.PointLight(0x062d89, 30, 500, 0);
    flash.position.set(200, 300, 100);
    scene.add(flash);

    rainGeo = new THREE.BufferGeometry();
    const vertices = [];
    for(let i=0; i<rainCount; i++) {
        let rainDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );
        vertices.push(rainDrop);
        
    }
    rainGeo.setFromPoints(vertices);
    rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true
    });

    rain = new THREE.Points(rainGeo, rainMaterial);
    scene.add(rain);

    renderer = new THREE.WebGLRenderer();
    scene.fog = new THREE.FogExp2(0x1c1c2a, 0.002);
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);


    let loader = new THREE.TextureLoader();
    loader.load("./smoke.png", function(texture) {
        cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });

        
        for(let p =0; p<25; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                500,
                Math.random()*500 - 450
            )
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 360;
            cloud.material.opacity = 0.6;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }


        animate();
    });

    
}

function animate(time) {
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.002;
    });
    const positions = rainGeo.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        // p.velocity -= 0.1 + Math.random * 0.1;
        positions[i + 1] -= 0.1 + Math.random() * 0.1;

        if( positions[i + 1] < -200) {
            positions[i + 1] = 200;
        }
    }
    rainGeo.attributes.position.needsUpdate = true;
    rain.rotation.y += 0.002;
    if(Math.random() > 0.93 || flash.power > 100) {
        if(flash.power < 100) 
          flash.position.set(
            Math.random()*400,
            300 + Math.random() *200,
            100
          );
        flash.power = 50 + Math.random() * 500;
      }
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

main();


window.onresize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
}




