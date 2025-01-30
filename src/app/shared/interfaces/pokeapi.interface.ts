export namespace PokeApi {
  export interface PokemonResponse {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: PokemonAbility[];
    forms: NamedApiResource[];
    game_indices: VersionGameIndex[];
    held_items: PokemonHeldItem[];
    location_area_encounters: string;
    moves: PokemonMove[];
    past_types: PokemonTypePast[];
    sprites: PokemonSprites;
    cries: PokemonCries;
    species: NamedApiResource[];
    stats: PokemonStat[];
    types: PokemonType[];
  }
  
  export interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: NamedApiResource;
  }

  export interface PokemonType {
    slot: number;
    type: NamedApiResource;
  }

  export interface PokemonFormType {
    slot: number;
    type: NamedApiResource;
  }

  export interface PokemonTypePast {
    generation: NamedApiResource;
    types: PokemonType[];
  }

  export interface PokemonHeldItem {
    item: NamedApiResource;
    version_details: PokemonHeldItemVersion[];
  }

  export interface PokemonHeldItemVersion {
    version: NamedApiResource;
    rarity: number;
  }

  export interface PokemonMove {
    move: NamedApiResource;
    version_group_details: PokemonMoveVersion;
  }

  export interface PokemonMoveVersion {
    move_learn_metthod: NamedApiResource;
    version_group: NamedApiResource;
    level_learned_at: number;
  }

  export interface PokemonStat {
    stat: NamedApiResource;
    effort: number;
    base_stat: number;
  }

  export interface PokemonSprites {
    front_default: string;
    front_shiny: string;
    front_female: string;
    front_shiny_female: string;
    back_default: string;
    back_shiny: string;
    back_female: string;
    back_shiny_female: string;
  };

  export interface PokemonCries {
    latest: string;
    legacy: string;
  }

  export interface VersionGameIndex {
    game_index: number;
    version: NamedApiResource;
  }

  export interface NamedApiResource {
    name: string;
    url: string;
  }
}