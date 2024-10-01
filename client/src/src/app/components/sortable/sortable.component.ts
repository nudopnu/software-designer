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
    if (!changes['items']) { return; }
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
    const tmp = this.items[this.draggedIdx]
    this.items[this.draggedIdx] = this.items[this.toExchangeIdx];
    this.items[this.toExchangeIdx] = tmp;
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

