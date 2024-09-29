import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'swd-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  isPicking = false;
  pickerTransform = '';
  selected = -1;;

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
    if(this.isPicking) {
      console.log(this.selected);
    }
    this.isPicking = false;
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
