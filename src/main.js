// import * as THREE from 'three'

// // first kaj hocche scene setup kora, ekhon scene setup korte hoile amader age "renderer" instantiate korte hobe
// //nahole scene amader browser e load hobe na

// const renderer = new THREE.WebGLRenderer;
// //ekhon amader renderer er window height ar width set korte hobe
// renderer.setSize(window.innerWidth, window.innerHeight)
// //eta basically amra ekta canvas create korlam, but ekhon question hocche eta ke to DOM e pathaite hobe

// document.body.appendChild(renderer.domElement) // using this code we are setting the canvas in the browser
// //ete ki labh? amader full page cover korbe
// //but ekta jhamela scrolling er option chole ashbe, jeta amra chai na
// //amra index.html e giye style er under body r bhitor e margin:0 kore dibo

//GLSL -> Graphics Library Shading Language
//GL Transmission Format)

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "lil-gui";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(2, 2, 5);
orbitControls.update();

const gridHelper = new THREE.GridHelper(15, 50);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // this 1 indicates light intensity
scene.add(ambientLight);

// Apply directional light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2); // Adjusted intensity
scene.add(directionalLight);
directionalLight.position.set(-5, 8, 0);

// Directional light helper to visualize light direction
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 7);
scene.add(dLightHelper);

const dLightShadowHelper = 
new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

// scene.background = new THREE.Color(0x5500AF); // Same color as the fog
renderer.setClearColor(0x550); //  another way to declare background color

scene.fog = new THREE.FogExp2(0x5500AF, 0.09);
//With this method, the density of the fog increases exponentially as the distance from the camera grows.



// Fix: Plane and sphere objects should be added after they are declared
const planeGeometry = new THREE.PlaneGeometry(15, 15);
const planeMaterial = new THREE.MeshStandardMaterial({
  // meshBasic material doesn't need any lighting
  side: THREE.DoubleSide,
  color: 0xff1111,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
planeMesh.rotation.x = -0.5 * Math.PI;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const box = new THREE.Mesh(geometry, material);
box.position.y = 2;
scene.add(box);


// Load Brazuca texture
const textureLoader = new THREE.TextureLoader();
const brazucaTexture = textureLoader.load('brazuca.jpg');

brazucaTexture.wrapS = THREE.RepeatWrapping;
brazucaTexture.wrapT = THREE.RepeatWrapping;
brazucaTexture.repeat.set(1, 1); // Adjust repetition if needed


const sphereGeometry = new THREE.SphereGeometry(0.5, 100, 100); // the first value zooms the object, the next values increase the no of segments
const sphereMaterial = new THREE.MeshPhysicalMaterial({
//   color: 0x0000ff,
     map: brazucaTexture,
     roughness: 0.8, // Adjust surface roughness
     metalness: 0.1, // Makes it look more realistic
     shininess: 100, // Adjust for a glossy look
     emissive: 0x111111,


});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.y = 4;
sphereMesh.position.x = 4;

scene.add(sphereMesh);

const gui = new GUI();

const options = {
  color: 0x0000ff,
  wireframe: false, // this property lets us see the skeleton of the sphere
  speed: 0.01,
  lightSwitch: true, // Light is on by default
};

// GUI for changing the color of sphere and box
gui.addColor(options, "color").onChange(function (e) {
  sphereMesh.material.color.set(e);
  box.material.color.set(e);
});

// GUI for toggling wireframe mode
gui.add(options, "wireframe").onChange(function (e) {
  sphereMesh.material.wireframe = e;
});

// GUI for adjusting speed of sphere movement
gui.add(options, "speed", 0, 0.1);

// GUI for toggling ambient light on/off
gui.add(options, "lightSwitch").name("Toggle Light").onChange(function (e) {
  ambientLight.visible = e; // Enable/disable light
});

let step = 0;

function animate(time) {
  // Rotating the box
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;
  const minBoxY = 0.75
  box.position.y =minBoxY + 3 * Math.abs(Math.sin(step));


  // Bouncing sphere animation
  const minY = 0.75; // The minimum height where the ball touches the plane (same as sphere radius)
  step += options.speed;
  sphereMesh.position.y = minY + 3 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);

  // This will create a loop that causes the renderer to draw the scene
  // every time the screen is refreshed (typically 60 times per second).
}

renderer.setAnimationLoop(animate);

// function animate(time) {
//     sphereMesh.rotation.y = time / 1000;
//     sphereMesh.rotation.x = time / 1000; // Rotate the sphere
//     renderer.render(scene, camera);
//   }
//   renderer.setAnimationLoop(animate);  
  
renderer.shadowMap.enabled = true;
planeMesh.receiveShadow = true;
sphereMesh.castShadow = true;
box.castShadow = true
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 7; // allows us to see the shadow on the planeMesh
