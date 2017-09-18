import { NgModule, Injector } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing } from './app.routing';

import { AuthGuard } from './_guards/index';
import { AuthService, UserService, PetService, AuthInterceptorService } from './_services/index';

import { LoginComponent } from './login/index';
import { UsersComponent } from './users/index';
import { PetsComponent } from './pets/index';
import { RefreshComponent } from './refresh/index';
import { SignupComponent } from './signup/index';
import { AssociateComponent } from './associate/index';

import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http'; 

import { Router } from '@angular/router';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        PaginationModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        UsersComponent,
        PetsComponent,
        RefreshComponent,
        SignupComponent,
        AssociateComponent
    ],
    providers: [
        AuthGuard,
        AuthService,
        UserService,
        PetService,
			  AuthInterceptorService,				
        HashLocationStrategy,
        {
            provide: Http,
            useFactory: (backend: XHRBackend, defaultOptions: RequestOptions, injector: Injector) => new AuthInterceptorService(backend, defaultOptions, injector),
            deps: [XHRBackend, RequestOptions, Injector]
        }

        // providers used to create fake backend
        /*fakeBackendProvider,
        MockBackend,
        BaseRequestOptions*/
    ],
    bootstrap: [AppComponent]
})



export class AppModule { }
