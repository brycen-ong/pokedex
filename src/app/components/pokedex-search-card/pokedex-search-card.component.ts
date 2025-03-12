import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';
import { Pokedex } from '../../shared/interfaces/pokedex.interface';
import { PokedexService } from '../../services/pokedex/pokedex.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pokedex-search-card',
  imports: [
    MatCardModule,
  ],
  templateUrl: './pokedex-search-card.component.html',
  styleUrl: './pokedex-search-card.component.scss'
})
export class PokedexSearchCardComponent implements OnChanges {
  @Input() pokemonResource?: PokeApi.NamedAPIResource;
  pokemon?: Pokedex.Pokemon;
  pokemonImage?: string;
  pokemonPrimaryType?: string;
  isLoading: boolean = false;

  constructor(
    private pokedexService: PokedexService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['pokemonResource']) {
      this.isLoading = true;
      this.pokemon = await firstValueFrom(this.pokedexService.getPokemonData(this.pokemonResource?.name as string, this.pokemonResource?.url));
      this.pokemonImage = this.pokemon?.sprites?.front_default;
      this.pokemonPrimaryType = this.pokemon?.types?.[0];
      this.isLoading = false;
    }
  }

  extractId(url: string): number {
    return parseInt(url.replace('https://', '').split('/')[4]);
  }

  goToPokemon(): void {
    if(this.pokemon?.id === null) return;
    this.router.navigate([`${this.pokemon?.id}`], {
      relativeTo: this.route,
    });
  }
}
