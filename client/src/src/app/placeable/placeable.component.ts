import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { GridComponent } from '../components/grid/grid.component';
import { Node } from '../models/data.model';

@Component({
  selector: 'swd-placeable',
  templateUrl: './placeable.component.html',
  styleUrl: './placeable.component.css'
})
export class PlaceableComponent {

  @Input() grid!: GridComponent;
  @Input() node!: Node<any>;
  @ViewChild('container') containerElementRef!: ElementRef;

  startPoint?: {
    offsetX: number;
    offsetY: number;
  };

  onDragStart(event: DragEvent) {
    const { x: mouseX, y: mouseY } = this.grid.clientToGrid(event.clientX, event.clientY);
    const hostElement = this.containerElementRef.nativeElement as HTMLElement;
    const hostElementRect = hostElement.getBoundingClientRect();
    const hostElementCoords = this.grid.clientToGrid(hostElementRect.x, hostElementRect.y);
    const offsetX = (mouseX - hostElementCoords.x) / this.grid.zoom;
    const offsetY = (mouseY - hostElementCoords.y) / this.grid.zoom;
    this.startPoint = { offsetX, offsetY };
    event.preventDefault();
    console.log(this.startPoint, hostElement);
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
    const relX = ((x) / this.grid.zoom) - this.startPoint.offsetX;
    const relY = ((y) / this.grid.zoom) - this.startPoint.offsetY;
    // hostElement.style.left = `${relX}px`;
    // hostElement.style.top = `${relY}px`;
    this.node.metadata.update(metadata => ({ ...metadata, x: relX, y: relY }));
  }

}
