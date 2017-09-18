import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../_services/index';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, public authService: AuthService ) { }

    canActivate() {
        if (this.authService._authentication.userName != "" ) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}