import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PetService } from '../_services/index';
import { Pet } from '../_models/index';


@Component({
  moduleId: module.id.toString(),
  template: require('./pets.component.html')
})

export class PetsComponent implements OnInit {
    pets: Pet[];
    pet: any = {};
    currentPage = 1;
    pageSize = 3;
    totalItems: number;
    userId: number;
    userName: string;

    constructor(private petService: PetService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let userId = params['id'];
            if (userId !== "undefined") {
                this.userId = userId;
                this.getData(userId,null);
            }
        });
    }

    disableButton(btn, isDisable) {
        btn.disabled = isDisable;
        var spanButton = btn.getElementsByTagName("span");
        if (isDisable) {
            spanButton[0].style.display = "";
        } else {
            spanButton[0].style.display = "none";
        }
    }

    deletePet(event, id) {

        var target = event.target || event.srcElement || event.currentTarget;
        
        this.disableButton(target, true);

        this.petService.deletePet(id)
            .subscribe(data => {
                this.getData(this.userId,target);
					},
					err => {
						this.disableButton(target, false);
					});
    }

    getData(userId,btn) {
        this.petService.getPets(this.currentPage, this.pageSize,userId)
            .subscribe(data => {
                if (btn != null) {
                    this.disableButton(btn, false);
                }
                this.totalItems = data.totalItems;
                this.pets = data.items;
                this.userName = data.userName;
            });
    }

    createPet = function (event) {

        var target = event.target || event.srcElement || event.currentTarget;

        var button = target.getElementsByTagName("button");

        this.disableButton(button[0], true);

        this.petService.createPet(this.pet, this.userId)
            .subscribe(data => {
                this.getData(this.userId,button[0]);
					},
					err => {
						this.disableButton(button[0], false);
					});
    };

    pageChanged($event) {

        if ($event.page !== this.currentPage) {
            this.currentPage = $event.page;
            this.getData(this.userId,null);
        }
    };
}