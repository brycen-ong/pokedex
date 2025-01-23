import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-default-layout',
  imports: [
    NavBarComponent,
    RouterOutlet,
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {

}
