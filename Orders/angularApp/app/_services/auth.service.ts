import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import * as myGlobals from "../global";
import { URLSearchParams } from '@angular/http';

import { AuthAnswer } from '../_models/index';

@Injectable()
export class AuthService {

    constructor(
        private http: Http) {

        var authData = JSON.parse(localStorage.getItem('authorizationData'));
            if (authData) {
                this._authentication.isAuth = true;
                this._authentication.userName = authData.userName;
                this._authentication.useRefreshTokens = authData.useRefreshTokens;
            }
    }
    
    serviceBase = myGlobals.ngAuthSettings.apiServiceBaseUri;
    authServiceFactory = {};

    _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    saveRegistration(registration: any) {

			this.logOut();			

			return this.http.post(myGlobals.restEndPoint + 'api/account/register', registration).map((response: Response) => response).catch((err: any) => {			

				return Observable.throw(err);
			}); 

    };

    login(loginData: any): Observable<AuthAnswer> {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + myGlobals.ngAuthSettings.clientId;
        }        

        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded' });     

        let options = new RequestOptions({ headers: headers });    

        return this.http.post(myGlobals.restEndPoint + 'token', data, options).map((response: Response) => {

             let responseAnswer = response.json();            

            if (loginData.useRefreshTokens) {
                localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: loginData.userName, refreshToken: responseAnswer.refresh_token, useRefreshTokens: true }));
            }
            else {
                localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false }));
            }

            this._authentication.isAuth = true;
            this._authentication.userName = loginData.userName;
            this._authentication.useRefreshTokens = loginData.useRefreshTokens;            

        }).catch((err: any) => {
            
            this.logOut();            

            return Observable.throw(err);
        });       

    };

    logOut() {

        localStorage.removeItem('authorizationData');

        this._authentication.isAuth = false;
        this._authentication.userName = "";
        this._authentication.useRefreshTokens = false;

    };    

    refreshToken () {        

        var authData = JSON.parse(localStorage.getItem('authorizationData'));

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + myGlobals.ngAuthSettings.clientId;

                localStorage.removeItem('authorizationData');

                let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

                let options = new RequestOptions({ headers: headers });    

                return this.http.post(myGlobals.restEndPoint + 'token', data, options).map((response: Response) => {

                    let responseAnswer = response.json();                    

                    localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: responseAnswer.userName, refreshToken: responseAnswer.refresh_token, useRefreshTokens: true }));

                    return response.json();

                }).catch((err: any) => {
                    this.logOut();                   

                    return Observable.throw(err);
                });
            }
        }        
    };

    obtainAccessToken(externalData: any): Observable<AuthAnswer> {      

        let myParams = new URLSearchParams();
        myParams.append('provider', externalData.provider);
        myParams.append('externalAccessToken', externalData.externalAccessToken);        

				let options = new RequestOptions({ search: myParams });			

				return this.http.get(myGlobals.restEndPoint + 'api/account/ObtainLocalAccessToken', options).map((response: Response) => {				

            let responseAnswer = response.json();

            localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: responseAnswer.userName, refreshToken: "", useRefreshTokens: false }));

            this._authentication.isAuth = true;
            this._authentication.userName = responseAnswer.userName;
            this._authentication.useRefreshTokens = false;           
        

        }).catch((err: any) => {
            this.logOut();           

            return Observable.throw(err);

            });
    
    };

    registerExternal(registerExternalData: any): Observable<AuthAnswer> {        

        return this.http.post(myGlobals.restEndPoint + 'api/account/registerexternal', registerExternalData).map((response: Response) => {
					
					let responseAnswer = JSON.parse(response.text());

            localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: responseAnswer.userName, refreshToken: "", useRefreshTokens: false }));

            this._authentication.isAuth = true;
            this._authentication.userName = responseAnswer.userName;
            this._authentication.useRefreshTokens = false;            

        }).catch((err: any) => {
						this.logOut();						

            return Observable.throw(err);

        });
    };    
}
