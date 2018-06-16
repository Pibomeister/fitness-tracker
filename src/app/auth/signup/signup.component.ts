import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UIService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  
  isLoading = false;
  maxDate: Date;
  loadingSub: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) { }

  public ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    }); 
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  public ngOnDestroy(): void {
    if(this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }

  public onSubmit(form: NgForm): void {
    this.authService.registerUser({
      email: form.value['email'],
      password: form.value['password']
    });
  }

}
