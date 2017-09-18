import { Component } from '@angular/core';
import { AuthService } from './_services/index';
import { Router } from '@angular/router';


@Component({
  moduleId: module.id.toString(),
    selector: 'my-app',
    template: require('./app.component.html')
})

export class AppComponent {

    constructor(private authService: AuthService,private router: Router) { }

    authentication = this.authService._authentication;

    logOutWith() {
        this.authService.logOut();
        this.router.navigateByUrl('/login');
    }
}