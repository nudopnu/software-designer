import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, computed, EventEmitter, HostListener, inject, input, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AttributeStore } from '../../models/attribute.store';
import { Table } from '../../models/data.model';
import { TableEntity, toAttributeEntity } from '../../models/entities.model';
import { TableStore } from '../../models/entity.store';
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

  entity = input.required<TableEntity>();
  attributes = computed(() => this.attributeStore.entities().filter(attr => attr.parent.id === this.entity().id))
  entityStore = inject(TableStore);
  attributeStore = inject(AttributeStore);
  nodeService = inject(NodeService);
  cdr = inject(ChangeDetectorRef);

  @ViewChild('title') titleComponent!: NodeLabelComponent;
  @ViewChildren('attributes') attributeComponents!: QueryList<NodeAttributeComponent>;
  @Input() grid!: GridComponent;
  @Input() hue = 210;
  @Input() readonly = false;
  @Output() entityChange = new EventEmitter<Table>();

  bgColor = '';
  isEditing = false;
  hovered = false;

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

  onEscapeTitle(newTitle: string) {
    this.entityStore.setEntityName(this.entity(), newTitle);
    this.focusNthAttribute();
  }

  focusNthAttribute(n = 0) {
    let nthComponent = this.attributeComponents.get(n);
    if (n >= this.entity().attributes.length) {
      this.attributeStore.addAttribute(toAttributeEntity(this.entity(), {
        keyType: 'none',
        name: '',
        type: '',
      }));
      this.cdr.detectChanges();
      console.log(this.attributeComponents, n);
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
    this.nodeService.setDestination(this.entity());
    this.hovered = true;
    event.stopPropagation();
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.hovered = false;
    this.nodeService.setDestination(undefined);
  }

}
