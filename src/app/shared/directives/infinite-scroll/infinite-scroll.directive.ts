import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {
  @Output() endReached = new EventEmitter<string>();
  @Input() canLoad = false;
  currentPosition = window.scrollY;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const margin = 10;
    const scrolledDistance = window.scrollY + window.innerHeight;
    const totalHeight = document.body.scrollHeight - margin;
    const scroll = window.scrollY;

    // if scroll down
    if (scroll > this.currentPosition) {
      if (scrolledDistance >= totalHeight && this.canLoad) {
        this.endReached.emit('end');
      }
    }

    this.currentPosition = scroll;
  }
}