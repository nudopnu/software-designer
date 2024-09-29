import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component';
import { Entity } from '../../models/data.model';

@Component({
  selector: 'swd-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  @ViewChild('grid') gridComponent!: GridComponent;

  isPicking = false;
  pickerTransform = '';
  menuSelection = -1;

  entities: [Entity, { x: number, y: number, selected: boolean }][] = [
    [{
      name: 'User', attributes: [
        { isKey: true, name: 'id', type: 'INT' },
        { isKey: false, name: 'firstname', type: 'VARCHAR(100)' },
        { isKey: false, name: 'lastname', type: 'VARCHAR(100)' },
      ]
    }, {
      x: 0,
      y: 0,
      selected: true,
    }]
  ];

  constructor(private hostRef: ElementRef) { }

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
        const entityProperties = {
          x: x / this.gridComponent.zoom,
          y: y / this.gridComponent.zoom,
          selected: true,
        };
        this.entities.push([entity, entityProperties]);
      }
    }
    this.isPicking = false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(event, this.entities);
    if (event.key === 'Delete') {
      this.entities = [...this.entities.filter(entity => !entity[1].selected)];
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
