"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var index_1 = require("./_guards/index");
var index_2 = require("./_services/index");
var index_3 = require("./login/index");
var index_4 = require("./users/index");
var index_5 = require("./pets/index");
var index_6 = require("./refresh/index");
var index_7 = require("./signup/index");
var index_8 = require("./associate/index");
var http_1 = require("@angular/http");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_1.routing,
            ngx_bootstrap_1.PaginationModule.forRoot()
        ],
        declarations: [
            app_component_1.AppComponent,
            index_3.LoginComponent,
            index_4.UsersComponent,
            index_5.PetsComponent,
            index_6.RefreshComponent,
            index_7.SignupComponent,
            index_8.AssociateComponent
        ],
        providers: [
            index_1.AuthGuard,
            index_2.AuthService,
            index_2.UserService,
            index_2.PetService,
            index_2.AuthInterceptorService,
            common_1.HashLocationStrategy,
            {
                provide: http_1.Http,
                useFactory: function (backend, defaultOptions, injector) { return new index_2.AuthInterceptorService(backend, defaultOptions, injector); },
                deps: [http_1.XHRBackend, http_1.RequestOptions, core_1.Injector]
            }
            // providers used to create fake backend
            /*fakeBackendProvider,
            MockBackend,
            BaseRequestOptions*/
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map