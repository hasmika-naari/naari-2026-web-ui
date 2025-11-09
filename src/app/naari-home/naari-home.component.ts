// import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
// import { Component, OnInit, PLATFORM_ID, Signal, TransferState, effect, inject, makeStateKey } from '@angular/core';
// import { Router, RouterLink, RouterOutlet } from '@angular/router';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule, MatFabButton } from '@angular/material/button';
// import { OwlOptions } from 'ngx-owl-carousel-o';
// import { DeviceDetectorService } from 'ngx-device-detector';
// import * as _ from 'lodash';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { FeatureTypesComponent } from './feature-types/feature-types.component';
// import { HeaderStyleComponent } from './header/header.component';
// import { MainBannerComponent } from './main-banner/main-banner.component';
// import { CategoryTypesComponent } from './category-types/category-types.component';
// import { HomeoneCoursesComponent } from './homeone-courses/homeone-courses.component';
// import { AuthService } from '@app/services/auth.service';
// import { LoginRequest } from '@app/services/auth.models';
// import { FooterEdComponent } from '@app/general/footer-ed/footer-ed.component';
// import { FooterComponent } from '@app/common/footer/footer.component';
// import { BecomePartnerComponent } from '@app/general/become-partner/become-partner.component';
// import { Category, CategoryListItem, DealDataItem, DealSorting, DealType, Merchant, PCategory, Slide } from '@app/services/deals.model';
// import { SeoService } from '@app/services/seo/seo.service';
// import { AppUtilService } from '@app/services/app.util.service';
// import { DealsService } from '@app/services/deals.service';
// import { LocalStorageService } from '@app/services/local-storage.service';
// import { DealsStoreService } from '@app/services/store/deals-store.service';
// import { LanguageSubscribeComponent } from '@app/general/language-subscribe/language-subscribe.component';
// import { FooterWorkifenceComponent } from '@app/pages/landing/footer-wifence/footer-wifence.component';

// @Component({
//     selector: 'app-home-page-three',
//     imports: [CommonModule, RouterLink, RouterOutlet, NgOptimizedImage,
//         MainBannerComponent, NgxPaginationModule, FooterEdComponent, FooterComponent,
//         MatButtonModule, MatChipsModule, MatIconModule, BecomePartnerComponent, 
//         MatMenuModule, LanguageSubscribeComponent, CategoryTypesComponent, HomeoneCoursesComponent,
//         MatCardModule, HeaderStyleComponent, FeatureTypesComponent, MatProgressBarModule, FooterWorkifenceComponent        
//     ],
//     host: {ngSkipHydration: 'true'},
//     templateUrl: './naari-home.component.html',
//     styleUrls: ['./naari-home.component.scss']
// })
// export class NaariHomePageComponent implements OnInit {
//   faWhatsapp = 'faWhatsapp';
//   faHotjar = 'faHotjar';
//   isActionInProgress = true;
//   public page:any = 0;
//   public counts = [42, 84, 126];
//   public count:any = 42;
//   public viewCol: number = 14.25;
//   maxSize = 5;
//   autoHide= false;
//   country: any = 'usa';
//   selectedSorting: DealSorting = {title: 'Default', isSelected: true};
//   public sortings = [
//     {title: 'Default', isSelected: true},
//     {title: 'Lowest Discount First', isSelected: false},
//     {title: 'Highest Discount First', isSelected: false}
//     ];
    
//     deals!: Array<DealDataItem>;
//   // categories: Array<Category> = new Array<Category>();
//   // pCategories: Array<PCategory> = new Array<PCategory>();
//   merchants: Array<Merchant> = new Array<Merchant>();

//   slides!: Array<Slide>;
//   dealTypes: Array<DealType>  = new Array<DealType>();;
//   // dailyDeals: Array<DealDataItem> = new Array<DealDataItem>();
//   isShowContent = true;
//   hover = true;
//   browser = false;
//   myCounttry: string = '';

//   customOptions: OwlOptions = {
//     loop: true,
//     mouseDrag: false,
//     touchDrag: false,
//     pullDrag: false,
//     dots: false,
    
//     autoplayTimeout: 11000,
//     autoplay: false,
//     navText: ['', ''],
//     responsive: {
//       0: {
//         items: 1
//       },
//       400: {
//         items: 1
//       },
//       740: {
//         items: 1
//       },
//       940: {
//         items: 1
//       }
//     },
//     nav: true
//   }
//   isMobile = false;
//   isTablet = false;
//   isDesktop = true;

//   updateLocalDealEffect = effect(() => {
//     const pcats = this.pCategories();
//     if (pcats) {
//       this.pCatsLocal = [...pcats];
//     }
//   });


//   private seoService:SeoService = inject(SeoService);
//   private appService: AppUtilService =  inject(AppUtilService);
//   private dealsService: DealsService= inject(DealsService);
//   private authService: AuthService= inject(AuthService);
//   private _localStorageService: LocalStorageService= inject(LocalStorageService);
//   private router: Router= inject(Router);
//   private transferState: TransferState = inject(TransferState);
//   private platformId: object =  inject(PLATFORM_ID);
//   private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
//   private dealsStoreService: DealsStoreService = inject(DealsStoreService);

//   pCatsLocal: Array<PCategory> = [];
//   pCategories: Signal< Array<PCategory>> = this.dealsStoreService.getPcCategories();
//   categories: Signal< Array<Category>> = this.dealsStoreService.getCategories();
//   dailyDeals: Signal<Array<DealDataItem>> = this.dealsStoreService.getAllDailyDeals();


//   constructor() { 
//     const content =
//     'Naari Deals - Femine Specials';

//   const title = 'Naari Deals - Femine Specials';

//   this.seoService.setMetaDescription(content);
//   this.seoService.setMetaTitle(title);

//   }

//   ngOnInit(): void {
//     debugger;
//     if(isPlatformServer(this.platformId)){
//         //consolie.log('naari-home - ngOnInit + isPlatformServer ' + this.platformId);
//           const data = { message: 'Hello from SSR!' };
//             //consolie.log('Hydrating data at server:', data);
//       this.fetchData();
//     }else{
//       //consolie.log('Reading Hydrated data:');
//       this.loadFetcheddata();
//     }

//     if(isPlatformBrowser(this.platformId)){
//       // this.loadFetcheddata();
//       this.browser = true;
//     if(this.deviceService.isDesktop()){
//       this.isDesktop = true;
//       this.isMobile = false;
//       this.isTablet = false;
//     }else if(this.deviceService.isMobile()){
//       this.isMobile = true;
//       this.isDesktop = false;
//       this.isTablet = false;
//     }else if(this.deviceService.isTablet()){
//       this.isTablet = true;
//       this.isMobile = false;
//       this.isDesktop = false;
//     }
//   }
//   }

//   fetchData(): void{
//       //consolie.log('naari-home - fetchData + ' + this.platformId);

//     if(isPlatformServer(this.platformId)){
//       //consolie.log('naari-home - fetchData + ' + this.platformId);
//     }
//     // if(!this.dailyDeals.length){
//       this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
//           this.deals = [...deals];
//           // this.dailyDeals = [...deals];

//           if(isPlatformServer(this.platformId)){
//             this.transferState.set<DealDataItem[]>(
//               makeStateKey('dealsTable'), deals
//             );
//           }else{
//               //  this.dealsStoreService.updateDeals(deals);
//             }
//       });
//     // }
//     // this.dealsService.getSlidesByCountryAndTag('usa', 'HOME').subscribe((slides) => {
//     //   this.slides = [...slides];
//     // });
//     // if(isPlatformBrowser(this.platformId)){
//     //   //consolie.log('fetch Data Browser categories' + this.categories.length);
//     // } 
//     // if(this.categories && !this.categories.length){
//       this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
//         // this.transferState.set<CategoryListItem[]>(
//         //   makeStateKey('categoriesTable'), categoriesTable
//         // );
//         // this.categories = [...categories];
//         // const sizeOptions = ['large', 'medium', 'small'];
//         // //consolie.log('naari-home - getCategoriesByCountry+ ' + this.platformId);
//         // this.categories = this.categories.map(category => ({
//         //   ...category,
//         //   size: sizeOptions[Math.floor(Math.random() * sizeOptions.length)]
//         // }));
//         /// divide into parentList
//         // // Group categories by parent and map them to the desired format
//         // this.pCategories = [..._.map(
//         //     _.groupBy(categories, 'parent'),
//         //     (categories, parent) => ({ parent, categories }))];
//             if(isPlatformServer(this.platformId)){
//               //consolie.log('naari-home - fetchData pCategories+ ' + this.platformId);
//               this.transferState.set<CategoryListItem[]>(
//                 makeStateKey('categoriesTable'), categories
//               );
//             }else{
//               //  this.dealsStoreService.updateCategories(categories);
//             }
          
//           // ////consolie.log(groupedCategories);
//       });
//     // }
//     // if(isPlatformBrowser(this.platformId)){
//     //   //consolie.log('fetch Data Browser dealTypes' + this.dealTypes.length);
//     // } 
//     if(this.dealTypes && !this.dealTypes.length){
//         this.dealsService.getDealTypes('usa', this.platformId).subscribe((dealTypes: Array<DealType>) => {
//           if(dealTypes){
//               this.dealTypes = [...dealTypes.filter(d => d.status === 'active')];
//           }
//           if(isPlatformServer(this.platformId)){
//             //consolie.log('naari-home - fetchData dealTypes+ ' + this.platformId);
//             this.transferState.set<DealType[]>(
//               makeStateKey('dealTypes'), this.dealTypes
//             );
//           }else {
//                 // this.dealsStoreService.updateDealTypes(this.dealTypes);
//           }
//         });
//       }
//       this.dealsService.getBrands('usa').subscribe((brands) => {
//         // this.dealTypes = [...dealTypes]
//         if(isPlatformServer(this.platformId)){
//           //consolie.log('naari-home - fetchData brands+ ' + this.platformId);
//           this.transferState.set<DealType[]>(
//             makeStateKey('brands'), brands
//           );
//         }else{
//               //  this.dealsStoreService.updateBrands(brands);
//         }
//       });

//       this.dealsService.getMerchants('usa').subscribe((merchants) => {
//         // this.dealTypes = [...dealTypes]
//         if(isPlatformServer(this.platformId)){
//           //consolie.log('naari-home - fetchData merchants+ ' + this.platformId);
//           this.transferState.set<DealType[]>(
//             makeStateKey('merchants'), merchants
//           );
//         }else{
//               //  this.dealsStoreService.updateMerchants(merchants);
//         }
//       });
//     // }

    
//   // }
//   }

//   addToWishlist(deal: DealDataItem){
//       this.dealsStoreService.updateDailyDeals(this.transferState.get(makeStateKey('dealsTable'), []));
//   }
  
//   gotToShop(dealUrl: any){
//     window.open(dealUrl);
//   }

//   getLatestDealsdelay(i: any){
// 		let delayText = 'ms';
// 		if(i > 0){
// 			delayText = (+i*60).toString() + 'ms';
// 		}
  
// 		return delayText;
// 	}
//   public onPageChanged(event: any){
//     this.page = event;
//     // this.getAllProducts(); 
//     // if (isPlatformBrowser(this.platformId)) {
//       window.scrollTo(0, document.documentElement.clientHeight - 50);
//     // } 
//   }
//   public changeSorting(sort: any){
//     this.selectedSorting = sort;
//     // if(this.selectedSorting && this.selectedSorting.title === 'Lowest Discount First'){
//     //   this.dailyDeals = [..._.orderBy(this.deals, d => +d.discount, ['asc'])];
//     // }else if(this.selectedSorting && this.selectedSorting.title === 'Highest Discount First'){
//     //   this.dailyDeals = [..._.orderBy(this.deals, d => +d.discount,  ['desc'])];
//     // }else{
//     //   this.dailyDeals = [...this.deals];
//     // }
//     this.dealsStoreService.sortDailyDeals( this.selectedSorting);
//     window.scrollTo(0, document.documentElement.clientHeight - 50);
//   }
//   public openProductDialog(deal: DealDataItem){   
//     this._localStorageService.setItem('selectedDealKey', deal);
//     this.router.navigate(['/deal', deal.id]); 
//   }

//   showStartDate(startDate: any){
//     let dDate: Date = new Date(startDate);
//     let today: Date = new Date();
//     return (dDate >= today);
//   }

//   shareOnWhatsApp($event:any, selectedDeal: DealDataItem){
//     $event.stopPropagation();
//     this.appService.shareOnWhatsApp(selectedDeal);
//   }


//   loadFetcheddata(){
//     //consolie.log('This is isPlatformBrowser...');
//      if(this.transferState.hasKey(makeStateKey('slideTable'))){
//       this.slides = this.transferState.get(makeStateKey('slideTable'), []);
//      }else{
//       // this.fetchData();
//      }
//      if(this.transferState.hasKey(makeStateKey('dealsTable'))){
//       this.deals = this.transferState.get(makeStateKey('dealsTable'), []);
//       this.dealsStoreService.updateDailyDeals(this.transferState.get(makeStateKey('dealsTable'), []));

//       // this.dailyDeals = [...this.deals];
//      }else{
//       this.fetchData();
//      }
//      if(this.transferState.hasKey(makeStateKey('dealTypes'))){
//       this.dealTypes = this.transferState.get(makeStateKey('dealTypes'), []);
//         this.dealTypes = [...this.dealTypes.filter(d => d.status === 'active')];
//       this.dealsStoreService.updateDealTypes(this.transferState.get(makeStateKey('dealTypes'), []));

//      }else{
//       this.fetchData();
//      }
//      if(this.transferState.hasKey(makeStateKey('categoriesTable'))){
//       // this.categories = this.transferState.get(makeStateKey('categoriesTable'), []);
//       this.dealsStoreService.updateCategories(this.transferState.get(makeStateKey('categoriesTable'), []));

//      }else{
//       this.fetchData();
//      }

//      if(this.transferState.hasKey(makeStateKey('merchants'))){
//       this.merchants = this.transferState.get(makeStateKey('merchants'), []);
//       this.dealsStoreService.updateMerchants(this.transferState.get(makeStateKey('merchants'), []));
//      }else{
//       this.fetchData();
//      }

//   }
// }

import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component, OnInit, PLATFORM_ID, Inject, Signal, TransferState,
  makeStateKey, runInInjectionContext, effect, Injector,
  OnDestroy, ViewChild, ElementRef
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
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.browser = true;
      this.isDesktop = this.deviceService.isDesktop();
      this.isMobile = this.deviceService.isMobile();
      this.isTablet = this.deviceService.isTablet();
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

  // Trending Brands Data
  trendingBrands = [
    {
      name: 'Amazon',
      logo: '/images/companies/amazon.webp',
      dealsCount: 150,
      maxDiscount: 70,
      slug: 'amazon'
    },
    {
      name: 'Flipkart',
      logo: '/images/companies/flipkart.webp',
      dealsCount: 120,
      maxDiscount: 80,
      slug: 'flipkart'
    },
    {
      name: 'Myntra',
      logo: '/images/companies/myntra.webp',
      dealsCount: 95,
      maxDiscount: 60,
      slug: 'myntra'
    },
    {
      name: 'Ajio',
      logo: '/images/companies/ajio.webp',
      dealsCount: 85,
      maxDiscount: 65,
      slug: 'ajio'
    },
    {
      name: 'Nykaa',
      logo: '/images/companies/nykaa.webp',
      dealsCount: 110,
      maxDiscount: 50,
      slug: 'nykaa'
    },
    {
      name: 'Tata CLiQ',
      logo: '/images/companies/tatacliq.webp',
      dealsCount: 75,
      maxDiscount: 55,
      slug: 'tatacliq'
    }
  ];

  // Carousel scroll function
  @ViewChild('brandsCarousel') brandsCarousel!: ElementRef;

  scrollBrandsCarousel(direction: 'left' | 'right') {
    const carousel = this.brandsCarousel.nativeElement;
    const scrollAmount = 320; // Width of one card + gap
    
    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
