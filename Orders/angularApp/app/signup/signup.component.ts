import { Component } from '@angular/core';
import { AuthService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id.toString(),
  template: require('./signup.component.html')
})

export class SignupComponent 
{
    constructor(private authService: AuthService, private router: Router) { }
    
    savedSuccessfully = false;
    message = "";

    registration = {
        userName: "",
        password: "",
        confirmPassword: ""
		};

		disableButton(btn, isDisable) {
			btn.disabled = isDisable;
			var spanButton = btn.getElementsByTagName("span");
			if (isDisable) {
				spanButton[0].style.display = "";
			} else {
				spanButton[0].style.display = "none";
			}
		}

		signUp(event) {

			var target = event.target || event.srcElement || event.currentTarget;

			var button = target.getElementsByTagName("button");

			this.disableButton(button[0], true);

        this.authService.saveRegistration(this.registration).subscribe(
            (response) => {

								this.disableButton(button[0], false);
								this.savedSuccessfully = true;
                this.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
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

    startTimer() {

        var timer = setTimeout(() => {
                this.router.navigateByUrl('/login');
        }, 2000);
    }
}