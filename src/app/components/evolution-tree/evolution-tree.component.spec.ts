import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionTreeComponent } from './evolution-tree.component';

describe('EvolutionTreeComponent', () => {
  let component: EvolutionTreeComponent;
  let fixture: ComponentFixture<EvolutionTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
