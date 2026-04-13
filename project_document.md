# 🚀 Angular + Three.js Portfolio (Clean Architecture)

## 📌 Overview
A **production-ready portfolio web application** built using:

- Angular (latest)
- Three.js (interactive 3D UI)
- Clean Architecture (Frontend + simulated backend layers)

---

## 📁 Project Structure

```
src/
 ├── app/
 │   ├── backend/
 │   │   ├── services/
 │   │   ├── database/
 │   │   ├── logic/
 │   │
 │   ├── admin/
 │   │   ├── pages/
 │   │   ├── components/
 │   │   ├── auth/
 │   │
 │   ├── user/
 │   │   ├── pages/
 │   │   │   ├── home/
 │   │   │   ├── about/
 │   │   │   ├── contact/
 │   │   │   ├── projects/
 │   │   ├── components/
 │   │
 │   ├── shared/
 │   │   ├── models/
 │   │   ├── interfaces/
 │   │   ├── utils/
 │   │
 │   ├── core/
 │   │   ├── guards/
 │   │   ├── interceptors/
 │   │
 │   ├── app-routing.module.ts
 │   ├── app.module.ts
```

---

## 🧠 Clean Architecture Flow

```
Component → Service → Database
```

- **Database Layer** → Generic CRUD (in-memory)
- **Service Layer** → Business logic
- **Logic Layer** → Optional advanced rules

---

## 🗄️ Database Layer

```ts
export class BaseDB<T> {
  protected data: T[] = [];

  create(item: T) {
    this.data.push(item);
    return item;
  }

  getAll(): T[] {
    return [...this.data];
  }

  getById(id: number): T | undefined {
    return this.data.find((i: any) => i.id === id);
  }

  update(id: number, item: Partial<T>) {
    const index = this.data.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...item };
    }
  }

  delete(id: number) {
    this.data = this.data.filter((i: any) => i.id !== id);
  }
}
```

---

## 🧩 Project Database

```ts
export class ProjectDB extends BaseDB<Project> {
  constructor() {
    super();
    this.data = [
      {
        id: 1,
        title: '3D Portfolio',
        description: 'Three.js portfolio',
        image: ''
      }
    ];
  }
}
```

---

## ⚙️ Service Layer

```ts
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private db = new ProjectDB();

  getProjects() {
    return this.db.getAll();
  }

  addProject(project: any) {
    return this.db.create(project);
  }
}
```

---

## 🔐 Authentication

```ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(username: string, password: string): boolean {
    if (username === 'abdullahadmin' && password === 'abdullahadmin') {
      localStorage.setItem('admin', 'true');
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('admin') === 'true';
  }

  logout() {
    localStorage.removeItem('admin');
  }
}
```

---

## 🛡️ Route Guard

```ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/admin/login']);
      return false;
    }
    return true;
  }
}
```

---

## 🎮 Three.js Integration (Home Page)

```ts
ngOnInit() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const animate = () => {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animate();
}
```

---

## 👤 User Features

### Home
- 3D animated background
- Intro section
- Smooth scrolling

### About
- Skills visualization
- Interactive 3D elements

### Projects
- Dynamic list from DB

### Contact
- 3D form
- Name / Email / Message

---

## 🔐 Admin Panel

### Login
```
username: abdullahadmin
password: abdullahadmin
```

### Dashboard
- Update home content
- Manage projects
- Update about info

---

## 🎨 UI/UX

- Dark theme
- Glassmorphism
- Responsive design
- Smooth animations

---

## 📦 Models

```ts
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
}
```

---

## 🧭 Routing

```ts
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

---

## ⚡ Key Features

- Clean Architecture
- Three.js integration
- Admin authentication
- Mock database
- Lazy loading modules
- Scalable structure

---

## 🎯 Final Result

A **premium developer portfolio** with:

- Interactive 3D UI
- Smooth animations
- Admin dashboard
- Fully structured Angular architecture

---

## 🚀 Ready for Extension

You can easily extend with:

- Real backend (Node / .NET)
- Firebase
- Authentication APIs
- CMS integration

---

**End of Documentation** ✅