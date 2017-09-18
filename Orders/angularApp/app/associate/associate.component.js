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
var index_1 = require("../_services/index");
var router_1 = require("@angular/router");
var AssociateComponent = (function () {
    function AssociateComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.savedSuccessfully = false;
        this.message = "";
        this.registerData = {
            userName: this.authService.externalAuthData.userName,
            provider: this.authService.externalAuthData.provider,
            externalAccessToken: this.authService.externalAuthData.externalAccessToken
        };
    }
    AssociateComponent.prototype.startTimer = function () {
        var _this = this;
        var timer = setTimeout(function () {
            _this.router.navigateByUrl('/users');
        }, 2000);
    };
    AssociateComponent.prototype.registerExternal = function () {
        var _this = this;
        this.authService.registerExternal(this.registerData).subscribe(function (response) {
            _this.savedSuccessfully = true;
            _this
                .message =
                "User has been registered successfully, you will be redicted to login page in 2 seconds.";
            _this.startTimer();
        }, function (err) {
            var errors = [];
            var data = JSON.parse(err.text());
            for (var key in data) {
                for (var i = 0; i < data[key].length; i++) {
                    errors.push(data[key][i]);
                }
            }
            _this.message = "Failed to register user due to:" + errors.join(' ');
        });
    };
    ;
    return AssociateComponent;
}());
AssociateComponent = __decorate([
    core_1.Component({
        moduleId: module.id.toString(),
        template: require('./associate.component.html')
    }),
    __metadata("design:paramtypes", [index_1.AuthService, router_1.Router])
], AssociateComponent);
exports.AssociateComponent = AssociateComponent;
;
//# sourceMappingURL=associate.component.js.map