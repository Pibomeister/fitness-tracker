import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { 
    Router, 
    CanLoad, 
    Route
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanLoad {

    constructor(private authService: AuthService, private router: Router) {}

    canLoad(route: Route) {
        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}
