import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'swd-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  links = [
    { label: 'Editor', link: '/documents', icon: 'form', selected: false },
  ];
  collapsed = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event.type !== 1) { return; }
      this.links = this.links.map(item => ({ ...item, selected: event.url === item.link }))
    });
  }

  navigate(link: string) {
    this.router.navigate([link]);
  }

}
