import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/index';
import { UsersComponent } from './users/index';
import { PetsComponent } from './pets/index';
import { AuthGuard } from './_guards/index';
import { RefreshComponent } from './refresh/index';
import { SignupComponent } from './signup/index';
import { AssociateComponent } from './associate/index';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'pet/:id', component: PetsComponent, canActivate: [AuthGuard] },
    { path: '', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'refresh', component: RefreshComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'associate', component: AssociateComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
