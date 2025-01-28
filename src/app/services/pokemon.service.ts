import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pokemon } from '../shared/interfaces/pokemon.interface';

interface PokeApiResponse {
  abilities: PokeApiAbility[];
  base_experience: number;
  cries: {
    latest: string;
    legacy: string;
  };
  forms: {
    name: string;
    url: string;
  }[];
  name: string;
  types: PokeApiType[];
}

interface PokeApiAbility {
  ability: {
    name: string,
    url: string,
  };
  is_hidden: boolean;
  slot: number;
}

interface PokeApiType {
  slot: number;
  type: {
    name: string,
    url: string,
  };
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(
    private http: HttpClient
  ) { }

  getPokemonData(pokemon: string): Observable<any> {
    const cleanedPokemon = pokemon.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${cleanedPokemon}/`;
    return this.http.get(url).pipe(
      map((data: Partial<PokeApiResponse>) => {
        const abilities  = this.getAbilities(data.abilities);
        const types = this.getTypes(data.types);

        return {
          abilities,
          types,
        }
      })
    )
  }

  getAbilities(abilities: PokeApiAbility[] | undefined): string[] {
    const abilityStrings: string[] = [];
    abilities?.forEach((ability) => {
      abilityStrings.push(ability.ability.name);
    });

    return abilityStrings;
  }

  getTypes(types: PokeApiType[] | undefined): string[] {
    const typeStrings: string[] = [];
    types?.forEach((type) => {
      typeStrings.push(type.type.name);
    });

    return typeStrings;
  }
}
