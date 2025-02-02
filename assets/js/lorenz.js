// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("lorenz-container").appendChild(renderer.domElement);

// Lorenz attractor parameters and initial conditions
const sigma = 10, beta = 8/3, rho = 28;
let x = 0.1, y = 0, z = 0;
const dt = 0.005;
const scale = 0.02; // Scale factor to keep attractor in view

// Set up the geometry and material for the line
let points = [];
const maxPoints = 5000; // Maximum number of points to keep for performance
const geometry = new THREE.BufferGeometry();
const material = new THREE.LineBasicMaterial({ color: 0x00ffff });

// Create an initial point
points.push(new THREE.Vector3(x * scale, y * scale, z * scale));
geometry.setFromPoints(points);

// Create the line object and add it to the scene
const line = new THREE.Line(geometry, material);
scene.add(line);

// Position the camera so the attractor is visible
camera.position.z = 5;

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
animate();

// Handle window resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
