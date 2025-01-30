import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PokemonService } from '../../services/pokemon.service';
import { firstValueFrom } from 'rxjs';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokedex',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent {
  pokemonInput: string = '';

  constructor(
    private pokemonService: PokemonService,
  ) {}

  async getPokemon(): Promise<void> {
    const res = await firstValueFrom(this.pokemonService.getPokemonData(this.pokemonInput));
    console.log(res);
  }
}
