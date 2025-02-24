import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokedexSearchBarComponent } from "../../components/pokedex-search-bar/pokedex-search-bar.component";
import { PokedexService } from '../../services/pokedex/pokedex.service';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';
import { firstValueFrom } from 'rxjs';
import { PokedexSearchCardComponent } from '../../components/pokedex-search-card/pokedex-search-card.component';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll/infinite-scroll.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokedex',
  imports: [
    PokedexSearchBarComponent,
    PokedexSearchCardComponent,
    InfiniteScrollDirective,
    MatProgressSpinnerModule,
],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent implements OnInit {
  paginatedAllPokemon?: PokeApi.AllPokemonResponse;
  allPokemon?: PokeApi.NamedAPIResource[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pokedexService: PokedexService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.paginatedAllPokemon = await firstValueFrom(this.pokedexService.getAllPokemonDataPaginated(0));
    this.allPokemon = this.paginatedAllPokemon.results;
  }

  async searchPokemon(searchKey: string | null): Promise<void> {
    if (searchKey) {
      this.router.navigate([`./${searchKey.toLocaleLowerCase()}`], { relativeTo: this.route });
    }
  }

  loadNext(event: any) {
    console.log('loadNext: ', event);
  }
}
