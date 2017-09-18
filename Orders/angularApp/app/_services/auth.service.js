"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/operator/map");
var myGlobals = require("../global");
var http_2 = require("@angular/http");
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.serviceBase = myGlobals.ngAuthSettings.apiServiceBaseUri;
        this.authServiceFactory = {};
        this._authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false
        };
        this.externalAuthData = {
            provider: "",
            userName: "",
            externalAccessToken: ""
        };
        var authData = JSON.parse(localStorage.getItem('authorizationData'));
        if (authData) {
            this._authentication.isAuth = true;
            this._authentication.userName = authData.userName;
            this._authentication.useRefreshTokens = authData.useRefreshTokens;
        }
    }
    AuthService.prototype.saveRegistration = function (registration) {
        this.logOut();
        return this.http.post(myGlobals.restEndPoint + 'api/account/register', registration).map(function (response) { return response; }).catch(function (err) {
            return rxjs_1.Observable.throw(err);
        });
    };
    ;
    AuthService.prototype.login = function (loginData) {
        var _this = this;
        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + myGlobals.ngAuthSettings.clientId;
        }
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(myGlobals.restEndPoint + 'token', data, options).map(function (response) {
            var responseAnswer = response.json();
            if (loginData.useRefreshTokens) {
                localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: loginData.userName, refreshToken: responseAnswer.refresh_token, useRefreshTokens: true }));
            }
            else {
                localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false }));
            }
            _this._authentication.isAuth = true;
            _this._authentication.userName = loginData.userName;
            _this._authentication.useRefreshTokens = loginData.useRefreshTokens;
        }).catch(function (err) {
            _this.logOut();
            return rxjs_1.Observable.throw(err);
        });
    };
    ;
    AuthService.prototype.logOut = function () {
        localStorage.removeItem('authorizationData');
        this._authentication.isAuth = false;
        this._authentication.userName = "";
        this._authentication.useRefreshTokens = false;
    };
    ;
    AuthService.prototype.refreshToken = function () {
        var _this = this;
        var authData = JSON.parse(localStorage.getItem('authorizationData'));
        if (authData) {
            if (authData.useRefreshTokens) {
                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + myGlobals.ngAuthSettings.clientId;
                localStorage.removeItem('authorizationData');
                var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
                var options = new http_1.RequestOptions({ headers: headers });
                return this.http.post(myGlobals.restEndPoint + 'token', data, options).map(function (response) {
                    var responseAnswer = response.json();
                    localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: responseAnswer.userName, refreshToken: responseAnswer.refresh_token, useRefreshTokens: true }));
                    return response.json();
                }).catch(function (err) {
                    _this.logOut();
                    return rxjs_1.Observable.throw(err);
                });
            }
        }
    };
    ;
    AuthService.prototype.obtainAccessToken = function (externalData) {
        var _this = this;
        var myParams = new http_2.URLSearchParams();
        myParams.append('provider', externalData.provider);
        myParams.append('externalAccessToken', externalData.externalAccessToken);
        var options = new http_1.RequestOptions({ search: myParams });
        return this.http.get(myGlobals.restEndPoint + 'api/account/ObtainLocalAccessToken', options).map(function (response) {
            var responseAnswer = response.json();
            localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: responseAnswer.userName, refreshToken: "", useRefreshTokens: false }));
            _this._authentication.isAuth = true;
            _this._authentication.userName = responseAnswer.userName;
            _this._authentication.useRefreshTokens = false;
        }).catch(function (err) {
            _this.logOut();
            return rxjs_1.Observable.throw(err);
        });
    };
    ;
    AuthService.prototype.registerExternal = function (registerExternalData) {
        var _this = this;
        return this.http.post(myGlobals.restEndPoint + 'api/account/registerexternal', registerExternalData).map(function (response) {
            var responseAnswer = JSON.parse(response.text());
            localStorage.setItem('authorizationData', JSON.stringify({ token: responseAnswer.access_token, userName: responseAnswer.userName, refreshToken: "", useRefreshTokens: false }));
            _this._authentication.isAuth = true;
            _this._authentication.userName = responseAnswer.userName;
            _this._authentication.useRefreshTokens = false;
        }).catch(function (err) {
            _this.logOut();
            return rxjs_1.Observable.throw(err);
        });
    };
    ;
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map