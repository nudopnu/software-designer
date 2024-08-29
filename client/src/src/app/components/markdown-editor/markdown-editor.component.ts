import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import EasyMDE from 'easymde';

@Component({
  selector: 'swd-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.css'
})
export class MarkdownEditorComponent implements AfterViewInit {

  @ViewChild('markdown') markdownElementRef!: ElementRef;

  ngAfterViewInit(): void {
    const easymde = new EasyMDE({
      element: this.markdownElementRef.nativeElement,
      initialValue: "# Hello world!",
      toolbar: false,
      spellChecker: false,
      status: false,
    });
    // EasyMDE.togglePreview(easymde);
  }

}
