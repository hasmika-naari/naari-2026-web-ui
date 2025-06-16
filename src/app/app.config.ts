import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle, PreloadAllModules, 
        provideRouter, RouteReuseStrategy, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling,  
        withRouterConfig, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION, MatNativeDateModule} from '@angular/material/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HttpRequestInterceptor } from './services/auth.interceptor';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

/* eslint-disable no-console */
console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);


export class AppRouteReuseStrategy implements BaseRouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    // Do nothing
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}



export const appConfig: ApplicationConfig = {
    providers: [
            {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
            provideZoneChangeDetection({ eventCoalescing: true }), 
            provideRouter(routes), 
            provideClientHydration(), 
            provideAnimationsAsync(),
     
            provideHttpClient(
                withFetch(),
                withInterceptorsFromDi()),
                {
                provide:HTTP_INTERCEPTORS,
                useClass:HttpRequestInterceptor,
                multi:true
            },
            importProvidersFrom([BrowserModule, BrowserAnimationsModule, MatNativeDateModule,
            ]),
            provideRouter(routes,
                withComponentInputBinding(),
                withRouterConfig({
                onSameUrlNavigation: 'reload',
                }),
                withEnabledBlockingInitialNavigation(),
                withViewTransitions(),
                withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled'
                }),
                ),
                provideClientHydration(
                withHttpTransferCacheOptions({
                includePostRequests: false
                })
            ),
            provideAnimations(), provideAnimationsAsync()
        ]
        
};