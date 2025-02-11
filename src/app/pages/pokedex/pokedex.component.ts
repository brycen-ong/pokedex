import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async searchPokemon(): Promise<void> {
    this.router.navigate([`./${this.pokemonInput.toLocaleLowerCase()}`], { relativeTo: this.route });
  }
}
