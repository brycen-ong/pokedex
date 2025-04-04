import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pokedex } from '../../shared/interfaces/pokedex.interface';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-evolution-tree',
  imports: [
    MatIconModule,
  ],
  templateUrl: './evolution-tree.component.html',
  styleUrl: './evolution-tree.component.scss'
})
export class EvolutionTreeComponent implements OnChanges {
  @Input() evolutionTree?: Pokedex.Pokemon;
  @Input() currentPokemon: Pokedex.Pokemon = {};
  pokemonImage?: string;
  pokemonName?: string;
  nextEvolutions?: Pokedex.Pokemon[];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes['evolutionTree']) {
    //   this.currentPokemon = (this.evolutionTree as Pokedex.Pokemon);
    //   this.pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${(this.evolutionTree as Pokedex.Pokemon)?.id}.png`;
    //   this.pokemonName = (this.evolutionTree as Pokedex.Pokemon)?.name as string;
    //   this.nextEvolutions = (this.evolutionTree as Pokedex.Pokemon)?.evolutionTree as Pokedex.Pokemon[];
    // }
  }

  goToEntry(pokemonName: string | undefined): void {
    if (pokemonName) {
      this.router.navigate([`../${pokemonName}`], { relativeTo: this.route, replaceUrl: true })
    }
  }
}
