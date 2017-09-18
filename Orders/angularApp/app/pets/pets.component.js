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
var PetsComponent = (function () {
    function PetsComponent(petService, activatedRoute) {
        this.petService = petService;
        this.activatedRoute = activatedRoute;
        this.pet = {};
        this.currentPage = 1;
        this.pageSize = 3;
        this.createPet = function (event) {
            var _this = this;
            var target = event.target || event.srcElement || event.currentTarget;
            var button = target.getElementsByTagName("button");
            this.disableButton(button[0], true);
            this.petService.createPet(this.pet, this.userId)
                .subscribe(function (data) {
                _this.getData(_this.userId, button[0]);
            }, function (err) {
                _this.disableButton(button[0], false);
            });
        };
    }
    PetsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            var userId = params['id'];
            if (userId !== "undefined") {
                _this.userId = userId;
                _this.getData(userId, null);
            }
        });
    };
    PetsComponent.prototype.disableButton = function (btn, isDisable) {
        btn.disabled = isDisable;
        var spanButton = btn.getElementsByTagName("span");
        if (isDisable) {
            spanButton[0].style.display = "";
        }
        else {
            spanButton[0].style.display = "none";
        }
    };
    PetsComponent.prototype.deletePet = function (event, id) {
        var _this = this;
        var target = event.target || event.srcElement || event.currentTarget;
        this.disableButton(target, true);
        this.petService.deletePet(id)
            .subscribe(function (data) {
            _this.getData(_this.userId, target);
        }, function (err) {
            _this.disableButton(target, false);
        });
    };
    PetsComponent.prototype.getData = function (userId, btn) {
        var _this = this;
        this.petService.getPets(this.currentPage, this.pageSize, userId)
            .subscribe(function (data) {
            if (btn != null) {
                _this.disableButton(btn, false);
            }
            _this.totalItems = data.totalItems;
            _this.pets = data.items;
            _this.userName = data.userName;
        });
    };
    PetsComponent.prototype.pageChanged = function ($event) {
        if ($event.page !== this.currentPage) {
            this.currentPage = $event.page;
            this.getData(this.userId, null);
        }
    };
    ;
    return PetsComponent;
}());
PetsComponent = __decorate([
    core_1.Component({
        moduleId: module.id.toString(),
        template: require('./pets.component.html')
    }),
    __metadata("design:paramtypes", [index_1.PetService, router_1.ActivatedRoute])
], PetsComponent);
exports.PetsComponent = PetsComponent;
//# sourceMappingURL=pets.component.js.map