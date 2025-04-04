import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Pokedex } from '../../shared/interfaces/pokedex.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-evolution-card',
  imports: [
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './pokemon-evolution-card.component.html',
  styleUrl: './pokemon-evolution-card.component.scss'
})
export class PokemonEvolutionCardComponent implements OnChanges {
  @Input() pokemon?: Pokedex.Pokemon;
  evolutionTree?: Pokedex.EvolutionTree;
  pokemonPrimaryType?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon']) {
      this.evolutionTree = this.pokemon?.evolutionTree;
      this.pokemonPrimaryType = this.pokemon?.types?.[0];
    }
  }

  getPokemonImage(pokemonId?: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
  }
}
