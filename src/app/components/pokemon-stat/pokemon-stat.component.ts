import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pokemon-stat',
  imports: [],
  templateUrl: './pokemon-stat.component.html',
  styleUrl: './pokemon-stat.component.scss'
})
export class PokemonStatComponent implements OnChanges {
  @Input() pokemonStatValue?: number;
  @Input() pokemonStatType?: 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  get pokemonStatWidth(): string {
    return `calc((${this.pokemonStatValue ?? '255'}/255) * 100%)`;
  }
}
