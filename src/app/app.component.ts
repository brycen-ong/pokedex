import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonService } from './services/pokemon.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'pokedex';

  constructor(
    private pokemonService: PokemonService,
  ) {}

  ngOnInit(): void {
    // this.getBulbasaur();
  }

  async getBulbasaur(): Promise<void> {
    const bulbasaur = await firstValueFrom(this.pokemonService.getPokemonData('bulbasaur'));
    console.log('bulbasaur: ', bulbasaur);
  }
}
