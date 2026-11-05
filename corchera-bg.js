// Fittest4Fit · Corchera 3D de fondo (hero). Uso: importmap de three@0.160.0 + <div id="corcheraBg"></div> + <script type="module" src="corchera-bg.js">
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const host = document.getElementById('corcheraBg');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85;
renderer.setClearColor(0x000000, 0);
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new THREE.HemisphereLight(0xcfe9ff, 0x0d2540, 1.0));
const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(4, 8, 6); scene.add(key);
const rimL = new THREE.DirectionalLight(0x00c2ff, 1.6); rimL.position.set(-6, 2, -6); scene.add(rimL);

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
const rope = new THREE.Group(); scene.add(rope);
const up = new THREE.Vector3(0,1,0);

// Flotador tipo "Moscú" (eje = Y): aro exterior ancho + 4 aletas radiales + disco perforado + núcleo blanco
const RO = 0.5, RI = 0.45, HH = 0.11;
// Perfil del aro: sección rectangular con esquinas redondeadas y leve panza exterior (bordes suaves)
const rimProfile = (() => {
  const pts = [], r = 0.014, x0 = RI, x1 = RO, y0 = -HH, y1 = HH, seg = 8;
  const corner = (cx, cy, a0) => { for (let k = 0; k <= seg; k++) { const a = a0 + (k/seg)*Math.PI/2; pts.push(new THREE.Vector2(cx + Math.cos(a)*r, cy + Math.sin(a)*r)); } };
  corner(x0 + r, y0 + r, Math.PI);          // interior-abajo
  corner(x1 - r, y0 + r, -Math.PI/2);       // exterior-abajo
  for (let k = 1; k < 12; k++) { const y = y0 + r + (k/12)*(y1 - y0 - 2*r); pts.push(new THREE.Vector2(x1 + 0.012*Math.cos((y/(HH))*Math.PI/2), y)); }
  corner(x1 - r, y1 - r, 0);                // exterior-arriba
  corner(x0 + r, y1 - r, Math.PI/2);        // interior-arriba
  pts.push(pts[0].clone());
  return pts;
})();
const rimGeo = new THREE.LatheGeometry(rimProfile, 128);
const vanes = [0,1,2,3].map(k => {
  const g = new RoundedBoxGeometry(RI - 0.1, HH*1.5, 0.028, 3, 0.011);
  g.translate(0.1 + (RI-0.1)/2, 0, 0); g.rotateY(k*Math.PI/2); return g;
});
const nonIdx = g => g.index ? g.toNonIndexed() : g;
const bodyGeo = mergeGeometries([rimGeo, ...vanes].map(nonIdx));

// Disco perforado: geometría real con agujeros y bisel (sin alphaMap → bordes limpios)
const PT = 0.016;
const plateShape = new THREE.Shape(); plateShape.absarc(0, 0, RI - 0.004, 0, Math.PI*2, false);
const holePath = (r, a, rad) => { const h = new THREE.Path(); h.absarc(Math.cos(a)*r, Math.sin(a)*r, rad, 0, Math.PI*2, true); plateShape.holes.push(h); };
holePath(0, 0, 0.1);
for (let k = 0; k < 8; k++) holePath(0.25, k*Math.PI/4 + Math.PI/8, 0.042);
for (let k = 0; k < 12; k++) holePath(0.36, k*Math.PI/6 + Math.PI/12, 0.026);
const plateGeo = new THREE.ExtrudeGeometry(plateShape, { depth:PT, curveSegments:40, bevelEnabled:true, bevelThickness:0.005, bevelSize:0.004, bevelSegments:3 });
plateGeo.rotateX(-Math.PI/2); plateGeo.translate(0, HH*0.62 - PT/2, 0);

const plastic = new THREE.MeshPhysicalMaterial({ color:0xffffff, roughness:0.4, clearcoat:0.5, clearcoatRoughness:0.35, side:THREE.DoubleSide });
const plateMat = plastic;
const hubGeo = new THREE.CapsuleGeometry(0.11, 0.18, 10, 40);
const hubMat = new THREE.MeshPhysicalMaterial({ color:0xf4f7fb, roughness:0.3, clearcoat:0.7 });

// Cable (cuerda blanca)
const coreGeo = new THREE.CylinderGeometry(0.035, 0.035, 1, 20, 1, true);
const coreMat = new THREE.MeshStandardMaterial({ color:0xd9dee6, roughness:0.7 });

const N = 60; // flotadores casi juntos, como una corchera real
// Patrón de corchera real: tramos rojos en ambos extremos, bloques alternados en el centro
const isRed = i => { const s = i/(N-1); if (s < 0.12 || s > 0.88) return true; return Math.floor((i - Math.ceil(N*0.12))/3) % 2 === 1; };
const RED = new THREE.Color('#E4002B'), WHITE = new THREE.Color('#F4F7FB');
const bodyMesh = new THREE.InstancedMesh(bodyGeo, plastic, N);
const plateMesh = new THREE.InstancedMesh(plateGeo, plateMat, N);
const hubMesh = new THREE.InstancedMesh(hubGeo, hubMat, N);
const coreMesh = new THREE.InstancedMesh(coreGeo, coreMat, N - 1);
for (let i = 0; i < N; i++) { const c = isRed(i) ? RED : WHITE; bodyMesh.setColorAt(i, c); plateMesh.setColorAt(i, c); }
[bodyMesh, plateMesh, hubMesh, coreMesh].forEach(m => { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; rope.add(m); });


// Composición: fondo fijo de las secciones bajo la portada. La corchera cruza la pantalla en diagonal
// y su oleaje avanza con el scroll (cuanto más baja el lector, más "nada" la corchera).
const L = 22;
const P = Array.from({length:N}, () => new THREE.Vector3());
const tmp = new THREE.Vector3(), tan = new THREE.Vector3(), q = new THREE.Quaternion(), qSpin = new THREE.Quaternion(), M = new THREE.Matrix4(), S1 = new THREE.Vector3(1,1,1), SL = new THREE.Vector3();
// Curva densa + reparto por longitud de arco: los flotadores quedan equiespaciados sobre la cuerda
// aunque la ola la estire o la comprima (antes se repartían por x y se amontonaban en las crestas).
const K = 320, C = Array.from({length:K}, () => new THREE.Vector3()), CUM = new Float32Array(K);
function layout(t) {
  for (let k = 0; k < K; k++) {
    const x = (k/(K-1) - 0.5)*L;
    C[k].set(x, 0.42*Math.sin(x*0.55 - t*1.1) + 0.12*Math.sin(x*1.7 + t*0.8), 0.3*Math.sin(x*0.3 - t*0.5));
    CUM[k] = k ? CUM[k-1] + C[k].distanceTo(C[k-1]) : 0;
  }
  const total = CUM[K-1];
  let j = 0;
  for (let i = 0; i < N; i++) {
    const d = (i/(N-1))*total;
    while (j < K-2 && CUM[j+1] < d) j++;
    const f = (d - CUM[j])/Math.max(1e-6, CUM[j+1] - CUM[j]);
    P[i].lerpVectors(C[j], C[j+1], f);
    tan.subVectors(C[j+1], C[j]).normalize();
    q.setFromUnitVectors(up, tan); qSpin.setFromAxisAngle(up, i*0.9 + t*(0.35 + (i%3)*0.1)); q.multiply(qSpin);
    M.compose(P[i], q, S1); bodyMesh.setMatrixAt(i, M); plateMesh.setMatrixAt(i, M); hubMesh.setMatrixAt(i, M);
  }
  for (let i = 0; i < N-1; i++) {
    tmp.subVectors(P[i+1], P[i]); const len = tmp.length(); q.setFromUnitVectors(up, tmp.normalize());
    M.compose(tmp.addVectors(P[i], P[i+1]).multiplyScalar(0.5), q, SL.set(1, len, 1)); coreMesh.setMatrixAt(i, M);
  }
  bodyMesh.instanceMatrix.needsUpdate = plateMesh.instanceMatrix.needsUpdate = hubMesh.instanceMatrix.needsUpdate = coreMesh.instanceMatrix.needsUpdate = true;
}

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false); camera.aspect = w/h;
  const narrow = w/h < 0.9;
  camera.position.set(0, 0.8, narrow ? 20 : 15);
  rope.rotation.set(0.1, -0.45, narrow ? 0.95 : 0.32);
  rope.position.set(0, 0, 0);
  camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

// Solo se ve (y solo consume GPU) cuando la portada ya pasó
const stage = document.getElementById('scrollStage');
let on = false;
function checkOn() {
  const now = !stage || stage.getBoundingClientRect().bottom < innerHeight*0.5;
  if (now !== on) { on = now; host.classList.toggle('on', on); }
}
addEventListener('scroll', checkOn, { passive:true }); checkOn();

let mx = 0, my = 0;
addEventListener('pointermove', e => { mx = e.clientX/innerWidth - 0.5; my = e.clientY/innerHeight - 0.5; }, { passive:true });

let t = 0, last = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - last)/1000); last = now;
  if (on && !window.__corcheraPause) {
    if (!reduce) t += dt*0.8;
    const tt = t + (reduce ? 0 : scrollY*0.0025);
    scene.rotation.y += ((mx*0.1) - scene.rotation.y)*0.04;
    scene.rotation.x += ((my*0.05) - scene.rotation.x)*0.04;
    layout(tt); renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}
layout(0); renderer.render(scene, camera);
requestAnimationFrame(tick);
window.__corcheraReady = true;
