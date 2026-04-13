import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import type { Project } from '../../../shared/interfaces';
import { ProjectService } from '../../../backend/services/project.service';
import { disposeMesh, disposeRenderer } from '../../../shared/utils/three-dispose';

@Component({
  selector: 'app-projects-page',
  standalone: false,
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  projects: Project[] = [];

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frame = 0;
  private mouse = { x: 0, y: 0 };
  private plane!: THREE.Mesh;

  constructor(private readonly projectService: ProjectService) {}

  ngAfterViewInit(): void {
    this.projects = this.projectService.getProjects();
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
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070714, 0.028);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 80);
    this.camera.position.set(0, 0.4, 7);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);

    const amb = new THREE.AmbientLight(0x8899ff, 0.4);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(-3, 6, 4);
    this.scene.add(amb, dir);

    const geo = new THREE.PlaneGeometry(14, 8, 48, 32);
    const pos = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 1.2 + y * 0.8) * 0.22;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.55,
      roughness: 0.25,
      wireframe: true,
      emissive: new THREE.Color(0x312e81),
      emissiveIntensity: 0.25,
    });
    this.plane = new THREE.Mesh(geo, mat);
    this.plane.rotation.x = -Math.PI / 2.4;
    this.plane.position.y = -1.6;
    this.scene.add(this.plane);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 1600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 20 + 4;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 6;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xb4c6ff,
        size: 0.04,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.scene.add(stars);

    window.addEventListener('resize', this.onResize);
  }

  private animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouse.x * 1.4, 0.06);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 0.4 + this.mouse.y * 0.4, 0.06);
    this.camera.lookAt(0, -0.2, 0);

    if (this.plane) {
      this.plane.rotation.z = t * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  };
}
