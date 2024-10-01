import { Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'svg:g[swd-node-connection]',
  templateUrl: './node-connection.component.html',
  styleUrl: './node-connection.component.css'
})
export class NodeConnectionComponent {

  @ViewChild('startRef') startElementRef!: ElementRef;
  @Input() startPoint = { x: 0, y: 0 };  // Fixed starting point
  @Input() endPoint = { x: 0, y: 0 };  // Mouse position
  @Input() gridComponent!: GridComponent;
  path = '';

  constructor(private hostRef: ElementRef) { }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const startElement = this.startElementRef.nativeElement as HTMLElement;
    const hostOrigin = startElement.getBoundingClientRect();
    const deltaX = event.clientX - hostOrigin.x;
    const deltaY = event.clientY - hostOrigin.y;
    this.endPoint = { x: deltaX / this.gridComponent.zoom, y: deltaY / this.gridComponent.zoom };
    this.updatePath();
  }

  updatePath() {
    const { x: x1, y: y1 } = this.startPoint;
    const { x: x2, y: y2 } = this.endPoint;

    // Control points to shape the curve
    const controlPoint1 = { x: x1 + 50, y: y1 };  // Start with a 90° curve (vertical)
    const controlPoint2 = { x: x2 - 50, y: y2 };  // Smoothly bend towards the mouse

    // Create the cubic Bezier path
    this.path = `M ${x1},${y1} C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${x2},${y2}`;
  }
}
