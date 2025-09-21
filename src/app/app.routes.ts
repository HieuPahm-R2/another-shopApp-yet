import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { OrderComponent } from './components/order/order.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuardFn } from './guards/auth.guards';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
    { path: 'orders/:id', component: OrderConfirmComponent },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
    //Admin
];
