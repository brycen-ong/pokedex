import { Component, Input } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  imports: [
    MatIconModule,
  ],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss'
})
export class SvgIconComponent {
  @Input() icon = '';
  @Input() size: 's' | 'm' | 'l' | 'xl' | 'home' = 'm';
  @Input() color: 'white' | 'black' | 'primary' = 'white';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      'pokeball',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg/pokeball.svg')
    );
  }

}
