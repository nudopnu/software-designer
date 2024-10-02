import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { NodeLabelComponent } from '../node-label/node-label.component';
import { Attribute } from '../../models/data.model';
import { GridComponent } from '../grid/grid.component';
import { NodeService } from '../../services/node-service.service';

@Component({
  selector: 'swd-node-attribute',
  templateUrl: './node-attribute.component.html',
  styleUrl: './node-attribute.component.css'
})
export class NodeAttributeComponent {

  @ViewChild('attributeRef') attributeElementRef!: ElementRef;
  @ViewChild('typddeRef') typeLabel!: NodeLabelComponent;
  @ViewChild('nameRef') nameLabel!: NodeLabelComponent;
  @ViewChild('outAnchor') outAnchor!: ElementRef;

  @Input() grid!: GridComponent;
  @Input() minWidth: number = 100;
  @Input() attribute!: Attribute;
  @Output() escape = new EventEmitter();

  constructor(public nodeService: NodeService) { }

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
