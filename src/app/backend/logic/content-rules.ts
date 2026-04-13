import type { SiteContent } from '../../shared/interfaces';

/**
 * Optional logic layer — validation / normalization for site content updates.
 */
export function normalizeSiteContent(partial: Partial<SiteContent>): Partial<SiteContent> {
  const out: Partial<SiteContent> = { ...partial };
  if (out.skills) {
    out.skills = out.skills.map((s) => s.trim()).filter(Boolean);
  }
  if (out.homeTitle) {
    out.homeTitle = out.homeTitle.trim().slice(0, 120);
  }
  if (out.homeSubtitle) {
    out.homeSubtitle = out.homeSubtitle.trim().slice(0, 200);
  }
  if (out.aboutBio) {
    out.aboutBio = out.aboutBio.trim().slice(0, 4000);
  }
  return out;
}
