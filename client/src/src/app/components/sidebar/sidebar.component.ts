import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'swd-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnDestroy{
  links = [
    { label: 'Editor', link: '/editor', icon: 'form', selected: false },
  ];
  collapsed = true;
  subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = this.router.events.subscribe(event => {
      if (event.type !== 1) { return; }
      this.links = this.links.map(item => ({ ...item, selected: event.url === item.link }))
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigate(link: string) {
    this.router.navigate([link]);
  }

}
