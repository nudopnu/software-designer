import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component';
import { NodeService } from '../../services/node-service.service';
import { Entity, EntityViewMdel } from '../../models/data.model';

@Component({
  selector: 'swd-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  @ViewChild('grid') gridComponent!: GridComponent;

  isPicking = false;
  isConnecting = false;
  pickerTransform = '';
  menuSelection = -1;
  emptyEntity: EntityViewMdel;
  emptyViewModel: EntityViewMdel;

  constructor(
    private hostRef: ElementRef,
    public nodeService: NodeService,
  ) {
    this.emptyEntity = this.nodeService.toEntityViewModel({ name: 'Entity', attributes: [] });
    this.emptyViewModel = this.nodeService.toEntityViewModel({ name: 'ViewModel', attributes: [] });
  }

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
        const entity: Entity = { name: 'NewEntity', attributes: [] };
        this.nodeService.addEntity(entity, { x, y });
      }
    }
    this.isPicking = false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.nodeService.nodes.update(nodes => [...nodes.filter(node => !node.selected())]);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
