import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { Pokedex } from '../../shared/interfaces/pokemon.interface';

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
  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.pokemonQuery = this.route.snapshot.paramMap.get('id');
    this.pokemon = await firstValueFrom(this.pokemonService.getPokemonData(this.pokemonQuery as string));
  }
}
