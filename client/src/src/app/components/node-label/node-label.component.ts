import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'swd-node-label',
  templateUrl: './node-label.component.html',
  styleUrl: './node-label.component.css'
})
export class NodeLabelComponent implements OnInit {

  @Input() value = '';
  @Input() requestNextCodes = ['Space', 'Tab', 'Enter'];
  @Input() casing: 'None' | 'ALL_CAPS' | 'CAP' = 'None';
  @Output() escape = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('input') inputRef!: ElementRef;

  initialValue = "";

  ngOnInit(): void {
    this.initialValue = this.value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const unicode = event.key.charCodeAt(0);
    const isAscii = unicode >= 0 && unicode <= 127;
    const isSpacebar = this.requestNextCodes.some(code => code === event.code);

    // Check if empty string now
    const selection = document.getSelection();
    const range = selection?.getRangeAt(0);
    const isDeletingAll = false
      || this.value.length === 1 && event.key === 'Backspace' && range?.startOffset === 1
      || this.value.length === 1 && event.key === 'Delete' && range?.startOffset === 0
      || (event.key === 'Delete' || event.key === 'Backspace') && range?.toString().length === this.value.length
      ;
    if (isDeletingAll) {
      this.inputRef.nativeElement.replaceChildren();
      event.preventDefault();
      this.value = "";
    }

    if(event.key === 'Delete') {
      event.stopImmediatePropagation();
    }

    if (event.shiftKey || event.ctrlKey || event.altKey) { return; }

    if (isAscii && !isSpacebar) {
      if (this.casing === 'None') { return; }
      const isAllCaps = this.casing === 'ALL_CAPS';
      const selection = window.getSelection();
      const isFirstLetter = selection && selection.getRangeAt(0).startOffset === 0;
      if (isAllCaps || this.casing === 'CAP' && isFirstLetter) { this.upperCase(event); }
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    this.escape.emit(event.key);
  }

  onInput(event: Event) {
    const newText = (event.target as HTMLSpanElement).innerText;
    this.value = newText;
    this.valueChange.emit(this.value);
  }

  upperCase(event: KeyboardEvent) {
    // Check if the pressed key is a letter
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      // Prevent the default action to stop the lowercase character from appearing
      event.preventDefault();

      // Get the uppercase version of the pressed key
      const uppercaseKey = event.key.toUpperCase();

      // Get the current selection
      const selection = window.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0); // Get the current range (cursor position)

        // Delete the current selection (if any)
        range.deleteContents();

        // Create a text node with the uppercase letter and insert it at the cursor position
        const textNode = document.createTextNode(uppercaseKey);
        range.insertNode(textNode);

        // Move the cursor to the right after the inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(_event: FocusEvent) {
    const selection = window.getSelection();
    if (!selection) { return; }
    const newRange = document.createRange();
    newRange.selectNodeContents(this.inputRef.nativeElement)
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  @HostListener('document:mousedown', ['$event'])
  onBlur(event: Event) {
    const selection = window.getSelection();
    if (!selection) { return; }
    selection.removeAllRanges();
  }

  focus() {
    this.inputRef.nativeElement.focus();
  }

}
