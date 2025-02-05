import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { PokeApi } from '../shared/interfaces/pokeapi.interface';
import { Pokedex } from '../shared/interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(
    private http: HttpClient
  ) { }

  getPokemonData(pokemon: string): Observable<Pokedex.Pokemon> {
    return forkJoin([
      this.getPokemon(pokemon),
      this.getPokemonSpecies(pokemon),
    ]).pipe(
      map(([pokemonData, pokemonSpeciesData]) => {
        const abilities  = this.getAbilities(pokemonData.abilities);
        const types = this.getTypes(pokemonData.types);
        const flavorText = this.cleanFlavorText(pokemonSpeciesData.flavor_text_entries?.[0].flavor_text);

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
        } as Pokedex.Pokemon;
        return formattedPokemon;
      })
    );
  }

  getPokemon(pokemon: string): Observable<Partial<PokeApi.PokemonResponse>> {
    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${cleanedPokemon}`;
    
    return this.http.get(url);
  }

  getPokemonSpecies(pokemon: string): Observable<Partial<PokeApi.PokemonSpeciesResponse>> {
    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon-species/${cleanedPokemon}`;

    return this.http.get(url);
  }

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

  private cleanFlavorText(flavorText: string | undefined): string {
    return (flavorText as string)
      .split('\n')
      .join(' ')
      .split('\f')
      .join(' ');
  }
}
