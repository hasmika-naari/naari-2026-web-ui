// src/app/services/app-init.service.ts
import { inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { isPlatformServer} from '@angular/common';
import { DealsService } from './deals.service';
import { firstValueFrom } from 'rxjs';

const CATEGORIES_KEY = makeStateKey<any>('categories');
const DEAL_TYPES_KEY = makeStateKey<any>('dealTypes');
const BRANDS_KEY = makeStateKey<any>('brands');
const MERCHANTS_KEY = makeStateKey<any>('merchants');

@Injectable({ providedIn: 'root' })
export class AppInitService {
  private platformId = inject(PLATFORM_ID);
  private dealsService = inject(DealsService);
  private transferState = inject(TransferState);

async loadInitialData(): Promise<void> {
  console.log('[AppInitService] loadInitialData called');

  if (isPlatformServer(this.platformId)) {
    console.log('[AppInitService] Executing on server');

    const [categories, dealTypes, brands, merchants] = await Promise.all([
      firstValueFrom(this.dealsService.getCategoriesByCountry('usa', this.platformId)),
      firstValueFrom(this.dealsService.getDealTypes('usa', this.platformId)),
      firstValueFrom(this.dealsService.getBrands('usa')),
      firstValueFrom(this.dealsService.getMerchants('usa')),
    ]);

    // console.log(' Load Initial Data: categories' + categories);

    this.transferState.set(makeStateKey('categories'), categories);
    this.transferState.set(makeStateKey('dealTypes'), dealTypes);
    this.transferState.set(makeStateKey('brands'), brands);
    this.transferState.set(makeStateKey('merchants'), merchants);

    console.log('[AppInitService] Data stored in TransferState');
  } else {
    console.log('[AppInitService] Skipped on browser');
  }
}
}
