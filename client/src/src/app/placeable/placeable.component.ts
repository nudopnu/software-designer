import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { GridComponent } from '../components/grid/grid.component';

@Component({
  selector: 'swd-placeable',
  templateUrl: './placeable.component.html',
  styleUrl: './placeable.component.css'
})
export class PlaceableComponent {

  @Input() grid!: GridComponent;
  @ViewChild('container') containerElementRef!: ElementRef;

  startPoint?: {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  };

  onDragStart(event: DragEvent) {
    const { x, y } = this.grid.clientToGrid(event.clientX, event.clientY);
    const hostElementRect = (this.containerElementRef.nativeElement as HTMLElement).getBoundingClientRect();
    const offsetX = x - this.grid.clientToGrid(hostElementRect.x, hostElementRect.y).x;
    const offsetY = y - this.grid.clientToGrid(hostElementRect.x, hostElementRect.y).y;
    this.startPoint = { x, y, offsetX, offsetY };
    event.preventDefault();
    console.log(event);
    
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    this.startPoint = undefined;
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (!this.startPoint) { return; }
    const hostElement = this.containerElementRef.nativeElement as HTMLElement;
    const { x, y } = this.grid.clientToGrid(event.clientX, event.clientY);
    hostElement.style.left = `${(x - this.startPoint.offsetX) / this.grid.zoom}px`;
    hostElement.style.top = `${(y - this.startPoint.offsetY) / this.grid.zoom}px`;
  }
  
}
