import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, input, Input, QueryList, ViewChild, viewChild, ViewChildren } from '@angular/core';
import { Entity } from '../../models/data.model';
import { NodeAttributeComponent } from '../node-attribute/node-attribute.component';
import { NodeLabelComponent } from '../node-label/node-label.component';

@Component({
  selector: 'swd-node',
  templateUrl: './node.component.html',
  styleUrl: './node.component.css'
})
export class NodeComponent implements AfterContentInit, AfterViewInit {

  @ViewChild('title') titleComponent!: NodeLabelComponent;
  @ViewChildren('attributes') attributeComponents!: QueryList<NodeAttributeComponent>;
  @Input() hue = 210;
  @Input() entity: Entity = {
    name: "Entity",
    attributes: [],
  };
  @Input() readonly = false;

  bgColor = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    if (this.readonly) { return; }
    this.titleComponent.focus();
  }

  ngAfterContentInit(): void {
    this.bgColor = `radial-gradient(50% 90%, hsla(${this.hue}, 52%, 51%, 0.62) 0%, transparent 80%)`
  }

  focusNthAttribute(n = 0) {
    let nthComponent = this.attributeComponents.get(n);
    if (n >= this.entity.attributes.length) {
      this.entity.attributes.push({ isKey: false, name: "", type: "" });
      this.cdr.detectChanges();
      nthComponent = this.attributeComponents.get(n);
    }
    nthComponent!.focusNameElement();
  }

}
