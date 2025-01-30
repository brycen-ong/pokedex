import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexPokemonComponent } from './pokedex-pokemon.component';

describe('PokedexPokemonComponent', () => {
  let component: PokedexPokemonComponent;
  let fixture: ComponentFixture<PokedexPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
