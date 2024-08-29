import { Component, HostListener } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
  selector: 'swd-explorer',
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css'
})
export class ExplorerComponent {

  nodes = [
    {
      title: 'Use Cases',
      key: '00',
      expanded: true,
      selectable: false,
      children: [
        { title: 'Use Case 0', key: '1000', isLeaf: true },
        { title: 'Use Case 1', key: '1001', isLeaf: true },
        { title: 'Use Case 2', key: '1002', isLeaf: true },
      ]
    },
    {
      title: 'Users',
      key: '01',
      expanded: true,
      selectable: false,
      draggable: false,
      children: [
        { title: 'User 0', key: '2000', isLeaf: true },
        { title: 'User 1', key: '2001', isLeaf: true },
        { title: 'User 2', key: '2002', isLeaf: true },
      ]
    },
    {
      title: 'Entities',
      key: '02',
      expanded: true,
      selectable: false,
      draggable: false,
      children: [
        { title: 'Entity 0', key: '3000', isLeaf: true },
        { title: 'Entity 1', key: '3001', isLeaf: true },
        { title: 'Entity 2', key: '3002', isLeaf: true },
      ]
    },
  ];
  multiSelect = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!event.ctrlKey) { return; }
    this.multiSelect = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.multiSelect = false;
  }

  @HostListener('blur')
  onBlur() {
    this.multiSelect = false;
  }

  nzClick(event: NzFormatEmitEvent): void {
    if (event.node && event.node.isLeaf) {
      console.log(event.node);
    } else {
      const target = event.event?.target as HTMLElement;
      let parent = target.parentElement as HTMLElement;
      while (parent.nodeName !== 'NZ-TREE-NODE') {
        parent = parent.parentElement!;
      }
      const switcher = parent.children[1] as HTMLElement;
      switcher.click();
    }
  }
}
