import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonStatComponent } from '../pokemon-stat/pokemon-stat.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Pokedex } from '../../shared/interfaces/pokemon.interface';
import { EvolutionTreeComponent } from '../evolution-tree/evolution-tree.component';

@Component({
  selector: 'app-pokemon-card',
  imports: [
    MatCardModule,
    MatIconModule,
    PokemonStatComponent,
    EvolutionTreeComponent,
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent implements OnChanges {
  @Input() pokemon?: Pokedex.Pokemon;
  hasEvolutions?: boolean;
  pokemonImage?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon']) {
      const backUpImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemon?.id}.png`
      this.pokemonImage = this.pokemon?.sprites?.other['official-artwork'].front_default ?? backUpImage;
      this.hasEvolutions = ((this.pokemon?.evolutionTree as Pokedex.Pokemon)?.evolutionTree as Pokedex.Pokemon[])?.length > 0;
    }
  }
}
