import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { Entity, EntityViewMdel } from '../../models/data.model';
import { NodeService } from '../../services/node-service.service';
import { GridComponent } from '../grid/grid.component';
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
  @Input() grid!: GridComponent;
  @Input() hue = 210;
  @Input() entity!: EntityViewMdel
  @Input() readonly = false;
  @Output() entityChange = new EventEmitter<Entity>();

  bgColor = '';
  isEditing = false;
  hovered = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private nodeService: NodeService,
  ) { }

  ngAfterViewInit(): void {
    if (this.readonly) { return; }
    this.titleComponent.focus();
  }

  ngAfterContentInit(): void {
    this.bgColor = `radial-gradient(50% 90%, hsla(${this.hue}, 52%, 51%, 0.62) 0%, transparent 80%)`
  }

  onMouseDownOnAttribute(event: MouseEvent) {
    console.log(event);
    this.isEditing = true;
  }

  focusNthAttribute(n = 0) {
    let nthComponent = this.attributeComponents.get(n);
    if (n >= this.entity.attributes.length) {
      this.entity.attributes.push(this.nodeService.toAttributeViewModel({ keyType: 'none', name: "", type: 'None' }));
      this.cdr.detectChanges();
      nthComponent = this.attributeComponents.get(n);
    }
    nthComponent!.focusNameElement();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp($event: DragEvent) {
    this.nodeService.abortConnecting();
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (!this.nodeService.isConnecting || !this.nodeService.connectionStart) { return; }
    console.log(this.nodeService.connectionStart.entity, this.entity);
    this.nodeService.setDestination(this.entity);
    this.hovered = true;
    event.stopPropagation();
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.hovered = false;
    this.nodeService.setDestination(undefined);
  }

}
