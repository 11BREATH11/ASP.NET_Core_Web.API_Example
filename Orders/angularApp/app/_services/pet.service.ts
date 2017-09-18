import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import * as myGlobals from "../global";
import { URLSearchParams } from '@angular/http';

import { DataPets } from '../_models/index';


@Injectable()
export class PetService {
    constructor(
        private http: Http) {
    }

    getPets(pageNumber: number, pageSize: number, userId: number): Observable<DataPets> {
        
        let myParams = new URLSearchParams();
        myParams.append('pageNumber', String(pageNumber));
        myParams.append('pageSize', String(pageSize));
        myParams.append('userId', String(userId));

        let options = new RequestOptions({ search: myParams });

        let url = myGlobals.restEndPoint + 'api/pet';

        // get users from api
        return (this.http.get(url, options)
            .map((response: Response) => response.json())).catch((err: any) => {
                return Observable.throw(err);
            });
    }

    createPet(pet: any,userId: any) {        

        let myParams = new URLSearchParams();
        myParams.append('userId', String(userId));

        let options = new RequestOptions({ search: myParams });        

        let url = myGlobals.restEndPoint + '/api/pet';

        return (this.http.post(url, pet, options)
            .map((response: Response) => response.json())).catch((err: any) => {
							return Observable.throw(err);
            });
        
    }

    deletePet(id: any) {        

        let myParams = new URLSearchParams();
        myParams.append('id', id);
        let options = new RequestOptions({ search: myParams });

        let url = myGlobals.restEndPoint + '/api/pet';

        return (this.http.delete(url, options)
            .map((response: Response) => response.json())).catch((err: any) => {
								return Observable.throw(err);
            });
    }
}