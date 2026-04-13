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
  selector: 'app-about-page',
  standalone: false,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly contentService = inject(ContentService);
  content = this.contentService.getContent();
  skills: string[] = [];

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frame = 0;
  private skillMeshes: THREE.Mesh[] = [];
  private mouse = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    this.content = this.contentService.getContent();
    this.skills = [...this.content.skills];
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
      if (obj instanceof THREE.LineSegments) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
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
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0a12, 8, 28);

    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
    this.camera.position.set(0, 1.6, 10);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);

    const amb = new THREE.AmbientLight(0xb4c6ff, 0.35);
    const spot = new THREE.SpotLight(0xffffff, 1.1, 40, Math.PI / 5, 0.35, 1);
    spot.position.set(4, 10, 6);
    this.scene.add(amb, spot);

    const palette = [0x6366f1, 0x22d3ee, 0xf472b6, 0xa78bfa, 0x34d399, 0xfbbf24];
    const n = Math.max(this.skills.length, 1);
    const spacing = 1.35;
    const startX = -((n - 1) * spacing) / 2;

    this.skills.forEach((skill, i) => {
      const hScale = 0.4 + (skill.length % 7) * 0.08;
      const geo = new THREE.BoxGeometry(0.55, hScale * 2.2, 0.55);
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        metalness: 0.35,
        roughness: 0.35,
        emissive: new THREE.Color(palette[i % palette.length]).multiplyScalar(0.15),
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(startX + i * spacing, hScale * 1.1 - 1.1, 0);
      mesh.userData['skill'] = skill;
      this.scene.add(mesh);
      this.skillMeshes.push(mesh);
    });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({
        color: 0x0f1020,
        metalness: 0.2,
        roughness: 0.85,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.15;
    this.scene.add(floor);

    const grid = new THREE.GridHelper(24, 24, 0x3b3f73, 0x1f2138);
    grid.position.y = -1.14;
    this.scene.add(grid);

    window.addEventListener('resize', this.onResize);
  }

  private animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouse.x * 1.2, 0.05);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 1.6 + this.mouse.y * 0.35, 0.05);
    this.camera.lookAt(0, 0.2, 0);

    this.skillMeshes.forEach((mesh, i) => {
      mesh.position.y += Math.sin(t * 1.2 + i) * 0.0015;
      mesh.rotation.y = t * 0.35 + i * 0.2;
    });

    this.renderer.render(this.scene, this.camera);
  };
}
