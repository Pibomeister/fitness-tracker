import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';

import { AuthService } from './auth/auth.service';
import * as fromRoot from './app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuth$: Observable<boolean>;

  constructor(private authservice: AuthService, private store: Store<fromRoot.State>) {}

  public ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    this.authservice.initAuthListener();
  }

  public onLogout(): void {
    this.authservice.logout();
  }

}
