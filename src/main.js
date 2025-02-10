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

// //what we did etokhon pre tasks to setup a scene

// const scene = new THREE.Scene();
// //scene er shathe camera o lagbe nahole shooting kemne korbo

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth, window.innerHeight,
//     0.1,
//     1000

// )

// //field of view sufficient range: 40-80
// //aspect ratio
// //near clipping planes
// //far clipping planes 
// // the less the difference between planes, the better the performance

// //  ei camera ar scene ke render korte hobe
// renderer.render(scene,camera);


// // helper use korbo to visualize 3D coordinate system, AxesHelper

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

camera.position.set(5, 2, 5);
orbitControls.update();

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(15, 50);
scene.add(gridHelper);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(geometry, material);
box.position.y = 2;
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(15, 15);
const planeMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
planeMesh.rotation.x = -0.5 * Math.PI;

const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.y = 3;
sphereMesh.position.x = 3;
scene.add(sphereMesh);



const gui = new GUI();

const options = {
  color: 0x0000ff,
};

gui.addColor(options, "color").onChange(function (e) {
  sphereMesh.material.color.set(e);
});

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// function animate(time) {
//     sphereMesh.rotation.y = time / 1000;
//     sphereMesh.rotation.x = time / 1000; // Rotate the sphere
//     renderer.render(scene, camera);
//   }
//   renderer.setAnimationLoop(animate);  
  
