import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Input() isAuth = false;
  @Output() sidenavClose = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  constructor() { }

  public ngOnInit(): void {
  }

  public onClose(): void {
    this.sidenavClose.emit();
  }

  public onLogout(): void {
    this.sidenavClose.emit();
    this.logout.emit();
  }

}
