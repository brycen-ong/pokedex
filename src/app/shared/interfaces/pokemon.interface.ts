import { PokeApi } from './pokeapi.interface';

export namespace Pokedex {
  export interface Pokemon {
    id?: number;
    name?: string;
    stats?: {
      hp?: number;
      atk?: number;
      def?: number;
      spa?: number;
      spd?: number;
      spe?: number;
    }
    types?: string[];
    abilities?: string[];
    hidden_abilities?: string[];
    height?: number;
    weight?: number;
    sprites?: PokeApi.PokemonSprites;
    flavorText?: string;
  }
}