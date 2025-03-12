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
    moves?: PokeApi.NamedAPIResource[];
    height?: number;
    weight?: number;
    sprites?: PokeApi.PokemonSprites;
    flavorText?: string;
    baseExp?: number;
    evolutionTree?: string | Pokemon | Pokemon[];
  }
  
  export interface Move {
    id?: number;
    name?: string;
    type?: string;
    damage_class?: string;
    power?: number;
    pp?: number;
    accuracy?: number;
    priority?: number;
  }
}