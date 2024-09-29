import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'swd-picker',
  templateUrl: './picker.component.html',
  styleUrl: './picker.component.css'
})
export class PickerComponent implements AfterViewInit {

  @ViewChild('items') itemsRef!: ElementRef;

  @Input() selected = -1;
  @Output() selectedChange = new EventEmitter<number>();

  ngAfterViewInit(): void {
    const hostElement = this.itemsRef.nativeElement as HTMLElement;
    const children = Array.from(hostElement.children) as HTMLElement[];
    children.forEach((child, idx) => {
      const r = 100;
      const phi = (360 / children.length) * idx;
      child.style.position = 'absolute';
      child.style.transformOrigin = 'center';
      child.style.transform = this.polarToCss(r, phi);
    });
  }

  polarToCss(r: number, phi: number) {
    const x = Math.cos((phi / 360) * 2 * Math.PI) * r;
    const y = Math.sin((phi / 360) * 2 * Math.PI) * r;
    return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Get mouse phi
    const itemsElement = this.itemsRef.nativeElement as HTMLElement;
    const itemsOrigin = itemsElement.getBoundingClientRect();
    const dx = event.clientX - itemsOrigin.x;
    const dy = event.clientY - itemsOrigin.y;
    const phi = (360 + 360 * Math.atan2(dy, dx) / (2 * Math.PI)) % 360;

    const hostElement = this.itemsRef.nativeElement as HTMLElement;
    const children = Array.from(hostElement.children) as HTMLElement[];
    children.forEach((child, idx) => {
      const frac = 360 / children.length;

      const start = (frac * (idx - 0.5) + 360) % 360;
      const end = (frac * (idx + 0.5) + 360) % 360;

      if ((phi < start || phi > end) && idx !== 0 || idx === 0 && (phi < start && phi > end)) {
        child.style.fontWeight = '';
        return;
      }
      child.style.fontWeight = 'bold';
      this.selected = idx;
      this.selectedChange.emit(this.selected);
    });
  }

}
