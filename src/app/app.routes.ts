import { Routes } from '@angular/router';
import { HomeComponent } from './components/commons/home/home.component';
import { MenuComponent } from './components/commons/menu/menu.component';
import { LoginComponent } from './components/commons/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },

    {
        path: '',
        component: MenuComponent,
        children: [
            { path: 'bandejas', component: HomeComponent },
            { path: '', redirectTo: 'bandejas', pathMatch: 'full' }
        ]
    },

    { path: '**', redirectTo: 'login' }
];
