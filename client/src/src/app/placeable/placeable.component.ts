import { Component, ElementRef, HostListener, Input, ViewChild, WritableSignal } from '@angular/core';
import { GridComponent } from '../components/grid/grid.component';
import { Position } from '../models/data.model';

@Component({
  selector: 'swd-placeable',
  templateUrl: './placeable.component.html',
  styleUrl: './placeable.component.css'
})
export class PlaceableComponent {

  @Input() grid!: GridComponent;
  @Input() position!: WritableSignal<Position>;
  @ViewChild('container') containerElementRef!: ElementRef;

  startPoint?: {
    offsetX: number;
    offsetY: number;
  };

  onDragStart(event: DragEvent) {
    const { x: mouseX, y: mouseY } = this.grid.clientToGrid({ x: event.clientX, y: event.clientY });
    const hostElement = this.containerElementRef.nativeElement as HTMLElement;
    const hostElementRect = hostElement.getBoundingClientRect();
    const { x: hostX, y: hostY } = this.grid.clientToGrid(hostElementRect);
    const offsetX = mouseX - hostX;
    const offsetY = mouseY - hostY;
    this.startPoint = { offsetX, offsetY };
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
    const { x: mouseX, y: mouseY } = this.grid.clientToGrid(event);
    const relX = mouseX - this.startPoint.offsetX;
    const relY = mouseY - this.startPoint.offsetY;
    this.position.set({ x: relX, y: relY });
  }

}
