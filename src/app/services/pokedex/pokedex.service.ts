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
      map(([pokemonData, pokemonSpeciesData]): [Pokedex.Pokemon, string] => {
        const abilities  = this.getAbilities(pokemonData.abilities);
        const types = this.getTypes(pokemonData.types);
        const moves = this.getMoves(pokemonData.moves);
        const flavorText = this.cleanFlavorText(pokemonSpeciesData.flavor_text_entries?.find((flavorText) => flavorText.language.name === 'en')?.flavor_text);

        const formattedPokemon: Pokedex.Pokemon = {
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
          types,
          abilities: abilities.abilities,
          hidden_abilities: abilities.hiddenAbilities,
          moves,
          height: (pokemonData.height || 0)/10,
          weight: (pokemonData.weight || 0)/10,
          sprites: pokemonData.sprites,
          flavorText,
          baseExp: pokemonData.base_experience,
        } as Pokedex.Pokemon;
        return [formattedPokemon, pokemonSpeciesData.evolution_chain?.url];
      }),
      switchMap(([value, evolutionChainUrl]) => {
        return this.getPokemonEvolution(evolutionChainUrl).pipe(
          map((evolutionData) => {
            const evolutionTree: Pokedex.EvolutionTree = {
              id: evolutionData.id,
              branches: [],
            }
            this.getEvolutions(
              evolutionData.chain,
              [],
              evolutionTree,
            );

            return {
              ...(value as Pokedex.Pokemon),
              evolutionTree,
            }
          })
        );
      })
    );
  }

  async getAllPokemonData(): Promise<void> {
    const { results } = await firstValueFrom(this.getAllPokemon());
    this.allPokemon = results.map((result) => {
      result.name = this.cleanPokemonName(result.name);
      return result;
    });
  }

  getPokemonMovesData(movesList: PokeApi.NamedAPIResource[]): Observable<Pokedex.Move[]> {
    const requestArray: Observable<PokeApi.PokemonMovesResponse>[] = [];
    movesList.forEach((move) => {
      requestArray.push(this.getPokemonMoves(move.url));
    });

    return forkJoin(requestArray).pipe(
      map(moves => {
        const pokemonMoveArray: Pokedex.Move[] = [];

        moves.forEach((move) => {
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

          pokemonMoveArray.push(pokemonMove);
        });

        return pokemonMoveArray;
      })
    );
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

    console.log(evolutionTree);

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
