import { provideServerRendering, withRoutes } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom, APP_INITIALIZER, inject, PLATFORM_ID } from '@angular/core';
import { appConfig } from './app.config';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION, MatNativeDateModule} from '@angular/material/core';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { serverRoutes } from './app.routes.server';
import { AppInitService } from './services/app-init.service';
import { provideEnvironmentInitializer } from '@angular/core';

//consolie.info('Server: Angular CDK version', CDK_VERSION.full);
//consolie.info('Server: Angular Material version', MAT_VERSION.full);


const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        provideClientHydration(),
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        importProvidersFrom([BrowserModule, BrowserAnimationsModule, CarouselModule]),
         provideAnimations(),
         AppInitService,
         provideEnvironmentInitializer(() => async () => {
        const initService = inject(AppInitService);
        await initService.loadInitialData();
        }),
        { provide: PLATFORM_ID, useValue: 'server' },
    ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);