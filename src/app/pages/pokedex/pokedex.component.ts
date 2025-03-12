import { Component, OnInit } from '@angular/core';
import { PokedexSearchBarComponent } from "../../components/pokedex-search-bar/pokedex-search-bar.component";
import { PokedexService } from '../../services/pokedex/pokedex.service';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';
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
  allPokemon?: PokeApi.NamedAPIResource[] = [];
  paginatedPokemon?: PokeApi.NamedAPIResource[] = [];
  isLoading: boolean = false;
  atLimit: boolean = false;
  offset: number = 0;
  limit: number = 120;

  constructor(
    private pokedexService: PokedexService,
  ) {}

  ngOnInit(): void {
    this.getPokemonDataPaginated();
  }

  searchPokemon(searchKey: string | null): void {
    this.isLoading = true;
    if (searchKey) {
      this.allPokemon = this.pokedexService.searchPokemonData(searchKey as string);
      this.atLimit = true;
    } else {
      this.allPokemon = this.paginatedPokemon;
      this.checkAtLimit();
    }
    this.isLoading = false;
  }

  getPokemonDataPaginated(): void {
    if (this.atLimit) return;
    this.isLoading = true;
    if (this.offset + this.limit > 1025) {
      this.limit = 1025 - this.offset;
    }
    const results = this.pokedexService.getAllPokemonDataPaginated(this.offset, this.limit);
    this.paginatedPokemon?.push(...results);
    this.allPokemon = this.paginatedPokemon;
    this.offset += this.limit;
    this.checkAtLimit();
    this.isLoading = false;
  }

  loadNext(event: any): void {
    if (event === 'end') {
      this.getPokemonDataPaginated();
    }
  }

  private checkAtLimit(): void {
    this.offset >= 1025 ? this.atLimit = true : this.atLimit = false;
  }
}
