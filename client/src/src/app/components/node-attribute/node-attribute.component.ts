import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NodeLabelComponent } from '../node-label/node-label.component';
import { Attribute } from '../../models/data.model';

@Component({
  selector: 'swd-node-attribute',
  templateUrl: './node-attribute.component.html',
  styleUrl: './node-attribute.component.css'
})
export class NodeAttributeComponent {

  @ViewChild('attributeRef') attributeElementRef!: ElementRef;
  @ViewChild('typddeRef') typeLabel!: NodeLabelComponent;
  @ViewChild('nameRef') nameLabel!: NodeLabelComponent;

  @Input() attribute!: Attribute;
  @Output() escape = new EventEmitter();

  focusNameElement() {
    this.nameLabel.focus();
  }

  focusTypeElement() {
    this.typeLabel.focus();
  }

}
