import { Component, ElementRef, HostListener } from '@angular/core';
import { Entity } from '../../models/data.model';

@Component({
  selector: 'swd-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  isPicking = false;
  pickerTransform = '';
  selected = -1;

  entities: Entity[] = [
    {
      name: 'User', attributes: [
        { isKey: true, name: 'id', type: 'INT' },
        { isKey: false, name: 'firstname', type: 'VARCHAR(100)' },
        { isKey: false, name: 'lastname', type: 'VARCHAR(100)' },
      ]
    }
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
      console.log(this.selected);
      if (this.selected === 1) {
        this.entities.push({ name: 'NewEntity', attributes: [] });
      }
    }
    this.isPicking = false;
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
