import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Pokedex } from '../../shared/interfaces/pokemon.interface';

@Component({
  selector: 'app-evolution-tree',
  imports: [],
  templateUrl: './evolution-tree.component.html',
  styleUrl: './evolution-tree.component.scss'
})
export class EvolutionTreeComponent implements OnChanges {
  @Input() evolutionTree: string | Pokedex.Pokemon | Pokedex.Pokemon[] | undefined;
  @Input() currentPokemon: Pokedex.Pokemon = {};
  pokemonImage?: string;
  pokemonName?: string;
  nextEvolutions?: Pokedex.Pokemon[];

  ngOnChanges(): void {
    this.currentPokemon = (this.evolutionTree as Pokedex.Pokemon);
    this.pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${(this.evolutionTree as Pokedex.Pokemon)?.id}.png`;
    this.pokemonName = (this.evolutionTree as Pokedex.Pokemon)?.name as string;
    this.nextEvolutions = (this.evolutionTree as Pokedex.Pokemon)?.evolutionTree as Pokedex.Pokemon[];
  }
}
