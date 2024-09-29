import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { NodeAttributeComponent } from '../node-attribute/node-attribute.component';
import { Attribute } from '../../models/data.model';

@Component({
  selector: 'swd-node',
  templateUrl: './node.component.html',
  styleUrl: './node.component.css'
})
export class NodeComponent {

  @ViewChildren('attributes') attributeComponents!: QueryList<NodeAttributeComponent>;

  attributes: Attribute[] = [
    { isKey: true, name: "id", type: "INT" },
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  focusNthAttribute(n = 0) {
    let nthComponent = this.attributeComponents.get(n);
    if (n >= this.attributes.length) {
      this.attributes.push({ isKey: false, name: "", type: "" });
      this.cdr.detectChanges();
      nthComponent = this.attributeComponents.get(n);
    }
    nthComponent!.focusNameElement();
  }

}
