import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as THREE from 'three';
import { ContactMessageService } from '../../../backend/services/contact-message.service';
import { disposeMesh, disposeRenderer } from '../../../shared/utils/three-dispose';

@Component({
  selector: 'app-contact-page',
  standalone: false,
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(ContactMessageService);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  sent = false;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frame = 0;
  private group!: THREE.Group;
  private mouse = { x: 0, y: 0 };

  ngAfterViewInit(): void {
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
    this.scene.fog = new THREE.FogExp2(0x050510, 0.045);

    this.camera = new THREE.PerspectiveCamera(52, w / h, 0.1, 60);
    this.camera.position.set(0, 0.2, 6.2);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);

    const amb = new THREE.AmbientLight(0xaabbff, 0.35);
    const pt = new THREE.PointLight(0x6366f1, 1.1, 30);
    pt.position.set(2, 3, 4);
    this.scene.add(amb, pt);

    this.group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 2),
      new THREE.MeshStandardMaterial({
        color: 0x312e81,
        metalness: 0.4,
        roughness: 0.35,
        wireframe: true,
        emissive: new THREE.Color(0x6366f1),
        emissiveIntensity: 0.35,
      }),
    );
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
    );
    this.group.add(core, shell);
    this.scene.add(this.group);

    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf0abfc,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(pGeo, pMat);
    this.scene.add(dust);

    window.addEventListener('resize', this.onResize);
  }

  private animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouse.x * 1.1, 0.06);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.mouse.y * 0.55, 0.06);
    this.camera.lookAt(0, 0, 0);

    if (this.group) {
      this.group.rotation.x = t * 0.25;
      this.group.rotation.y = t * 0.35;
    }

    this.renderer.render(this.scene, this.camera);
  };

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.messages.submit(v.name, v.email, v.message);
    this.sent = true;
    this.form.reset();
  }
}
