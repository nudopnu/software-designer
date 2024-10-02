import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';

@Component({
  selector: 'swd-sortable',
  templateUrl: './sortable.component.html',
  styleUrl: './sortable.component.css'
})
export class SortableComponent<T> implements OnChanges {

  @Input() templateRef!: TemplateRef<any>;
  @Input() items: T[] = [];

  expanded: { before: boolean, after: boolean }[] = [];
  draggedIdx = -1;
  toExchangeIdx = -1;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.expanded = this.items.map(item => ({
      before: false,
      after: false,
    }));
  }

  onDragStart(event: DragEvent, index: number) {
    console.log(event, index);
    this.draggedIdx = index;
    this.toExchangeIdx = index;
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    event.stopPropagation();
  }

  onDragEnd(event: DragEvent) {
    const newItems = [] as T[];
    this.items.forEach((item, idx) => {
      if (idx === this.draggedIdx) { return; }
      if (idx === this.toExchangeIdx) {
        if (this.toExchangeIdx < this.draggedIdx) {
          newItems.push(this.items[this.draggedIdx]);
          newItems.push(item);
        } else {
          newItems.push(item);
          newItems.push(this.items[this.draggedIdx]);
        }
      } else {
        newItems.push(item);
      }
    });
    this.items = newItems;
    this.expanded = this.items.map(item => ({
      before: false,
      after: false,
    }));
    this.cdr.detectChanges();
  }

  onDragOver(event: DragEvent, index: number) {
    this.expanded = this.items.map((item, idx) => ({
      before: this.draggedIdx > index && idx === index,
      after: this.draggedIdx < index && idx === index,
    }));
    console.log(index, event);
    this.toExchangeIdx = index;
  }

}

