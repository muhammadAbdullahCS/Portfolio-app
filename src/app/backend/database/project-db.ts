import type { Project } from '../../shared/interfaces';
import { BaseDB } from './base-db';

export class ProjectDB extends BaseDB<Project> {
  private nextId = 1;

  constructor() {
    super();
    this.data = [
      {
        id: this.nextId++,
        title: '3D Portfolio',
        description: 'Interactive Angular + Three.js portfolio with clean architecture.',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      },
      {
        id: this.nextId++,
        title: 'Realtime Dashboard',
        description: 'Glassmorphism analytics UI with mock data and smooth motion.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      },
      {
        id: this.nextId++,
        title: 'Spatial Audio Lab',
        description: 'WebAudio experiments with procedural visuals.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      },
    ];
  }

  insert(project: Omit<Project, 'id'>): Project {
    const id = this.nextId++;
    const full: Project = { id, ...project };
    return this.create(full);
  }
}
