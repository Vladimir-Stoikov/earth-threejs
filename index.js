import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from '../src/getStarfield.js';

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.005;
const detail = 24;

// Sphere part -----------

// const geo = new THREE.IcosahedronGeometry(1.0, 3);
// const mat = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   flatShading: true,
// });
// const mesh = new THREE.Mesh(geo, mat);
// scene.add(mesh);

// const wireMat = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   wireframe: true,
// });

// const wireMesh = new THREE.Mesh(geo, wireMat);
// wireMesh.scale.setScalar(1.001);
// mesh.add(wireMesh);

// const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
// scene.add(hemiLight);

// function animate(t = 0) {
//   requestAnimationFrame(animate);
//   mesh.rotation.y = t * 0.0001;
//   renderer.render(scene, camera);
//   controls.update();
// }

// animate();

// Earth Part --------

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshStandardMaterial({
  map: loader.load('./assets/textures/earthmap1k.jpg'),
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load('./assets/textures/03_earthlights1k.jpg'),
  blending: THREE.AdditiveBlending,
});

const lightsMesh = new THREE.Mesh(geometry, lightsMat);

earthGroup.add(lightsMesh);

const stars = getStarfield(2000);
scene.add(stars);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
// scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate(t = 0) {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.001;
  lightsMesh.rotation.y += 0.001;
  renderer.render(scene, camera);
  controls.update();
}

animate();
