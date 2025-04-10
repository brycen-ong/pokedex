import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
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

  getPokemonDataAll(pokemonUrl?: string): Observable<Pokedex.Pokemon> {
    return this.getPokemon('', pokemonUrl).pipe(
      map((pokemonData) => {
        const types = this.getTypes(pokemonData.types);

        const formattedPokemon: Pokedex.Pokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          types,
          sprites: pokemonData.sprites,
        };

        return formattedPokemon;
      })
    )
  }

  getPokemonDataEntry(pokemon: string): Observable<Pokedex.Pokemon> {
    return forkJoin([
      this.getPokemon(pokemon),
      this.getPokemonSpecies(pokemon),
    ]).pipe(
      switchMap(([pokemonData, pokemonSpeciesData]) => {
        const moves = pokemonData.moves.map((pokemondataMoves) => pokemondataMoves.move);
        const movesRequestArray: Observable<PokeApi.PokemonMovesResponse>[] = [];
        moves.forEach((move) => {
          movesRequestArray.push(this.getPokemonMoves(move.url));
        });

        return forkJoin([
          of(pokemonData),
          of(pokemonSpeciesData),
          this.getPokemonEvolution(pokemonSpeciesData.evolution_chain?.url),
          ...movesRequestArray,
        ])
      }),
      map(([pokemonData, pokemonSpeciesData, evolutionData, ...movesData]) => {
        const evolutionTree: Pokedex.EvolutionTree = {
          id: evolutionData.id,
          branches: [],
        }
        const moves: Pokedex.Move[] = [];

        this.getEvolutions(evolutionData.chain, [], evolutionTree);
        movesData.forEach((move) => {
          const pokemonMove: Pokedex.Move = {
            id: move.id,
            name: this.cleanMoveName(move.name),
            type: move.type.name,
            damage_class: move.damage_class.name,
            power: move.power,
            pp: move.pp,
            accuracy: move.accuracy,
            priority: move.priority,
          }
          
          moves.push(pokemonMove);
        });

        console.log(moves);

        return {
          id: pokemonData.id,
          name: this.cleanPokemonName(pokemonData.name),
          stats: {
            hp: pokemonData.stats?.[0].base_stat,
            atk: pokemonData.stats?.[1].base_stat,
            def: pokemonData.stats?.[2].base_stat,
            spa: pokemonData.stats?.[3].base_stat,
            spd: pokemonData.stats?.[4].base_stat,
            spe: pokemonData.stats?.[5].base_stat,
          },
          types: this.getTypes(pokemonData.types),
          abilities: this.getAbilities(pokemonData.abilities),
          height: (pokemonData.height)/10,
          weight: (pokemonData.weight)/10,
          sprites: pokemonData.sprites,
          flavorText: this.cleanFlavorText(pokemonSpeciesData.flavor_text_entries),
          baseExp: pokemonData.base_experience,
          evolutionTree,
          moves
        }
      })
    )
  }

  async getAllPokemonData(): Promise<void> {
    const { results } = await firstValueFrom(this.getAllPokemon());
    this.allPokemon = results.map((result) => {
      result.name = this.cleanPokemonName(result.name);
      return result;
    });
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
      const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
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

  private getAbilities(abilities: PokeApi.PokemonAbility[] | undefined): Pokedex.Ability[] {
    const abilitiesArray: Pokedex.Ability[] = [];
  
    abilities?.forEach((ability) => {
      abilitiesArray.push({
        name: ability.ability.name,
        hidden: ability.is_hidden,
      })
    });

    return abilitiesArray;
  }

  private getTypes(types: PokeApi.PokemonType[] | undefined): string[] {
    const typeStrings: string[] = [];
    types?.forEach((type) => {
      typeStrings.push(this.formatString(type.type.name));
    });

    return typeStrings;
  }

  private getEvolutions(
    evolutionChain: PokeApi.ChainLink,
    evolutionBranch: Pokedex.EvolutionBranch,
    evolutionTree: Pokedex.EvolutionTree,
  ) {
    const evolutionNode: Pokedex.EvolutionNode = {
      id: this.extractId(evolutionChain.species.url),
      name: evolutionChain.species.name,
    }
    evolutionBranch.push(evolutionNode);

    if (evolutionChain.evolves_to.length > 0) {
      evolutionChain.evolves_to.forEach((evolution) => {
        this.getEvolutions(
          evolution,
          [...evolutionBranch],
          evolutionTree,
        )
      })
    } else {
      evolutionTree.branches.push(evolutionBranch);
    }

    return evolutionTree;
  }

  private extractId(url: string): number {
    return parseInt(url.replace('https://', '').split('/')[4]);
  }

  private cleanFlavorText(flavorText: PokeApi.FlavorText[]): string {
    return flavorText
      .find((text) => text.language.name === 'en')?.flavor_text
      .split('\n')
      .join(' ')
      .split('\f')
      .join(' ') as string;
  }

  private cleanPokemonName(pokemonName: string | undefined): string {
    const exceptions: string[] = [
      'ho-oh',
      'porygon-z',
      'type-null',
      'jangmo-o',
      'hakamo-o',
      'kommo-o',
      'tapu-koko',
      'tapu-lele',
      'tapu-bulu',
      'tapu-fini',
      'wo-chien',
      'chien-pao',
      'ting-lu',
      'chi-yu',
    ];

    const twoWordNames: string[]  = [
      'mr-mime',
      'mime-jr',
      'mr-rime',
      'great-tusk',
      'scream-tail',
      'brute-bonnet',
      'flutter-mane',
      'slither-wing',
      'sandy-shocks',
      'iron-treads',
      'iron-bundle',
      'iron-hands',
      'iron-jugulis',
      'iron-moth',
      'iron-thorns',
      'roaring-moon',
      'iron-valiant',
      'walking-wake',
      'iron-leaves',
      'gouging-fire',
      'raging-bolt',
      'iron-boulder',
      'iron-crown',
    ];

    if (exceptions.includes(pokemonName as string)) {
      return pokemonName as string;
    }

    if (twoWordNames.includes(pokemonName as string)) {
      return (pokemonName as string)
        .split('-')
        .join(' ');
    }

    return (pokemonName as string)
      .split('-')[0];
  }

  private cleanMoveName(moveName: string | undefined): string {
    return (moveName as string)
      .split('-')
      .join(' ');
  }
}
