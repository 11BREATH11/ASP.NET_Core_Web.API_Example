"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/http/testing");
var app_routing_1 = require("../../app/app.routing");
var http_1 = require("@angular/http");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var index_1 = require("../../app/login/index");
var index_2 = require("../../app/users/index");
var index_3 = require("../../app/pets/index");
var index_4 = require("../../app/refresh/index");
var index_5 = require("../../app/signup/index");
var index_6 = require("../../app/associate/index");
var common_1 = require("@angular/common");
var http_2 = require("@angular/http");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var myGlobals = require("../../app/global");
var index_7 = require("../../app/_services/index");
describe('UsersComponent', function () {
    var fixture;
    var comp;
    var actionUrl = myGlobals.ngAuthSettings.apiServiceBaseUri + "api/user?pageNumber=1&pageSize=3";
    // Multiple requests with different URL.
    var responses = {};
    var data = JSON.stringify({ items: [{ id: 1, name: "Zhenya", totalPets: 0 }], totalItems: 1 });
    responses[actionUrl] = new http_2.Response(new http_2.ResponseOptions({ body: data }));
    function expectURL(backend, responses) {
        backend.connections.subscribe(function (c) {
            var response = responses[c.request.url];
            c.mockRespond(response);
        });
    }
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            testing_1.TestBed.configureTestingModule({
                imports: [
                    platform_browser_1.BrowserModule,
                    forms_1.FormsModule,
                    http_1.HttpModule,
                    app_routing_1.routing,
                    ngx_bootstrap_1.PaginationModule.forRoot()
                ],
                providers: [
                    { provide: common_1.APP_BASE_HREF, useValue: '/' },
                    http_2.BaseRequestOptions,
                    testing_2.MockBackend,
                    index_7.UserService,
                    {
                        provide: http_2.Http, useFactory: function (backend, defaultOptions) {
                            return new http_2.Http(backend, defaultOptions);
                        }, deps: [testing_2.MockBackend, http_2.BaseRequestOptions]
                    }
                ],
                declarations: [
                    index_1.LoginComponent,
                    index_2.UsersComponent,
                    index_3.PetsComponent,
                    index_4.RefreshComponent,
                    index_5.SignupComponent,
                    index_6.AssociateComponent
                ]
            }).compileComponents();
            return [2 /*return*/];
        });
    }); });
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(index_2.UsersComponent);
        comp = fixture.componentInstance;
    });
    it('on init should get all things', testing_1.async(testing_1.inject([index_7.UserService, testing_2.MockBackend], function (dataService, backend) {
        // Mock backend for testing the Http service.							  
        expectURL(backend, responses);
        fixture.detectChanges();
        // Waits for async response.
        fixture.whenStable().then(function () {
            // Updates view with data.
            comp.getData(null);
            fixture.detectChanges();
            expect(comp.users).toEqual(JSON.parse(data).items);
        });
    })));
});
//# sourceMappingURL=users.component.spec.js.map