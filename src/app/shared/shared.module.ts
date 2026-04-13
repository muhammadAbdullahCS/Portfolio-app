import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCardComponent } from './components/glass-card/glass-card.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';

@NgModule({
  declarations: [GlassCardComponent, SectionHeaderComponent],
  imports: [CommonModule],
  exports: [GlassCardComponent, SectionHeaderComponent],
})
export class SharedModule {}
