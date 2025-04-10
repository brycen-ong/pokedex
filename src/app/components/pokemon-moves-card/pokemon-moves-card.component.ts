import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Pokedex } from '../../shared/interfaces/pokedex.interface';
import { firstValueFrom } from 'rxjs';
import { PokedexService } from '../../services/pokedex/pokedex.service';
import { PokeApi } from '../../shared/interfaces/pokeapi.interface';
import { TypeChipComponent } from "../../shared/components/type-chip/type-chip.component";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-moves-card',
  imports: [
    MatCardModule,
    MatTableModule,
    TypeChipComponent,
    MatIconModule,
],
  templateUrl: './pokemon-moves-card.component.html',
  styleUrl: './pokemon-moves-card.component.scss'
})
export class PokemonMovesCardComponent implements OnChanges {
  @Input() pokemon?: Pokedex.Pokemon;
  moves: Pokedex.Move[] = [];
  movesColumns = ['name', 'type', 'damage_class', 'power', 'pp', 'accuracy', 'priority'];

  constructor(
    private pokedexService: PokedexService,
  ) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['pokemon']) {
      this.moves = this.pokemon?.moves as Pokedex.Move[];
    }
  }

  priorityCount(priority: number): number[] {
    if (priority === 0) {
      return [0]
    }

    const numberArray = [];
    for (let i = 0; i < priority; i++) {
      numberArray.push(i);
    }

    return numberArray;
  }
}
