import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[swdSelectable]'
})
export class SelectableDirective implements OnChanges {

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setSelected(this.selected);
  }

  @Input() selected: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>();

  @HostListener('document:mousedown', ['$event'])
  onBlur(event: MouseEvent) {
    this.setSelected(this.elementRef.nativeElement.contains(event.target));
  }

  setSelected(value: boolean) {
    this.selected = value;
    const element = this.elementRef.nativeElement as HTMLElement;
    element.setAttribute('selected', `${this.selected}`);
    this.selectedChange.emit(this.selected);
  }

}
