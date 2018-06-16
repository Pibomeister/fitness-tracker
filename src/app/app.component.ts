import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuth$: Observable<boolean>;

  constructor(private authservice: AuthService) {}

  public ngOnInit(): void {
    this.authservice.initAuthListener();
    this.isAuth$ = this.authservice.authChange;
  }

  public onLogout(): void {
    this.authservice.logout();
  }

}
