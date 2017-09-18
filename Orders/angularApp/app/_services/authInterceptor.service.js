"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var router_1 = require("@angular/router");
var Rx_1 = require("rxjs/Rx");
var index_1 = require("./index");
var AuthInterceptorService = (function (_super) {
    __extends(AuthInterceptorService, _super);
    function AuthInterceptorService(backend, defaultOptions, injector) {
        var _this = _super.call(this, backend, defaultOptions) || this;
        _this.injector = injector;
        return _this;
    }
    Object.defineProperty(AuthInterceptorService.prototype, "router", {
        get: function () {
            return this.injector.get(router_1.Router);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthInterceptorService.prototype, "authService", {
        get: function () {
            return this.injector.get(index_1.AuthService);
        },
        enumerable: true,
        configurable: true
    });
    AuthInterceptorService.prototype.request = function (url, options) {
        if (typeof url === 'string') {
            if (!options) {
                options = { headers: new http_1.Headers() };
            }
            this.setHeaders(options);
        }
        else {
            this.setHeaders(url);
        }
        return _super.prototype.request.call(this, url, this.getRequestOptionArgs(options)).catch(this.catchErrors());
    };
    AuthInterceptorService.prototype.catchErrors = function () {
        var _this = this;
        return function (res) {
            if (res.status === 401 || res.status === 403) {
                var authData = JSON.parse(localStorage.getItem('authorizationData'));
                if (authData) {
                    if (authData.useRefreshTokens) {
                        _this.router.navigateByUrl('/refresh');
                    }
                }
                _this.authService.logOut();
                _this.router.navigateByUrl('/login');
            }
            return Rx_1.Observable.throw(res);
        };
    };
    AuthInterceptorService.prototype.setHeaders = function (objectToSetHeadersTo) {
        var authData = JSON.parse(localStorage.getItem('authorizationData'));
        if (authData) {
            objectToSetHeadersTo.headers.set('Authorization', 'Bearer ' + authData.token);
        }
    };
    AuthInterceptorService.prototype.getRequestOptionArgs = function (options) {
        if (options == null) {
            options = new http_1.RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new http_1.Headers();
        }
        /*options.headers.append('Access-Control-Allow-Origin', '*');
        options.headers.append('Access-Control-Allow-Headers', 'Content-Type');
        options.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');*/
        return options;
    };
    return AuthInterceptorService;
}(http_1.Http));
AuthInterceptorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.ConnectionBackend, http_1.RequestOptions, core_1.Injector])
], AuthInterceptorService);
exports.AuthInterceptorService = AuthInterceptorService;
//# sourceMappingURL=authInterceptor.service.js.map