import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonStatComponent } from './pokemon-stat.component';

describe('PokemonStatComponent', () => {
  let component: PokemonStatComponent;
  let fixture: ComponentFixture<PokemonStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonStatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
