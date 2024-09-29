import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Entity } from '../../models/data.model';
import { GridComponent } from '../../components/grid/grid.component';

@Component({
  selector: 'swd-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  @ViewChild('grid') gridComponent!: GridComponent;

  isPicking = false;
  pickerTransform = '';
  selected = -1;

  entities: [Entity, { x: number, y: number }][] = [
    [{
      name: 'User', attributes: [
        { isKey: true, name: 'id', type: 'INT' },
        { isKey: false, name: 'firstname', type: 'VARCHAR(100)' },
        { isKey: false, name: 'lastname', type: 'VARCHAR(100)' },
      ]
    }, {
      x: 0,
      y: 0,
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
      console.log(this.selected, event);
      if (this.selected === 1) {
        const { x, y } = this.gridComponent.clientToGrid(event.clientX, event.clientY);
        this.entities.push([{ name: 'NewEntity', attributes: [] }, { x, y }]);
      }
    }
    this.isPicking = false;
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
