import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${cleanedPokemon}/`;
    return this.http.get(url).pipe(
      map((data: Partial<PokeApi.PokemonResponse>) => {
        const abilities  = this.getAbilities(data.abilities);
        const types = this.getTypes(data.types);

        const formattedPokemon: Pokedex.Pokemon = {
          id: data.id,
          name: data.name,
          stats: {
            hp: data.stats?.[0].base_stat,
            atk: data.stats?.[1].base_stat,
            def: data.stats?.[2].base_stat,
            spa: data.stats?.[3].base_stat,
            spd: data.stats?.[4].base_stat,
            spe: data.stats?.[5].base_stat,
          },
          types,
          abilities: abilities.abilities,
          hidden_abilities: abilities.hiddenAbilities,
          height: (data.height || 0)/10,
          weight: (data.weight || 0)/10,
          sprites: data.sprites,
        }

        return formattedPokemon;
      })
    )
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
}
