import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonStatComponent } from '../pokemon-stat/pokemon-stat.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Pokedex } from '../../shared/interfaces/pokedex.interface';
import { TypeChipComponent } from "../../shared/components/type-chip/type-chip.component";

@Component({
  selector: 'app-pokemon-details-card',
  imports: [
    MatCardModule,
    MatIconModule,
    PokemonStatComponent,
    TypeChipComponent
],
  templateUrl: './pokemon-details-card.component.html',
  styleUrl: './pokemon-details-card.component.scss'
})
export class PokemonDetailsCardComponent implements OnChanges {
  @Input() pokemon?: Pokedex.Pokemon;
  hasEvolutions?: boolean;
  pokemonImage?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon']) {
      const backUpImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemon?.id}.png`
      this.pokemonImage = this.pokemon?.sprites?.other['official-artwork'].front_default ?? backUpImage;
      this.hasEvolutions = (this.pokemon?.evolutionTree?.branches as Pokedex.EvolutionBranch[])?.length > 0;
    }
  }
}
