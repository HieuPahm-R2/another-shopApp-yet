import { ApplicationConfig, importProvidersFrom, Provider } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { adminRoutes } from './components/admin/admin-routes';

const tokenInterceptor: Provider = { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    tokenInterceptor,
    provideHttpClient(withFetch()),
    importProvidersFrom(RouterModule.forChild(adminRoutes)),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ]
};
