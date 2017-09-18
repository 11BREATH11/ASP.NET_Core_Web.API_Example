"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_1 = require("./login/index");
var index_2 = require("./users/index");
var index_3 = require("./pets/index");
var index_4 = require("./_guards/index");
var index_5 = require("./refresh/index");
var index_6 = require("./signup/index");
var index_7 = require("./associate/index");
var appRoutes = [
    { path: 'login', component: index_1.LoginComponent },
    { path: 'users', component: index_2.UsersComponent, canActivate: [index_4.AuthGuard] },
    { path: 'pet/:id', component: index_3.PetsComponent, canActivate: [index_4.AuthGuard] },
    { path: '', component: index_2.UsersComponent, canActivate: [index_4.AuthGuard] },
    { path: 'refresh', component: index_5.RefreshComponent },
    { path: 'signup', component: index_6.SignupComponent },
    { path: 'associate', component: index_7.AssociateComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map