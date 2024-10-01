import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'swd-sortable',
  templateUrl: './sortable.component.html',
  styleUrl: './sortable.component.css'
})
export class SortableComponent<T> {

  @Input() templateRef!: TemplateRef<any>;
  @Input() items: T[] = [];

  onDragStart(event: DragEvent) {
    console.log(event);
    const selection = window.getSelection();
    if(selection) {
      selection.removeAllRanges();
    }
    event.stopPropagation();
  }

}

