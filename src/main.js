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

const ambientLight = new THREE.AmbientLight(0xffffff, 10); // this 1 indicates light intensity
scene.add(ambientLight);

// Apply directional light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 100); // Adjusted intensity
scene.add(directionalLight);
directionalLight.position.set(-5, 8, 0);

// Directional light helper to visualize light direction
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 7);
scene.add(dLightHelper);

const dLightShadowHelper = 
new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);


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

const sphereGeometry = new THREE.SphereGeometry(0.75, 50, 50); // the first value zooms the object, the next values increase the no of segments
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
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
