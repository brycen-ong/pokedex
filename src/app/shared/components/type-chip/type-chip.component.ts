import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-type-chip',
  imports: [],
  templateUrl: './type-chip.component.html',
  styleUrl: './type-chip.component.scss'
})
export class TypeChipComponent {
  @Input() type = '';
  @Input() size: 's' | 'l' = 'l';
  @Input() margin: 's' | 'l' | 'none' = 'l';
}
