import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  collapsed = false;
  mobileOpened = false;

  @Output() changeCollapse = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  collapseSidebar(): void {
    this.collapsed = !this.collapsed;
    this.changeCollapse.emit(this.collapsed);
  }

  toddleMobile($event): void {
    $event.target.getAttribute('aria-expanded') === true
      ? $event.target.setAttribute('aria-expanded', false)
      : $event.target.setAttribute('aria-expanded', true);

    $event.target.getAttribute('aria-label') === 'open menu'
      ? $event.target.setAttribute('aria-label', 'close menu')
      : $event.target.setAttribute('aria-label', 'open menu');
    this.mobileOpened = !this.mobileOpened;
  }
}
