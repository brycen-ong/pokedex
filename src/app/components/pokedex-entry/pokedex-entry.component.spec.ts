import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexEntryComponent } from './pokedex-entry.component';

describe('PokedexEntryComponent', () => {
  let component: PokedexEntryComponent;
  let fixture: ComponentFixture<PokedexEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
