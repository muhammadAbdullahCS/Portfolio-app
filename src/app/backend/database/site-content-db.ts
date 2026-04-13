import type { SiteContent } from '../../shared/interfaces';
import { BaseDB } from './base-db';

export class SiteContentDB extends BaseDB<SiteContent> {
  constructor() {
    super();
    this.data = [
      {
        id: 1,
        homeTitle: 'Abdullah',
        homeSubtitle: 'Full-stack architect · Angular · Three.js',
        homeTagline: 'Crafting immersive web experiences with precision and performance.',
        aboutTitle: 'About',
        aboutBio:
          'I design and build production-grade frontends with clean architecture, strong typing, and delightful motion. This portfolio runs entirely on an in-memory mock backend — swap in your API when you are ready.',
        skills: ['Angular', 'TypeScript', 'Three.js', 'RxJS', 'Clean Architecture', 'WebGL'],
      },
    ];
  }

  getSingleton(): SiteContent {
    return this.data[0];
  }

  updateSingleton(partial: Partial<SiteContent>): SiteContent {
    const current = this.getSingleton();
    return this.update(current.id, partial) ?? current;
  }
}
