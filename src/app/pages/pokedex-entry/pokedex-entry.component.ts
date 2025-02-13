import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { PokedexService } from '../../services/pokedex/pokedex.service';
import { Pokedex } from '../../shared/interfaces/pokemon.interface';
import { MatIconModule } from '@angular/material/icon';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokedex-entry',
  imports: [
    MatCardModule,
    MatIconModule,
    RouterModule,
    PokemonCardComponent,
],
  templateUrl: './pokedex-entry.component.html',
  styleUrl: './pokedex-entry.component.scss'
})
export class PokedexEntryComponent implements OnInit, OnDestroy {
  pokemonQuery: string | null = '';
  pokemon: Pokedex.Pokemon = {};
  routerSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pokedexService: PokedexService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.routerSub = this.route.params.subscribe(async () => {
      this.pokemonQuery = this.route.snapshot.paramMap.get('id');
      this.pokemon = await firstValueFrom(this.pokedexService.getPokemonData(this.pokemonQuery as string));
    })
  }

  async ngOnDestroy(): Promise<void> {
    this.routerSub?.unsubscribe();
  }
}
