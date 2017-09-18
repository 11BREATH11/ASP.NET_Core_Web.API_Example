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
var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getUsers = function (pageNumber, pageSize) {
        // add authorization header with jwt token
        //let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        var myParams = new http_2.URLSearchParams();
        myParams.append('pageNumber', String(pageNumber));
        myParams.append('pageSize', String(pageSize));
        var options = new http_1.RequestOptions({ search: myParams });
        var url = myGlobals.restEndPoint + 'api/user';
        // get users from api
        return (this.http.get(url, options)
            .map(function (response) { return response.json(); })).catch(function (err) {
            return rxjs_1.Observable.throw(err);
        });
        ;
    };
    UserService.prototype.createUser = function (user) {
        user.Id = 0;
        //let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });        
        var url = myGlobals.restEndPoint + 'api/user';
        return (this.http.post(url, user)
            .map(function (response) { return response.json(); })).catch(function (err) {
            return rxjs_1.Observable.throw(err);
        });
    };
    UserService.prototype.deleteUser = function (id) {
        //let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        var myParams = new http_2.URLSearchParams();
        myParams.append('id', id);
        var options = new http_1.RequestOptions({ search: myParams });
        var url = myGlobals.restEndPoint + 'api/user';
        return (this.http.delete(url, options)
            .map(function (response) { return response.json(); })).catch(function (err) {
            return rxjs_1.Observable.throw(err);
        });
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map