import * as THREE from 'three';

export function disposeMesh(mesh: THREE.Mesh): void {
  mesh.geometry.dispose();
  const m = mesh.material;
  if (Array.isArray(m)) {
    m.forEach((mat) => mat.dispose());
  } else {
    m.dispose();
  }
}

export function disposeRenderer(renderer: THREE.WebGLRenderer): void {
  renderer.dispose();
  renderer.forceContextLoss();
}
