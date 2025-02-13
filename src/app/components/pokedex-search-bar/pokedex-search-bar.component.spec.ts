import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexSearchBarComponent } from './pokedex-search-bar.component';

describe('PokedexSearchBarComponent', () => {
  let component: PokedexSearchBarComponent;
  let fixture: ComponentFixture<PokedexSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexSearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
