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
var RefreshComponent = (function () {
    function RefreshComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.authentication = this.authService._authentication;
        this.tokenRefreshed = false;
        this.tokenResponse = null;
    }
    RefreshComponent.prototype.refreshToken = function () {
        var _this = this;
        this.authService.refreshToken().subscribe(function (data) {
            _this.tokenRefreshed = true;
            _this.tokenResponse = data;
            _this.tokenResponse.access_token = _this.tokenResponse.access_token.substr(0, 120);
        }, function (err) {
            _this.router.navigateByUrl('/login');
        });
    };
    ;
    return RefreshComponent;
}());
RefreshComponent = __decorate([
    core_1.Component({
        moduleId: module.id.toString(),
        template: require('./refresh.component.html')
    }),
    __metadata("design:paramtypes", [index_1.AuthService, router_1.Router])
], RefreshComponent);
exports.RefreshComponent = RefreshComponent;
//# sourceMappingURL=refresh.component.js.map