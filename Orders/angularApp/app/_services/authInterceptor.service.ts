import { Injectable, Injector } from '@angular/core';
import {
    Http,
    ConnectionBackend,
    RequestOptions,
    RequestOptionsArgs,
    Request,
    Response,
    Headers
} from '@angular/http';

import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { AuthService } from './index';


@Injectable()
export class AuthInterceptorService extends Http {    

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private injector: Injector) {
        super(backend, defaultOptions);
    }

    public get router(): Router {
        return this.injector.get(Router);
    }

    public get authService(): AuthService {
        return this.injector.get(AuthService);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {        

        if (typeof url === 'string') {
            if (!options) {
                options = { headers: new Headers() };
            }
            this.setHeaders(options);
        } else {
            this.setHeaders(url);
        }

				return super.request(url, this.getRequestOptionArgs(options)).catch(this.catchErrors());
    }   

    private catchErrors() {
        return (res: Response) => {
            if (res.status === 401 || res.status === 403) {                
                
                var authData = JSON.parse(localStorage.getItem('authorizationData'));

                if (authData) {
                    if (authData.useRefreshTokens) {
                        this.router.navigateByUrl('/refresh');           
                    }
                }

                this.authService.logOut();
                this.router.navigateByUrl('/login');                           
            }
            return Observable.throw(res);
        };
    }

    setHeaders(objectToSetHeadersTo: Request | RequestOptionsArgs) {

        var authData = JSON.parse(localStorage.getItem('authorizationData'));

        if (authData) {

            objectToSetHeadersTo.headers.set('Authorization', 'Bearer ' + authData.token);
        }        
		}

		private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
			if (options == null) {
				options = new RequestOptions();
			}
			if (options.headers == null) {
				options.headers = new Headers();
			}

			/*options.headers.append('Access-Control-Allow-Origin', '*');
			options.headers.append('Access-Control-Allow-Headers', 'Content-Type');
			options.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');*/

			return options;
		}
}