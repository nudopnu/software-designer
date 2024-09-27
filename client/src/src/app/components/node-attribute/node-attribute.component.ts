import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NodeLabelComponent } from '../node-label/node-label.component';

@Component({
  selector: 'swd-node-attribute',
  templateUrl: './node-attribute.component.html',
  styleUrl: './node-attribute.component.css'
})
export class NodeAttributeComponent {

  @ViewChild('attribute') attributeElementRef!: ElementRef;
  @ViewChild('typddeRef') typeLabel!: NodeLabelComponent;
  @ViewChild('nameRef') nameLabel!: NodeLabelComponent;

  @Input() name: string = "Name";
  @Input() type: string = "";

  @Output() escape = new EventEmitter();

  focusNameElement() {
    this.nameLabel.focus();
  }

  focusTypeElement() {
    this.typeLabel.focus();
  }

}
