import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { Pokedex } from '../../shared/interfaces/pokemon.interface';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';

@Component({
  selector: 'app-pokedex-pokemon',
  imports: [
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './pokedex-pokemon.component.html',
  styleUrl: './pokedex-pokemon.component.scss'
})
export class PokedexPokemonComponent implements OnInit {
  pokemonQuery: string | null = '';
  pokemon: Pokedex.Pokemon = {};
  sprites: (string | undefined)[] = [];
  pokemonImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.pokemonQuery = this.route.snapshot.paramMap.get('id');
    this.pokemon = await firstValueFrom(this.pokemonService.getPokemonData(this.pokemonQuery as string));
    this.sprites = Object.values(this.pokemon.sprites as PokeApi.PokemonSprites).filter((value) => typeof value === 'string');
    const backUpImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemon.id}.png`
    this.pokemonImage = this.pokemon.sprites?.other['official-artwork'].front_default ?? backUpImage;
  }
}
