import { Injectable } from '@angular/core';
import type { Project } from '../../shared/interfaces';
import { ProjectDB } from '../database/project-db';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly db = new ProjectDB();

  getProjects(): Project[] {
    return this.db.getAll();
  }

  getById(id: number): Project | undefined {
    return this.db.getById(id);
  }

  addProject(project: Omit<Project, 'id'>): Project {
    return this.db.insert(project);
  }

  updateProject(id: number, partial: Partial<Project>): Project | undefined {
    return this.db.update(id, partial);
  }

  deleteProject(id: number): boolean {
    return this.db.delete(id);
  }
}
