import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Debounce } from '../../decorators/debounce.decorator';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {
  @Output() endReached = new EventEmitter<string>();
  currentPosition = window.scrollY;

  @HostListener('window:scroll', ['$event'])
  @Debounce()
  onScroll() {
    const margin = 10;
    const scrolledDistance = window.scrollY + window.innerHeight;
    const totalHeight = document.body.scrollHeight - margin;
    const scroll = window.scrollY;

    // if scroll down
    if (scroll > this.currentPosition) {
      if (scrolledDistance >= totalHeight) {
        this.endReached.emit('end');
      }
    }

    this.currentPosition = scroll;
  }
}