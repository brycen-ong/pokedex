import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PokedexService } from '../../services/pokedex/pokedex.service';
import { Pokedex } from '../../shared/interfaces/pokemon.interface';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';
import { MatIconModule } from '@angular/material/icon';
import { EvolutionTreeComponent } from "../../components/evolution-tree/evolution-tree.component";

@Component({
  selector: 'app-pokedex-entry',
  imports: [
    MatCardModule,
    MatIconModule,
    RouterModule,
    EvolutionTreeComponent
],
  templateUrl: './pokedex-entry.component.html',
  styleUrl: './pokedex-entry.component.scss'
})
export class PokedexEntryComponent implements OnInit {
  pokemonQuery: string | null = '';
  pokemon: Pokedex.Pokemon = {};
  sprites: (string | undefined)[] = [];
  pokemonImage: string = '';
  pokemonStatWidths = {
    hp: 'calc((255 / 255) * 100%)',
    atk: 'calc((255 / 255) * 100%)',
    def: 'calc((255 / 255) * 100%)',
    spa: 'calc((255 / 255) * 100%)',
    spd: 'calc((255 / 255) * 100%)',
    spe: 'calc((255 / 255) * 100%)',
  }

  constructor(
    private route: ActivatedRoute,
    private pokedexService: PokedexService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.pokemonQuery = this.route.snapshot.paramMap.get('id');
    this.pokemon = await firstValueFrom(this.pokedexService.getPokemonData(this.pokemonQuery as string));
    this.sprites = Object.values(this.pokemon.sprites as PokeApi.PokemonSprites).filter((value) => typeof value === 'string');
    const backUpImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemon.id}.png`
    this.pokemonImage = this.pokemon.sprites?.other['official-artwork'].front_default ?? backUpImage;
    this.getPokemonStatWidths();
  }

  getPokemonStatWidths(): void {
    Object.keys(this.pokemonStatWidths).forEach((stat) => {
      this.pokemonStatWidths[stat as keyof typeof this.pokemonStatWidths] = this.getPokemonStatWidthCalc(
        this.pokemon.stats?.[stat as keyof typeof this.pokemonStatWidths]
      );
    });
  }

  getPokemonStatWidthCalc(value: number | undefined | null) : string {
    return `calc((${value} / 255) * 80%)`
  }
}
