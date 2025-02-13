import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokedexSearchBarComponent } from "../../components/pokedex-search-bar/pokedex-search-bar.component";

@Component({
  selector: 'app-pokedex',
  imports: [
    PokedexSearchBarComponent
],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async searchPokemon(searchKey: string | null): Promise<void> {
    if (searchKey) {
      this.router.navigate([`./${searchKey.toLocaleLowerCase()}`], { relativeTo: this.route });
    }
  }
}
