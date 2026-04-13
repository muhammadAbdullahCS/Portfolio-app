import { Injectable } from '@angular/core';
import type { SiteContent } from '../../shared/interfaces';
import { normalizeSiteContent } from '../logic/content-rules';
import { SiteContentDB } from '../database/site-content-db';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly db = new SiteContentDB();

  getContent(): SiteContent {
    return this.db.getSingleton();
  }

  updateContent(partial: Partial<SiteContent>): SiteContent {
    const normalized = normalizeSiteContent(partial);
    return this.db.updateSingleton(normalized);
  }
}
