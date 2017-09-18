import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';

import { UserService } from '../_services/index';
import { User } from '../_models/index';


@Component({
  moduleId: module.id.toString(),
  template: require('./users.component.html')
})

export class UsersComponent implements OnInit {
    users: User[];
    user: any = {};
    currentPage = 1;
    pageSize = 3;
    totalItems: number;

    constructor(private zone: NgZone, private ref: ChangeDetectorRef, private userService: UserService) { }

    ngOnInit() {
        this.getData(null);
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

    deleteUser(event, id) {

        var target = event.target || event.srcElement || event.currentTarget;
        
        this.disableButton(target, true);

        this.userService.deleteUser(id)
            .subscribe(data => {
                this.getData(target);
					},
					err => {
						this.disableButton(target, false);
					});
    }

    getData(btn) {
        this.userService.getUsers(this.currentPage, this.pageSize)
            .subscribe(data => {
                if (btn != null) {
                    this.disableButton(btn, false);
                }
                    this.totalItems = data.totalItems;
                    this.users = data.items;
					},
					err => {
						
					}

				);
    }

    createUser = function (event) {

        var target = event.target || event.srcElement || event.currentTarget;

        var button = target.getElementsByTagName("button");

        this.disableButton(button[0], true);

        this.userService.createUser(this.user)
					.subscribe(
					data => {
                this.getData(button[0]);
					},
					err => {
						this.disableButton(button[0], false);
					}

				);
    };

    pageChanged($event) {

        if ($event.page !== this.currentPage) {
            this.currentPage = $event.page;
            this.getData(null);
        }
    };
}