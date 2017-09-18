import { } from 'jasmine';
import { inject, async, TestBed, ComponentFixture } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { routing } from '../../app/app.routing';
import { HttpModule } from '@angular/http';
import { PaginationModule } from 'ngx-bootstrap';
import { LoginComponent } from '../../app/login/index';
import { UsersComponent } from '../../app/users/index';
import { PetsComponent } from '../../app/pets/index';
import { RefreshComponent } from '../../app/refresh/index';
import { SignupComponent } from '../../app/signup/index';
import { AssociateComponent } from '../../app/associate/index';
import { APP_BASE_HREF } from '@angular/common';


import {
	Http,
	ConnectionBackend,
	BaseRequestOptions,
	Response,
	ResponseOptions
} from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import * as myGlobals from '../../app/global';
import { UserService } from '../../app/_services/index';


describe('UsersComponent', () => {

	let fixture: ComponentFixture<UsersComponent>;
	let comp: UsersComponent;

	let actionUrl: string = myGlobals.ngAuthSettings.apiServiceBaseUri + "api/user?pageNumber=1&pageSize=3";

	// Multiple requests with different URL.
	let responses: any = {};
	let data: any = JSON.stringify({ items: [{ id: 1, name: "Zhenya", totalPets: 0 }], totalItems: 1 });
	responses[actionUrl] = new Response(new ResponseOptions({ body: data }));

	function expectURL(backend: MockBackend, responses: any) {
		backend.connections.subscribe((c: MockConnection) => {
			let response: any = responses[c.request.url];
			c.mockRespond(response);
		});
	}

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [
				BrowserModule,
				FormsModule,
				HttpModule,
				routing,
				PaginationModule.forRoot()
			],
			providers: [
				{ provide: APP_BASE_HREF, useValue: '/' },
				BaseRequestOptions,
				MockBackend,
				UserService,
				{
					provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
						return new Http(backend, defaultOptions);
					}, deps: [MockBackend, BaseRequestOptions]
				}
			],
			declarations: [				
				LoginComponent,
				UsersComponent,
				PetsComponent,
				RefreshComponent,
				SignupComponent,
				AssociateComponent
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersComponent);
		comp = fixture.componentInstance;
	});

	it('on init should get all things', async(
		inject([UserService, MockBackend],
			(dataService: UserService, backend: MockBackend) => {
				// Mock backend for testing the Http service.							  
				expectURL(backend, responses);

				fixture.detectChanges();

				// Waits for async response.
				fixture.whenStable().then(() => {
					// Updates view with data.
					comp.getData(null);

					fixture.detectChanges();										

					expect(comp.users).toEqual(JSON.parse(data).items);
					
				});
			})
	));
});
