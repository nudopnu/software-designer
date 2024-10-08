import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AttributeViewModel } from '../../models/data.model';
import { NodeService } from '../../services/node-service.service';
import { GridComponent } from '../grid/grid.component';
import { NodeLabelComponent } from '../node-label/node-label.component';

@Component({
  selector: 'swd-node-attribute',
  templateUrl: './node-attribute.component.html',
  styleUrl: './node-attribute.component.css'
})
export class NodeAttributeComponent implements AfterViewInit, OnChanges {

  @ViewChild('attributeRef') attributeElementRef!: ElementRef;
  @ViewChild('typddeRef') typeLabel!: NodeLabelComponent;
  @ViewChild('nameRef') nameLabel!: NodeLabelComponent;
  @ViewChild('outAnchor') outAnchor!: ElementRef;
  @ViewChild('inAnchor') inAnchor!: ElementRef;

  @Input() grid!: GridComponent;
  @Input() minWidth: number = 100;
  @Input() attribute!: AttributeViewModel;
  @Input() idx!: number;
  @Output() escape = new EventEmitter();

  constructor(public nodeService: NodeService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateAnchors();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ([...Object.values(changes)].some(change => change.isFirstChange())) { return; }
    this.updateAnchors();
  }

  private updateAnchors() {
    const outAnchorElement = this.outAnchor?.nativeElement as HTMLElement;
    const inAnchorElement = this.inAnchor?.nativeElement as HTMLElement;
    if (inAnchorElement) {
      const parent = this.attributeElementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      const { x: parentX, y: parentY } = this.grid.clientToGrid(parent.getBoundingClientRect());
      const { x, y } = this.grid.clientToGrid(inAnchorElement.getBoundingClientRect());
      this.attribute.inAnchor.set({ x: x - parentX, y: y - parentY });
    }
    if (outAnchorElement) {
      const parent = this.attributeElementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      const { x: parentX, y: parentY } = this.grid.clientToGrid(parent.getBoundingClientRect());
      const { x, y } = this.grid.clientToGrid(outAnchorElement.getBoundingClientRect());
      this.attribute.outAnchor.set({ x: x - parentX, y: y - parentY });
    }
    console.log();

  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!event.altKey || event.key !== 'Enter') { return; }
    this.attribute.keyType = this.attribute.keyType !== 'primary' ? 'primary' : 'none';
  }

  onDragStart(event: DragEvent) {
    console.log(event);
    event.preventDefault();
    event.stopImmediatePropagation();
    this.nodeService.startConnecting(this.attribute, this.outAnchor.nativeElement as HTMLElement);
  }

  @HostListener('document:mouseup', ['$event'])
  onDragLeave($event: DragEvent) {
    this.nodeService.abortConnecting();
  }

  focusNameElement() {
    this.nameLabel.focus();
  }

  focusTypeElement() {
    this.typeLabel.focus();
  }

}
