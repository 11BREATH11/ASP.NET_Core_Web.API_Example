import { Component } from '@angular/core';
import { AuthService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id.toString(),
  template: require('./refresh.component.html')
})

export class RefreshComponent 
{
    constructor(private authService: AuthService, private router: Router) { }
    
    authentication = this.authService._authentication;
    tokenRefreshed = false;
    tokenResponse = null;

    refreshToken() {

        this.authService.refreshToken().subscribe(
            (data) => {
                this.tokenRefreshed = true;
                this.tokenResponse = data;
                this.tokenResponse.access_token = this.tokenResponse.access_token.substr(0, 120);
            },
            (err) => {
                this.router.navigateByUrl('/login');
            }
        );
    };
}