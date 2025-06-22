import { ApplicationRef, inject, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { AppInitService } from './app/services/app-init.service';

const bootstrap = async (): Promise<ApplicationRef> => {
  const appRef = await bootstrapApplication(AppComponent, config);

  // Use Angular injection context to access injected services
  await runInInjectionContext(appRef.injector, async () => {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformServer(platformId)) {
      const appInitService = inject(AppInitService);
      await appInitService.loadInitialData();
    }
  });

  return appRef;
};

export default bootstrap;
