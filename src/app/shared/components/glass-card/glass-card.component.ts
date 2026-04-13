import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  standalone: false,
  templateUrl: './glass-card.component.html',
  styleUrl: './glass-card.component.scss',
})
export class GlassCardComponent {
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';

  get paddingClass(): string {
    return `pad-${this.padding}`;
  }
}
