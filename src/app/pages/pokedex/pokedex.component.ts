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
  allPokemon?: PokeApi.NamedAPIResource[] = [];
  isLoading: boolean = false;
  offset: number = 0;
  limit: number = 360;
  atLimit: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pokedexService: PokedexService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getPokemonDataPaginated();
  }

  async searchPokemon(searchKey: string | null): Promise<void> {
    if (searchKey) {
      this.router.navigate([`./${searchKey.toLocaleLowerCase()}`], { relativeTo: this.route });
    }
  }

  async getPokemonDataPaginated(): Promise<void> {
    if (this.atLimit) return;
    if (this.offset + this.limit > 1025) {
      this.limit = 1025 - this.offset;
    }
    this.isLoading = true;
    const { results } = await firstValueFrom(this.pokedexService.getAllPokemonDataPaginated(this.offset, this.limit));
    this.allPokemon?.push(...results);
    this.offset += this.limit;
    if (this.offset >= 1025) {
      this.atLimit = true;
    }
    this.isLoading = false;
  }

  async loadNext(event: any) {
    if (event === 'end') {
      await this.getPokemonDataPaginated();
    }
  }
}
