import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Debounce } from '../../shared/decorators/debounce.decorator';

@Component({
  selector: 'app-pokedex-search-bar',
  imports: [
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './pokedex-search-bar.component.html',
  styleUrl: './pokedex-search-bar.component.scss'
})
export class PokedexSearchBarComponent {
  @Output() searchEvent = new EventEmitter<string | null>();
  searchKey = new FormControl('');

  @Debounce(500)
  search() {
    this.searchEvent.emit(this.searchKey.value);
  }
}
