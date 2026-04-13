import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import type { ContactMessage, Project } from '../../../shared/interfaces';
import { AuthService } from '../../auth/auth.service';
import { ContactMessageService } from '../../../backend/services/contact-message.service';
import { ContentService } from '../../../backend/services/content.service';
import { ProjectService } from '../../../backend/services/project.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly projectsApi = inject(ProjectService);
  private readonly contentApi = inject(ContentService);
  private readonly inbox = inject(ContactMessageService);

  projects: Project[] = [];
  messages: ContactMessage[] = [];

  readonly contentForm = this.fb.nonNullable.group({
    homeTitle: ['', Validators.required],
    homeSubtitle: ['', Validators.required],
    homeTagline: ['', Validators.required],
    aboutTitle: ['', Validators.required],
    aboutBio: ['', Validators.required],
    skillsText: [''],
  });

  readonly projectForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    image: [''],
  });

  editing: Project | null = null;

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.projects = this.projectsApi.getProjects();
    this.messages = this.inbox.getAll().slice().reverse();
    const c = this.contentApi.getContent();
    this.contentForm.patchValue({
      homeTitle: c.homeTitle,
      homeSubtitle: c.homeSubtitle,
      homeTagline: c.homeTagline,
      aboutTitle: c.aboutTitle,
      aboutBio: c.aboutBio,
      skillsText: c.skills.join(', '),
    });
  }

  saveContent(): void {
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      return;
    }
    const v = this.contentForm.getRawValue();
    const skills = v.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    this.contentApi.updateContent({
      homeTitle: v.homeTitle,
      homeSubtitle: v.homeSubtitle,
      homeTagline: v.homeTagline,
      aboutTitle: v.aboutTitle,
      aboutBio: v.aboutBio,
      skills,
    });
    this.reload();
  }

  addProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    const v = this.projectForm.getRawValue();
    this.projectsApi.addProject({
      title: v.title,
      description: v.description,
      image: v.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    });
    this.projectForm.reset();
    this.reload();
  }

  startEdit(p: Project): void {
    this.editing = { ...p };
  }

  cancelEdit(): void {
    this.editing = null;
  }

  saveEdit(): void {
    if (!this.editing) {
      return;
    }
    this.projectsApi.updateProject(this.editing.id, {
      title: this.editing.title,
      description: this.editing.description,
      image: this.editing.image,
    });
    this.editing = null;
    this.reload();
  }

  deleteProject(id: number): void {
    this.projectsApi.deleteProject(id);
    if (this.editing?.id === id) {
      this.editing = null;
    }
    this.reload();
  }

  deleteMessage(id: number): void {
    this.inbox.delete(id);
    this.reload();
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/admin/login']);
  }
}
