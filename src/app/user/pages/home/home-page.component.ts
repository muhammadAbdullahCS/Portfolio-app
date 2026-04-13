import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { ContentService } from '../../../backend/services/content.service';
import { disposeMesh, disposeRenderer } from '../../../shared/utils/three-dispose';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly contentService = inject(ContentService);
  content = this.contentService.getContent();

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frame = 0;
  private mouse = { x: 0, y: 0 };
  private targetCam = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    this.content = this.contentService.getContent();
    this.initThree();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.onResize);
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        disposeMesh(obj);
      }
      if (obj instanceof THREE.Points) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      }
    });
    disposeRenderer(this.renderer);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  private readonly onResize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) {
      return;
    }
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070714, 0.035);

    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 120);
    this.camera.position.set(0, 0.6, 8);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);

    const ambient = new THREE.AmbientLight(0x8899ff, 0.45);
    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(4, 8, 6);
    this.scene.add(ambient, dir);

    const point = new THREE.PointLight(0x6366f1, 1.2, 40);
    point.position.set(-2, 2, 4);
    this.scene.add(point);

    const count = 4200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 14 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x9ca8ff,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(geo, pMat);
    this.scene.add(particles);

    const mat1 = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.6,
      roughness: 0.25,
      emissive: new THREE.Color(0x1d1b4d),
      emissiveIntensity: 0.35,
    });
    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(0.85, 0.28, 180, 16), mat1);
    torus.position.set(-2.2, 0.2, -1);
    this.scene.add(torus);

    const mat2 = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.45,
      roughness: 0.3,
      emissive: new THREE.Color(0x4a0d2a),
      emissiveIntensity: 0.25,
    });
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), mat2);
    ico.position.set(2.4, -0.3, -1.2);
    this.scene.add(ico);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.02, 16, 200),
      new THREE.MeshBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.35 }),
    );
    ring.rotation.x = Math.PI / 2.3;
    this.scene.add(ring);

    window.addEventListener('resize', this.onResize);
  }

  private animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    this.targetCam.x += (this.mouse.x * 1.6 - this.targetCam.x) * 0.04;
    this.targetCam.y += (this.mouse.y * 0.9 - this.targetCam.y) * 0.04;
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.targetCam.x, 0.08);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 0.6 + this.targetCam.y * 0.5, 0.08);

    this.camera.position.z = 7.8 + Math.sin(t * 0.35) * 0.22;
    this.camera.lookAt(0, 0, 0);

    this.scene.children.forEach((child) => {
      if (child instanceof THREE.Points) {
        child.rotation.y = t * 0.035;
      }
    });

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.TorusKnotGeometry) {
        obj.rotation.x = t * 0.35;
        obj.rotation.y = t * 0.45;
      }
      if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.IcosahedronGeometry) {
        obj.rotation.x = Math.sin(t * 0.8) * 0.35;
        obj.rotation.y = t * 0.55;
      }
      if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.TorusGeometry) {
        obj.rotation.z = t * 0.12;
      }
    });

    this.renderer.render(this.scene, this.camera);
  };
}
