import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { mat3, vec3 } from "gl-matrix";
import { NodeService } from '../../services/node-service.service';

@Component({
  selector: 'swd-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements AfterViewInit {
  Math = Math;
  @ViewChild('world') worldElementRef!: ElementRef;
  @ViewChild('pointer') pointerElementRef!: ElementRef;

  grab = false;
  grabbing = false;
  zooming = false;
  zoomStep = 1.2;

  gridSize = 25;
  zoom = 1;
  minZoom = .4;
  maxZoom = 15;
  worldPosition = vec3.fromValues(300, 300, 1);

  worldMatrix = mat3.fromValues(
    this.zoom, 0, this.worldPosition[0],
    0, this.zoom, this.worldPosition[1],
    0, 0, 1,
  );
  gridMatrix = mat3.clone(this.worldMatrix);
  cursorMatrix = mat3.create();

  startMousePoint = vec3.create();
  startWorldPoint = vec3.create();

  gridTranform = this.toCSS(this.gridMatrix);
  worldTransform = this.toCSS(this.worldMatrix);
  cursorTransform = this.toCSS(this.cursorMatrix);

  constructor(
    private cdr: ChangeDetectorRef,
    nodeService: NodeService,
  ) { }

  ngAfterViewInit(): void {
    this.updateTransform();
    this.cdr.detectChanges();
  }

  clientToGrid<T extends { x: number, y: number }>(coords: T) {
    const { x, y } = coords;
    const worldElement = this.worldElementRef.nativeElement as HTMLElement;
    const deltaX = (x - worldElement.getBoundingClientRect().x) / this.zoom;
    const deltaY = (y - worldElement.getBoundingClientRect().y) / this.zoom;
    return { x: deltaX, y: deltaY }
  }

  protected updateMouseCursor(mouseEvent: MouseEvent) {
    const { x, y } = this.clientToGrid({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    this.cursorMatrix[2] = x;
    this.cursorMatrix[5] = y;
    this.cursorTransform = this.toCSS(this.cursorMatrix);
  }

  protected updateTransform() {
    mat3.set(this.worldMatrix,
      this.zoom, 0, this.worldPosition[0],
      0, this.zoom, this.worldPosition[1],
      0, 0, 1,
    );
    mat3.copy(this.gridMatrix, this.worldMatrix);
    this.gridMatrix[2] = this.gridMatrix[2] % (this.gridSize * this.zoom) - (this.gridSize * this.zoom);
    this.gridMatrix[5] = this.gridMatrix[5] % (this.gridSize * this.zoom) - (this.gridSize * this.zoom);
    this.worldTransform = this.toCSS(this.worldMatrix);
    this.gridTranform = this.toCSS(this.gridMatrix);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.grabbing && this.startMousePoint && this.startWorldPoint) {
      const deltaX = this.startMousePoint[0] - event.clientX;
      const deltaY = this.startMousePoint[1] - event.clientY;
      this.worldPosition[0] = this.startWorldPoint[0] - deltaX;
      this.worldPosition[1] = this.startWorldPoint[1] - deltaY;
      this.updateTransform();
      this.cdr.detectChanges();
    }
    this.updateMouseCursor(event);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code !== 'Space') { return; }
    this.grab = true;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.code !== 'Space') { return; }
    this.grab = false;
  }

  @HostListener('window:blur', ['$event'])
  onBlur(_event: Event) {
    this.grab = false;
    this.grabbing = false;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.grab) { return; }
    const deltaX = event.clientX;
    const deltaY = event.clientY;
    vec3.set(this.startMousePoint,
      deltaX,
      deltaY,
      1
    );
    this.startWorldPoint = vec3.clone(this.worldPosition);
    this.grabbing = true;
    this.updateTransform();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (!this.startMousePoint) { return; }
    this.grab = false;
    this.grabbing = false;
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    const zoomFactor = event.deltaY < 0 ? this.zoomStep : 1 / this.zoomStep;
    const oldZoom = this.zoom;
    this.zoom = Math.round(zoomFactor * this.zoom * 100) / 100;
    this.zoom = Math.max(this.minZoom, this.zoom);
    this.zoom = Math.min(this.maxZoom, this.zoom);
    if (this.zoom === oldZoom) { return; }

    const worldElement = this.worldElementRef.nativeElement as HTMLElement;
    const deltaX = event.clientX - worldElement.getBoundingClientRect().x;
    const deltaY = event.clientY - worldElement.getBoundingClientRect().y;

    vec3.set(this.worldPosition,
      this.worldPosition[0] + Math.sign(event.deltaY) * deltaX / 10,
      this.worldPosition[1] + Math.sign(event.deltaY) * deltaY / 10,
      1,
    );
    this.updateTransform();
    this.cdr.detectChanges();
    this.updateMouseCursor(event);
  }

  private toCSS(mat: mat3) {
    const a = mat[0];
    const b = mat[3];
    const c = mat[1];
    const d = mat[4];
    const tx = mat[2];
    const ty = mat[5];
    return `matrix(${[a, b, c, d, tx, ty].join(', ')})`;
  }

}