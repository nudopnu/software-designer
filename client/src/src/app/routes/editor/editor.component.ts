import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component';
import { NodeService } from '../../services/node-service.service';
import { Entity, Node } from '../../models/data.model';

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

  constructor(
    private hostRef: ElementRef,
    public nodeService: NodeService,
  ) { }

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
        const { x, y } = this.gridComponent.clientToGrid(event.clientX, event.clientY);
        const entity = { name: 'NewEntity', attributes: [] };
        const node: Node<Entity> = {
          data: entity,
          metadata: signal({
            x: x / this.gridComponent.zoom,
            y: y / this.gridComponent.zoom,
            selected: true,
            hovered: false,
          }),
        };
        this.nodeService.nodes.update(entities => [...entities, node]);
      }
    }
    this.isPicking = false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.nodeService.nodes.update(nodes => [...nodes.filter(node => !node.metadata().selected)]);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
