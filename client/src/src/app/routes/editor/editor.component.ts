import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component';
import { Table } from '../../models/data.model';
import { NodeService } from '../../services/node-service.service';
import { TableStore } from '../../models/entity.store';
import { toTableEntity } from '../../models/entities.model';
import { AttributeStore } from '../../models/attribute.store';

@Component({
  selector: 'swd-editor',
  templateUrl: './editor.component.html',
  providers: [TableStore],
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  @ViewChild('grid') gridComponent!: GridComponent;

  entityStore = inject(TableStore);
  attributeStore = inject(AttributeStore);
  hostRef = inject(ElementRef);
  nodeService = inject(NodeService);
  isPicking = false;
  isConnecting = false;
  pickerTransform = '';
  menuSelection = -1;
  emptyEntity = toTableEntity({ name: 'Entity', attributes: [] });
  emptyViewModel = toTableEntity({ name: 'ViewModel', attributes: [] });

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button !== 2) { return; }
    this.isPicking = true;
    const hostElement = this.hostRef.nativeElement as HTMLLegendElement;
    const hostOrigin = hostElement.getBoundingClientRect();
    this.pickerTransform = `translate(${event.clientX - hostOrigin.x}px, ${event.clientY - hostOrigin.y}px)`;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isPicking) {
      if (this.menuSelection === 1) {
        const { x, y } = this.gridComponent.clientToGrid(event);
        const entity: Table = { name: 'NewEntity', attributes: [] };
        this.entityStore.addEntity(entity, { x, y });
      }
    }
    this.isPicking = false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Delete') { return; }
    this.entityStore.deleteSelectedEntities();
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
