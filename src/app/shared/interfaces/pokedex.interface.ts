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
    abilities?: Ability[];
    moves?: Move[];
    height?: number;
    weight?: number;
    sprites?: PokeApi.PokemonSprites;
    flavorText?: string;
    baseExp?: number;
    evolutionTree?: EvolutionTree;
  }

  export interface EvolutionTree {
    id: number;
    branches: EvolutionBranch[];
  }

  export interface EvolutionBranch extends Array<EvolutionNode> {}

  export interface EvolutionNode {
    name: string;
    id: number;
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

  export interface Ability {
    name?: string;
    description?: string;
    hidden?: boolean;
  }
}