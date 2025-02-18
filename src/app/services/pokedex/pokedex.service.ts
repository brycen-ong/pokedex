import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';
import { Pokedex } from '../../shared/interfaces/pokemon.interface';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {

  constructor(
    private cacheService: CacheService,
  ) { }

  getPokemonData(pokemon: string): Observable<Pokedex.Pokemon> {
    return forkJoin([
      this.getPokemon(pokemon),
      this.getPokemonSpecies(pokemon),
    ]).pipe(
      map(([pokemonData, pokemonSpeciesData]) => {
        const abilities  = this.getAbilities(pokemonData.abilities);
        const types = this.getTypes(pokemonData.types);
        const flavorText = this.cleanFlavorText(pokemonSpeciesData.flavor_text_entries?.find((flavorText) => flavorText.language.name === 'en')?.flavor_text);

        const formattedPokemon: Pokedex.Pokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          stats: {
            hp: pokemonData.stats?.[0].base_stat,
            atk: pokemonData.stats?.[1].base_stat,
            def: pokemonData.stats?.[2].base_stat,
            spa: pokemonData.stats?.[3].base_stat,
            spd: pokemonData.stats?.[4].base_stat,
            spe: pokemonData.stats?.[5].base_stat,
          },
          types,
          abilities: abilities.abilities,
          hidden_abilities: abilities.hiddenAbilities,
          height: (pokemonData.height || 0)/10,
          weight: (pokemonData.weight || 0)/10,
          sprites: pokemonData.sprites,
          flavorText,
          baseExp: pokemonData.base_experience,
          evolutionTree: pokemonSpeciesData.evolution_chain?.url,
        } as Pokedex.Pokemon;
        return formattedPokemon;
      }),
      switchMap((value: Pokedex.Pokemon) => {
        return this.getPokemonEvolution(value.evolutionTree as string).pipe(
          map((evolutionData) => {
            const evolutionTree = this.getEvolutions(evolutionData.chain as PokeApi.ChainLink);
            return {
              ...value,
              evolutionTree,
            }
          })
        );
      })
    );
  }

  getAllPokemonData(): Observable<PokeApi.NamedAPIResource[]> {
    return this.getAllPokemon().pipe(
      map((data) => {
        return data.results;
      })
    );
  }

  getAllPokemonDataPaginated(offset: number, limit = 6,): Observable<PokeApi.AllPokemonResponse> {

    return this.getAllPokemonPaginated(offset, limit);
  }

  private getPokemon(pokemon: string): Observable<PokeApi.PokemonResponse> {
    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${cleanedPokemon}`;
    
    return this.cacheService.get(url);
  }

  private getAllPokemon(): Observable<PokeApi.AllPokemonResponse> {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;

    return this.cacheService.get(url);
  }

  private getAllPokemonPaginated(offset: number, limit: number): Observable<PokeApi.AllPokemonResponse> {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    return this.cacheService.get(url);
  }

  private getPokemonSpecies(pokemon: string): Observable<PokeApi.PokemonSpeciesResponse> {
    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon-species/${cleanedPokemon}`;

    return this.cacheService.get(url);
  }

  private getPokemonEvolution(url: string): Observable<PokeApi.EvolutionChainResponse> {
    return this.cacheService.get(url);
  }

  // util functions

  private formatString(string: string): string {
    return string
      .split('-')
      .join(' ');
  }

  private getAbilities(abilities: PokeApi.PokemonAbility[] | undefined): {abilities: string[], hiddenAbilities: string[]} {
    const abilityStrings: string[] = [];
    const hiddenAbilitiesString: string[] = [];
    abilities?.forEach((ability) => {
      if (ability.is_hidden) {
        hiddenAbilitiesString.push(this.formatString(ability.ability.name));
      } else {
        abilityStrings.push(this.formatString(ability.ability.name));
      }
    });

    return {
      abilities: abilityStrings,
      hiddenAbilities: hiddenAbilitiesString,
    };
  }

  private getTypes(types: PokeApi.PokemonType[] | undefined): string[] {
    const typeStrings: string[] = [];
    types?.forEach((type) => {
      typeStrings.push(this.formatString(type.type.name));
    });

    return typeStrings;
  }

  private getEvolutions(evolutionChain: PokeApi.ChainLink): Pokedex.Pokemon | Pokedex.Pokemon[] {
    const evolutionTree: Pokedex.Pokemon | Pokedex.Pokemon[] = {
      name: evolutionChain.species.name,
      id: this.extractId(evolutionChain.species.url),
      evolutionTree: []
    };

    evolutionChain.evolves_to.forEach((evolution) => {
      (evolutionTree.evolutionTree as Pokedex.Pokemon[]).push(this.getEvolutions(evolution) as Pokedex.Pokemon)
    });

    return evolutionTree;
  }

  private extractId(url: string): number {
    return parseInt(url.replace('https://', '').split('/')[4]);
  }

  private cleanFlavorText(flavorText: string | undefined): string {
    return (flavorText as string)
      .split('\n')
      .join(' ')
      .split('\f')
      .join(' ');
  }
}
