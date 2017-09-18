import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import * as myGlobals from "../global";
import { URLSearchParams } from '@angular/http';

import { DataUsers } from '../_models/index';


@Injectable()
export class UserService {
    constructor(
        private http: Http) {
    }

    getUsers(pageNumber: number, pageSize: number): Observable<DataUsers> {
        // add authorization header with jwt token
        //let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });

        let myParams = new URLSearchParams();
        myParams.append('pageNumber', String(pageNumber));
        myParams.append('pageSize', String(pageSize));

        let options = new RequestOptions({ search: myParams });

        let url = myGlobals.restEndPoint + 'api/user';

        // get users from api
        return (this.http.get(url, options)
            .map((response: Response) => response.json())).catch((err: any) => {
                return Observable.throw(err);
            });       
;
    }

    createUser(user) {

        user.Id = 0;

        //let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });        

        let url = myGlobals.restEndPoint + 'api/user';

        return (this.http.post(url, user)
					.map((response: Response) => response.json())).catch((err: any) => {
							return Observable.throw(err);
            });
        
    }

    deleteUser(id) {

        //let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });

        let myParams = new URLSearchParams();
        myParams.append('id', id);
        let options = new RequestOptions({ search: myParams });

        let url = myGlobals.restEndPoint + 'api/user';

        return (this.http.delete(url, options)
            .map((response: Response) => response.json())).catch((err: any) => {
							return Observable.throw(err);
            });
    }
}