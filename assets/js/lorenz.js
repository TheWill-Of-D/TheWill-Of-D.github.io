const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("lorenz-container").appendChild(renderer.domElement);

const sigma = 10, beta = 8/3, rho = 28;
let x = 0.1, y = 0, z = 0;
const dt = 0.01;
const points = [];
const material = new THREE.LineBasicMaterial({ color: 0x00ffff });
const geometry = new THREE.BufferGeometry();

const lorenzAttractor = () => {
    for (let i = 0; i < 1000; i++) {
        let dx = sigma * (y - x) * dt;
        let dy = (x * (rho - z) - y) * dt;
        let dz = (x * y - beta * z) * dt;
        x += dx;
        y += dy;
        z += dz;
        points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5));
    }
    geometry.setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
};

lorenzAttractor();
camera.position.z = 5;

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
