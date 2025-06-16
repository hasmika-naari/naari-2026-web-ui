import { provideServerRendering, withRoutes } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { appConfig } from './app.config';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION, MatNativeDateModule} from '@angular/material/core';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { serverRoutes } from './app.routes.server';

console.info('Server: Angular CDK version', CDK_VERSION.full);
console.info('Server: Angular Material version', MAT_VERSION.full);


const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        provideClientHydration(),
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        importProvidersFrom([BrowserModule, BrowserAnimationsModule, CarouselModule]),
         provideAnimations() ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);