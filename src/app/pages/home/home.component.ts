import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from "../../shared/components/svg-icon/svg-icon.component";

@Component({
  selector: 'app-home',
  imports: [
    SvgIconComponent,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
