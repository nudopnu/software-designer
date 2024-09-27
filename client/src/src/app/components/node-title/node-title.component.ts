import { Component, ElementRef, EventEmitter, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'swd-node-title',
  templateUrl: './node-title.component.html',
  styleUrl: './node-title.component.css'
})
export class NodeTitleComponent {

  @Input() textAlign: string = "center";
  @Input() value: string = "";
  @Input() valueChage = new EventEmitter<string>();

  @ViewChild('input') inputElementRef!: ElementRef;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const inputElement = this.inputElementRef.nativeElement as HTMLInputElement;
    inputElement.select();
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code !== "Enter" && event.code !== "NumpadEnter") { return; }
    const inputElement = this.inputElementRef.nativeElement as HTMLInputElement;
    inputElement.blur();
  }

}
