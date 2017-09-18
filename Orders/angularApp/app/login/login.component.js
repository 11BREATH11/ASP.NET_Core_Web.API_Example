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
var router_1 = require("@angular/router");
var index_1 = require("../_services/index");
var myGlobals = require("../global");
var LoginComponent = (function () {
    function LoginComponent(zone, router, authService) {
        this.zone = zone;
        this.router = router;
        this.authService = authService;
        this.loginData = {
            userName: "",
            password: "",
            useRefreshTokens: false
        };
        this.message = "";
    }
    LoginComponent.prototype.login = function (event) {
        var _this = this;
        var target = event.target || event.srcElement || event.currentTarget;
        var button = target.getElementsByTagName("button");
        this.disableButton(button[0], true);
        this.authService.login(this.loginData).subscribe(function (data) {
            _this.disableButton(button[0], false);
            _this.router.navigateByUrl('users');
        }, function (err) {
            _this.disableButton(button[0], false);
            _this.message = err.text();
        });
    };
    ;
    LoginComponent.prototype.disableButton = function (btn, isDisable) {
        btn.disabled = isDisable;
        var spanButton = btn.getElementsByTagName("span");
        if (isDisable) {
            spanButton[0].style.display = "";
        }
        else {
            spanButton[0].style.display = "none";
        }
    };
    LoginComponent.prototype.authExternalProvider = function (provider) {
        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
        var externalProviderUrl = myGlobals.ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
            + "&response_type=token&client_id=" + myGlobals.ngAuthSettings.clientId
            + "&redirect_uri=" + redirectUri;
        window["windowScope"] = this;
        this.router.navigateByUrl('/users');
        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };
    ;
    LoginComponent.prototype.authCompletedCB = function (fragment) {
        var thisMy = window["windowScope"];
        if (fragment.haslocalaccount == 'False') {
            thisMy.authService.logOut();
            thisMy.authService.externalAuthData = {
                provider: fragment.provider,
                userName: fragment.external_user_name,
                externalAccessToken: fragment.external_access_token
            };
            thisMy.zone.run(function () {
                thisMy.router.navigateByUrl('/associate');
            });
        }
        else {
            //Obtain access token and redirect to users
            var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
            thisMy.authService.obtainAccessToken(externalData).subscribe(function (response) {
                thisMy.zone.run(function () {
                    thisMy.router.navigateByUrl('/users');
                });
            }, function (err) {
                thisMy.message = err.text();
            });
        }
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id.toString(),
        template: require('./login.component.html')
    }),
    __metadata("design:paramtypes", [core_1.NgZone,
        router_1.Router,
        index_1.AuthService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map