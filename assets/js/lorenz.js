// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const container = document.getElementById("lorenz-container");
const camera = new THREE.PerspectiveCamera(
  75, 1, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

function resizeRenderer() {
  const width = Math.max(container.clientWidth, 1);
  const height = Math.max(container.clientHeight, 1);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

resizeRenderer();

// Lorenz attractor parameters and initial conditions
const sigma = 10, beta = 8/3, rho = 28;
let x = 0.1, y = 0, z = 0;
const dt = 0.005;
const scale = 0.055; // Scale factor to keep attractor in view

// Set up the geometry and material for the line
let points = [];
const maxPoints = 5000; // Maximum number of points to keep for performance
const geometry = new THREE.BufferGeometry();
const material = new THREE.LineBasicMaterial({
  color: 0xd97706,
  transparent: true,
  opacity: 0.78
});

// Create an initial point
points.push(new THREE.Vector3(x * scale, y * scale, z * scale));
geometry.setFromPoints(points);

// Create the line object and add it to the scene
const line = new THREE.Line(geometry, material);
scene.add(line);

// Position the camera so the attractor is visible
camera.position.z = 3.5;

// Function to update the Lorenz attractor by calculating a new point
function updateLorenz() {
  // Calculate derivatives using the Lorenz equations
  const dx = sigma * (y - x) * dt;
  const dy = (x * (rho - z) - y) * dt;
  const dz = (x * y - beta * z) * dt;
  // Update positions
  x += dx;
  y += dy;
  z += dz;
  
  // Create new point and add to the points array
  const newPoint = new THREE.Vector3(x * scale, y * scale, z * scale);
  points.push(newPoint);
  
  // Limit the number of points for performance
  if (points.length > maxPoints) {
    points.shift();
  }
  
  // Update the geometry with the new set of points
  geometry.setFromPoints(points);
}

// Animation loop: updates the Lorenz attractor and renders the scene
function animate() {
  requestAnimationFrame(animate);
  
  updateLorenz();
  
  // Optionally, add a slight rotation for a dynamic view
  scene.rotation.y += 0.002;
  
  renderer.render(scene, camera);
}
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let i = 0; i < 2500; i += 1) updateLorenz();
  renderer.render(scene, camera);
} else {
  animate();
}

// Keep the animation fitted to its card as the layout changes.
if ("ResizeObserver" in window) {
  new ResizeObserver(resizeRenderer).observe(container);
} else {
  window.addEventListener("resize", resizeRenderer);
}
