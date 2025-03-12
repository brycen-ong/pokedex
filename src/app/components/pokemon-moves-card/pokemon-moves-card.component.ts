import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pokemon-moves-card',
  imports: [
    MatCardModule,
  ],
  templateUrl: './pokemon-moves-card.component.html',
  styleUrl: './pokemon-moves-card.component.scss'
})
export class PokemonMovesCardComponent {

}
