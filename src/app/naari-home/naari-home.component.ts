import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component, OnInit, PLATFORM_ID, Inject, Signal, TransferState,
  makeStateKey, runInInjectionContext, effect, Injector,
  OnDestroy
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FeatureTypesComponent } from './feature-types/feature-types.component';
import { HeaderStyleComponent } from './header/header.component';
import { MainBannerComponent } from './main-banner/main-banner.component';
import { CategoryTypesComponent } from './category-types/category-types.component';
import { HomeoneCoursesComponent } from './homeone-courses/homeone-courses.component';

import { AuthService } from '@app/services/auth.service';
import { FooterEdComponent } from '@app/general/footer-ed/footer-ed.component';
import { FooterComponent } from '@app/common/footer/footer.component';
import { BecomePartnerComponent } from '@app/general/become-partner/become-partner.component';
import { Category, DealDataItem, DealSorting, DealType, Merchant, PCategory, Slide } from '@app/services/deals.model';
import { SeoService } from '@app/services/seo/seo.service';
import { AppUtilService } from '@app/services/app.util.service';
import { DealsService } from '@app/services/deals.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { LanguageSubscribeComponent } from '@app/general/language-subscribe/language-subscribe.component';
import { FooterWorkifenceComponent } from '@app/pages/landing/footer-wifence/footer-wifence.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page-three',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterOutlet, NgOptimizedImage, 
    MainBannerComponent, NgxPaginationModule, FooterEdComponent, FooterComponent,
    MatButtonModule, MatChipsModule, MatIconModule, BecomePartnerComponent, MatProgressSpinnerModule,
    MatMenuModule, LanguageSubscribeComponent, CategoryTypesComponent, HomeoneCoursesComponent,
    MatCardModule, HeaderStyleComponent, FeatureTypesComponent, MatProgressBarModule, FooterWorkifenceComponent
  ],
  host: { ngSkipHydration: 'true' },
  templateUrl: './naari-home.component.html',
  styleUrls: ['./naari-home.component.scss']
})
export class NaariHomePageComponent implements OnInit, OnDestroy {
  faWhatsapp = 'faWhatsapp';
  faHotjar = 'faHotjar';
  isActionInProgress = true;
  public page: any = 0;
  public counts = [42, 84, 126];
  public count: any = 42;
  public viewCol: number = 14.25;
  maxSize = 5;
  autoHide = false;
  country: any = 'usa';
  selectedSorting: DealSorting = { title: 'Default', isSelected: true };
  public sortings = [
    { title: 'Default', isSelected: true },
    { title: 'Lowest Discount First', isSelected: false },
    { title: 'Highest Discount First', isSelected: false }
  ];

  deals: DealDataItem[] = [];
  merchants: Merchant[] = [];
  slides: Slide[] = [];
  dealTypes: DealType[] = [];
  isShowContent = true;
  hover = true;
  browser = false;
  myCounttry: string = '';
  isMobile = false;
  isTablet = false;
  isDesktop = true;

  pCatsLocal: PCategory[] = [];
  catsLocal: Category[] = [];
  dailyDealsLocal: DealDataItem[] = [];
  // Will be initialized in ngOnInit to avoid early access error
  pCategories!: Signal<PCategory[]>;
  categories!: Signal<Category[]>;
  dailyDeals!: Signal<DealDataItem[]>;
  
  routeSub!: Subscription;

  constructor(
    private seoService: SeoService,
    private appService: AppUtilService,
    private dealsService: DealsService,
    private authService: AuthService,
    private _localStorageService: LocalStorageService,
    private router: Router,
    private transferState: TransferState,
    private deviceService: DeviceDetectorService,
    private dealsStoreService: DealsStoreService,
    @Inject(PLATFORM_ID) private platformId: object,
    private injector: Injector
  ) {
    const content = 'Naari Deals - Femine Specials';
    const title = 'Naari Deals - Femine Specials';
    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);

     // Detect route change to this route
      this.routeSub = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/home' || event.urlAfterRedirects.startsWith('/deals')) {
          // alert('Welcome to Naari Deals!');
          setTimeout (() => {
          // window.scrollTo(0, document.documentElement.clientHeight - 150);
          this.loadFetcheddata();
          }, 100);
        }
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    
    // Clear countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.browser = true;
      this.isDesktop = this.deviceService.isDesktop();
      this.isMobile = this.deviceService.isMobile();
      this.isTablet = this.deviceService.isTablet();
      
      // Start Black Friday countdown
      this.startCountdown();
    }

    // Assign after dealsStoreService is ready
    this.pCategories = this.dealsStoreService.getPcCategories();
    this.categories = this.dealsStoreService.getCategories();
    this.dailyDeals = this.dealsStoreService.getAllDailyDeals();

    this.loadFetcheddata();
    // let hasInitialized = false;

 runInInjectionContext(this.injector, () => {
  effect(() => {
    const pCats = this.pCategories();
    const catList = this.categories();
    const dlist = this.dailyDeals();

    if (pCats.length > 0 && catList.length > 0) {
      this.pCatsLocal = [...pCats];
      this.catsLocal = [...catList];
      this.dailyDealsLocal = [...dlist];
      // hasInitialized = true;
    }
  });
});
  }

  loadFetcheddata() {
    const getOrFetch = <T>(key: string, fetchFn: () => void): T[] => {
      const stateKey = makeStateKey<T[]>(key);
      const value = this.transferState.get(stateKey, []);
      if (!value.length) fetchFn();
      return value;
    };

    const deals = getOrFetch<DealDataItem>('dealsTable', () =>
      this.dealsService.getDealsByCountry(this.country, this.platformId).subscribe(d => this.dealsStoreService.updateDailyDeals(d))
    );
    if (deals.length) {
      this.deals = [...deals];
      this.dealsStoreService.updateDailyDeals(deals);
    }

    const categories = getOrFetch<Category>('categoriesTable', () =>
      this.dealsService.getCategoriesByCountry(this.country, this.platformId).subscribe(c => this.dealsStoreService.updateCategories(c))
    );
    if (categories.length) {
      this.dealsStoreService.updateCategories(categories);
    }

    const dealTypes = getOrFetch<DealType>('dealTypes', () =>
      this.dealsService.getDealTypes(this.country, this.platformId).subscribe(dts => this.dealsStoreService.updateDealTypes(dts))
    );
    if (dealTypes.length) {
      this.dealTypes = [...dealTypes.filter(d => d.status === 'active')];
      this.dealsStoreService.updateDealTypes(this.dealTypes);
    }

    const merchants = getOrFetch<Merchant>('merchants', () =>
      this.dealsService.getMerchants(this.country).subscribe(m => this.dealsStoreService.updateMerchants(m))
    );
    if (merchants.length) {
      this.merchants = [...merchants];
      this.dealsStoreService.updateMerchants(merchants);
    }
  }

  addToWishlist(deal: DealDataItem) {
    this.dealsStoreService.toggleWishlistStatus(deal);
  }

  gotToShop(dealUrl: any) {
    window.open(dealUrl);
  }

  getLatestDealsdelay(i: any) {
    return i > 0 ? `${+i * 60}ms` : 'ms';
  }

  public onPageChanged(event: any) {
    this.page = event;
    window.scrollTo(0, document.documentElement.clientHeight - 150);
  }

  public changeSorting(sort: any) {
    this.selectedSorting = sort;
    this.dealsStoreService.sortDailyDeals(this.selectedSorting);
    window.scrollTo(0, document.documentElement.clientHeight - 150);
  }

  public openProductDialog(deal: DealDataItem) {
    this._localStorageService.setItem('selectedDealKey', deal);
    this.router.navigate(['/deal', deal.id]);
  }

  showStartDate(startDate: any) {
    return new Date(startDate) >= new Date();
  }

  shareOnWhatsApp($event: any, selectedDeal: DealDataItem) {
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedDeal);
  }

  // Black Friday Countdown
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  private countdownInterval: any;

  startCountdown() {
    // Set Black Friday date - November 29, 2025
    const blackFridayDate = new Date('2025-11-29T00:00:00').getTime();

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = blackFridayDate - now;

      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return;
      }

      this.countdown = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    }, 1000);
  }
}
