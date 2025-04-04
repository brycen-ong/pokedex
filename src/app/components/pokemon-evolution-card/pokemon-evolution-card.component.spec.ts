import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonEvolutionCardComponent } from './pokemon-evolution-card.component';

describe('PokemonEvolutionCardComponent', () => {
  let component: PokemonEvolutionCardComponent;
  let fixture: ComponentFixture<PokemonEvolutionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonEvolutionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonEvolutionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
