import { Component } from '@angular/core';
import { AuthService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id.toString(),
  template: require('./associate.component.html')
})
export class AssociateComponent {
    constructor(private authService: AuthService, private router: Router) {}

    savedSuccessfully = false;
    message = "";

    userName: string;

    registerData = {
        userName: this.authService.externalAuthData.userName,
        provider: this.authService.externalAuthData.provider,
        externalAccessToken: this.authService.externalAuthData.externalAccessToken
    };


    startTimer() {

        var timer = setTimeout(() => {
                this.router.navigateByUrl('/users');
            },
            2000);
    }

    registerExternal() {

        this.authService.registerExternal(this.registerData).subscribe(
            (response) => {

                this.savedSuccessfully = true;
                this
                    .message =
                    "User has been registered successfully, you will be redicted to login page in 2 seconds.";
                this.startTimer();

            },
            (err) => {
							var errors = [];
							var data = JSON.parse(err.text());
							for (var key in data) {
								for (var i = 0; i < data[key].length; i++) {
											errors.push(data[key][i]);
                    }
                }
                this.message = "Failed to register user due to:" + errors.join(' ');
            });
    };

};