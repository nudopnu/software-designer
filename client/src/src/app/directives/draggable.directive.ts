import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { GridComponent } from '../components/grid/grid.component';
import { HtmlParser } from '@angular/compiler';

@Directive({
  selector: '[swdDraggable]'
})
export class DraggableDirective {

  @Input() grid!: GridComponent;

  startPoint?: {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  };

  constructor(private hostRef: ElementRef) {
    console.log(hostRef.nativeElement);
    (hostRef.nativeElement as HTMLElement).draggable = true;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    const { x, y } = this.grid.clientToGrid(event.clientX, event.clientY);
    const hostElementRect = (this.hostRef.nativeElement as HTMLElement).getBoundingClientRect();
    const offsetX = x - this.grid.clientToGrid(hostElementRect.x, hostElementRect.y).x;
    const offsetY = y - this.grid.clientToGrid(hostElementRect.x, hostElementRect.y).y;
    this.startPoint = { x, y, offsetX, offsetY };
    event.preventDefault();
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    this.startPoint = undefined;
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (!this.startPoint) { return; }
    const hostElement = this.hostRef.nativeElement as HTMLElement;
    const { x, y } = this.grid.clientToGrid(event.clientX, event.clientY);
    hostElement.style.left = `${(x - this.startPoint.offsetX) / this.grid.zoom}px`;
    hostElement.style.top = `${(y - this.startPoint.offsetY) / this.grid.zoom}px`;
  }

}
