import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexSearchCardComponent } from './pokedex-search-card.component';

describe('PokedexSearchCardComponent', () => {
  let component: PokedexSearchCardComponent;
  let fixture: ComponentFixture<PokedexSearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexSearchCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
