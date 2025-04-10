import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { PokedexService } from '../../services/pokedex/pokedex.service';
import { Pokedex } from '../../shared/interfaces/pokedex.interface';
import { MatIconModule } from '@angular/material/icon';
import { PokemonDetailsCardComponent } from '../../components/pokemon-details-card/pokemon-details-card.component';
import { PokemonMovesCardComponent } from "../../components/pokemon-moves-card/pokemon-moves-card.component";
import { PokemonEvolutionCardComponent } from "../../components/pokemon-evolution-card/pokemon-evolution-card.component";

@Component({
  selector: 'app-pokedex-entry',
  imports: [
    MatCardModule,
    MatIconModule,
    RouterModule,
    PokemonDetailsCardComponent,
    PokemonMovesCardComponent,
    PokemonEvolutionCardComponent
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
      this.pokemon = await firstValueFrom(this.pokedexService.getPokemonDataEntry(this.pokemonQuery as string));
    });
  }

  async ngOnDestroy(): Promise<void> {
    this.routerSub?.unsubscribe();
  }
}
