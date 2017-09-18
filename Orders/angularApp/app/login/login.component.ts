import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../_services/index';

import * as myGlobals from "../global";

@Component({
  moduleId: module.id.toString(),
  template: require('./login.component.html')
})

export class LoginComponent{
    
    constructor(
        private zone: NgZone,
        private router: Router,
        private authService: AuthService) { }

    loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };

    message = "";

		login(event) {

			var target = event.target || event.srcElement || event.currentTarget;

			var button = target.getElementsByTagName("button");

			this.disableButton(button[0], true);

        this.authService.login(this.loginData).subscribe(
					data => {                
							this.disableButton(button[0], false);
              this.router.navigateByUrl('users');  
            },
						err => {
							this.disableButton(button[0], false);
							this.message = err.text();
            }            
        );
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

    authExternalProvider(provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = myGlobals.ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
            + "&response_type=token&client_id=" + myGlobals.ngAuthSettings.clientId
            + "&redirect_uri=" + redirectUri; 

        window["windowScope"] = this; 

        this.router.navigateByUrl('/users');      

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    authCompletedCB(fragment) {

        var thisMy = window["windowScope"];

        if (fragment.haslocalaccount== 'False') {

            thisMy.authService.logOut();

            thisMy.authService.externalAuthData = {
                provider: fragment.provider,
                userName: fragment.external_user_name,
                externalAccessToken: fragment.external_access_token
            };

            thisMy.zone.run(() => {
                thisMy.router.navigateByUrl('/associate');
            });

        } else {
            //Obtain access token and redirect to users
            var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };

            thisMy.authService.obtainAccessToken(externalData).subscribe(
                (response) => {

                    thisMy.zone.run(() => {
                        thisMy.router.navigateByUrl('/users');
                    });
                    
                },
                (err) => {
                    thisMy.message = err.text();
                });
        }
    }
}
