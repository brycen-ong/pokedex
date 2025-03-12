import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin, map, Observable, switchMap } from 'rxjs';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';
import { Pokedex } from '../../shared/interfaces/pokedex.interface';
import { CacheService } from '../cache/cache.service';
import { POKEMON_COUNT } from '../../shared/constants/pokeapi.constant';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  private allPokemon: PokeApi.NamedAPIResource[] = [];

  constructor(
    private cacheService: CacheService,
  ) { }

  getPokemonData(pokemon: string, urlOverride?: string): Observable<Pokedex.Pokemon> {
    return forkJoin([
      this.getPokemon(pokemon, urlOverride),
      this.getPokemonSpecies(pokemon, urlOverride),
    ]).pipe(
      map(([pokemonData, pokemonSpeciesData]) => {
        const abilities  = this.getAbilities(pokemonData.abilities);
        const types = this.getTypes(pokemonData.types);
        const moves = this.getMoves(pokemonData.moves);
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
          moves,
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

  async getAllPokemonData(): Promise<void> {
    const { results } = await firstValueFrom(this.getAllPokemon());
    this.allPokemon = results;
  }

  getAllPokemonDataPaginated(offset: number, limit = 360,): PokeApi.NamedAPIResource[] {
    return this.allPokemon.slice(offset, offset+limit);
  }

  searchPokemonData(searchKey: string): PokeApi.NamedAPIResource[] {
    return this.allPokemon.filter((pokemon) => pokemon.name.includes(searchKey))
  }

  private getPokemon(pokemon: string, urlOverride?: string): Observable<PokeApi.PokemonResponse> {
    if (urlOverride) {
      const id = this.extractId(urlOverride);
      const url = `https://pokeapi.co/api/v2/pokemon/${id}`
      return this.cacheService.get(url);
    }

    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${cleanedPokemon}`;
    
    return this.cacheService.get(url);
  }

  private getAllPokemon(): Observable<PokeApi.AllPokemonResponse> {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`;
    return this.cacheService.get(url);
  }

  private getPokemonSpecies(pokemon: string, urlOverride?: string): Observable<PokeApi.PokemonSpeciesResponse> {
    if (urlOverride) {
      const id = this.extractId(urlOverride);
      const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
      return this.cacheService.get(url);
    }

    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon-species/${cleanedPokemon}`;

    return this.cacheService.get(url);
  }

  private getPokemonEvolution(url: string): Observable<PokeApi.EvolutionChainResponse> {
    return this.cacheService.get(url);
  }

  private getPokemonMoves(url: string): Observable<PokeApi.PokemonMovesResponse> {
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

  private getMoves(moves: PokeApi.PokemonMove[]): PokeApi.NamedAPIResource[] {
    const movesCleaned: PokeApi.NamedAPIResource[] = [];
    moves.forEach((move) => {
      movesCleaned.push((move.move));
    });

    return movesCleaned;
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
