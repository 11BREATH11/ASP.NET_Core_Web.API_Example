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
var UsersComponent = (function () {
    function UsersComponent(zone, ref, userService) {
        this.zone = zone;
        this.ref = ref;
        this.userService = userService;
        this.user = {};
        this.currentPage = 1;
        this.pageSize = 3;
        this.createUser = function (event) {
            var _this = this;
            var target = event.target || event.srcElement || event.currentTarget;
            var button = target.getElementsByTagName("button");
            this.disableButton(button[0], true);
            this.userService.createUser(this.user)
                .subscribe(function (data) {
                _this.getData(button[0]);
            }, function (err) {
                _this.disableButton(button[0], false);
            });
        };
    }
    UsersComponent.prototype.ngOnInit = function () {
        this.getData(null);
    };
    UsersComponent.prototype.disableButton = function (btn, isDisable) {
        btn.disabled = isDisable;
        var spanButton = btn.getElementsByTagName("span");
        if (isDisable) {
            spanButton[0].style.display = "";
        }
        else {
            spanButton[0].style.display = "none";
        }
    };
    UsersComponent.prototype.deleteUser = function (event, id) {
        var _this = this;
        var target = event.target || event.srcElement || event.currentTarget;
        this.disableButton(target, true);
        this.userService.deleteUser(id)
            .subscribe(function (data) {
            _this.getData(target);
        }, function (err) {
            _this.disableButton(target, false);
        });
    };
    UsersComponent.prototype.getData = function (btn) {
        var _this = this;
        this.userService.getUsers(this.currentPage, this.pageSize)
            .subscribe(function (data) {
            if (btn != null) {
                _this.disableButton(btn, false);
            }
            _this.totalItems = data.totalItems;
            _this.users = data.items;
        }, function (err) {
        });
    };
    UsersComponent.prototype.pageChanged = function ($event) {
        if ($event.page !== this.currentPage) {
            this.currentPage = $event.page;
            this.getData(null);
        }
    };
    ;
    return UsersComponent;
}());
UsersComponent = __decorate([
    core_1.Component({
        moduleId: module.id.toString(),
        template: require('./users.component.html')
    }),
    __metadata("design:paramtypes", [core_1.NgZone, core_1.ChangeDetectorRef, index_1.UserService])
], UsersComponent);
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map