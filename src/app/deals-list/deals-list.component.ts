import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit, PLATFORM_ID, Signal, TransferState, effect, inject, makeStateKey, runInInjectionContext, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { HeaderStyleComponent } from '../naari-home/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Category, DealDataItem, DealSorting, DealType, PCategory } from '@app/services/deals.model';
import { DealsService } from '@app/services/deals.service';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPaginationModule } from 'ngx-pagination';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AppUtilService } from '@app/services/app.util.service';
import { DealsBlogComponent } from '@app/general/deals-blog/deals-blog.component';
import { FooterComponent } from '@app/common/footer/footer.component';
import { LanguageSubscribeComponent } from '@app/general/language-subscribe/language-subscribe.component';
import { SeoService } from '@app/services/seo/seo.service';
import { AuthService } from '@app/services/auth.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-deals-list',
    imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, NgxPaginationModule,
        NgOptimizedImage, HeaderStyleComponent, DealsBlogComponent, FooterComponent,
        CarouselModule, MatButtonModule, MatChipsModule, MatIconModule, MatFormFieldModule,
        MatSelectModule,
        MatMenuModule, LanguageSubscribeComponent, MatCardModule, MatProgressBarModule],
    templateUrl: './deals-list.component.html',
    styleUrls: ['./deals-list.component.scss']
})
export class DealsListComponent implements OnInit, OnDestroy {

  public page:any = 0;
  public counts = [42, 84, 126];
  public count:any = 42;
  public viewCol: number = 2;
  maxSize = 5;
  autoHide= false;
  country: any = 'usa';
  selectedSorting: DealSorting = {title: 'Default', isSelected: true};
  public sortings = [
    {title: 'Default', isSelected: true},
    {title: 'Lowest Discount First', isSelected: false},
    {title: 'Highest Discount First', isSelected: false}
    ];

    isToggled = false;
    pCategories: Signal< Array<PCategory>>;
    pCategoriesLocal: Array<PCategory> = [];
    categories: Signal< Array<Category>>;
    categoriesLocal: Array<Category> = [];
    filteredCategoriesLocal: Category[] = [];
    dealTypes: Signal<Array<DealType>>;
    dealTypesLocal: Array<DealType> = [];
    selectedDealType: Signal<DealType>;
    selectedCategory: Signal<Category>;
    allFilteredDeals:  Signal<Array<DealDataItem>>;
    dealsLocal:  Array<DealDataItem> = [];
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;
    currentUrl = '';
    subs:Array<Subscription> = new Array<Subscription>();

    private dealsStoreService = inject(DealsStoreService);

    constructor(
        public themeService: ThemeCustomizerService,
        private injector: Injector,
        private seoService: SeoService,
        private appService: AppUtilService,
        private dealsService: DealsService,
        private authService: AuthService,
        private _localStorageService: LocalStorageService,
        private router: Router,
        private transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: object,
        private deviceService: DeviceDetectorService,
        private route: ActivatedRoute,
        private meta: Meta,
        private title: Title
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        let hasInitialized = false;
        // Initialize signals after dealsStoreService is available
        this.pCategories = this.dealsStoreService.getPcCategories();
        this.categories = this.dealsStoreService.getCategories();
        this.dealTypes = this.dealsStoreService.getDealTypes();
        this.selectedDealType = this.dealsStoreService.getSelectedDealType();
        this.selectedCategory = this.dealsStoreService.getSelectedCategory();
        this.allFilteredDeals = this.dealsStoreService.getDealListDelas();
     
         runInInjectionContext(this.injector, () => {
            effect(() => {
                const cats = this.categories();
                if (cats.length) {
                    setTimeout(() => {
                        this.categoriesLocal = cats;
                        this.filteredCategoriesLocal = [...cats];
                    });
                }
                const pcCats = this.pCategories();
                if (pcCats?.length) {
                    setTimeout(() => {
                        this.pCategoriesLocal = pcCats;
                        this.filteredCategoriesLocal = [...cats];
                    });
                }
                const deals = this.allFilteredDeals();
                if (deals?.length) this.dealsLocal = [...deals];
            });
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnDestroy(): void {
        
    }

    ngOnInit(): void {
       if (isPlatformBrowser(this.platformId)) {
         this.browser = true;
         this.isDesktop = this.deviceService.isDesktop();
         this.isMobile = this.deviceService.isMobile();
         this.isTablet = this.deviceService.isTablet();
       }
   
      const dealType = this.route.snapshot.queryParams['type'] || 'All';
      const category = this.route.snapshot.queryParams['category'] || 'All';
      this.fetchData(dealType, category);

       // Assign after dealsStoreService is ready
       this.pCategories = this.dealsStoreService.getPcCategories();
       this.categories = this.dealsStoreService.getCategories();
       this.dealTypes = this.dealsStoreService.getDealTypes();
       this.selectedDealType = this.dealsStoreService.getSelectedDealType();
       this.selectedCategory = this.dealsStoreService.getSelectedCategory();
       this.allFilteredDeals = this.dealsStoreService.getDealListDelas();
   
       this.loadFetcheddata();
       let hasInitialized = false;
   
    runInInjectionContext(this.injector, () => {
     effect(() => {
       const pCats = this.pCategories();
       const catList = this.categories();
       const dlist = this.allFilteredDeals();
   
       if (!hasInitialized && pCats.length > 0 && catList.length > 0) {
         this.pCategoriesLocal = [...pCats];
         this.categoriesLocal = [...catList];
         this.dealsLocal = [...dlist];
         hasInitialized = true;
       }
     });
   });
     }
   
  loadFetcheddata(): void {
    const getOrFetch = <T>(key: string, p0?: () => Subscription): T[] => {
      const stateKey = makeStateKey<T[]>(key);
      return this.transferState.get(stateKey, []);
    };

    // Get query params
    const dealType = this.route.snapshot.queryParams['type'] || 'All';
    const category = this.route.snapshot.queryParams['category'] || 'All';

    // Check for 'dealsByFilter'
    const deals = getOrFetch<DealDataItem>('dealsByFilter');
    if (!deals.length) {
      // If no deals found in TransferState, fetch from API
      this.fetchData(dealType, category);
    } else {
      this.dealsLocal = [...deals];
      this.dealsStoreService.updateDealsListDeals(deals);
    }

    // Categories (same logic can apply here if needed)
    const categories = getOrFetch<Category>('categoriesTable');
    if (categories.length) {
      this.dealsStoreService.updateCategories(categories);
    } else {
      this.dealsService.getCategoriesByCountry(this.country, this.platformId)
        .subscribe(cats => this.dealsStoreService.updateCategories(cats));
    }

    const dealTypes = getOrFetch<DealType>('dealTypes', () =>
      this.dealsService.getDealTypes(this.country, this.platformId).subscribe(dts => this.dealsStoreService.updateDealTypes(dts))
    );
    if (dealTypes.length) {
      this.dealTypesLocal = [...dealTypes.filter(d => d.status === 'active')];
      this.dealsStoreService.updateDealTypes(this.dealTypesLocal);
    }

  }

   
    fetchData(dealType: string, category: string): void {
      const setStateOrStore = <T>(
        key: string,
        data: T,
        updateFn: (data: T) => void
      ) => {
        const stateKey = makeStateKey<T>(key);
        if (isPlatformServer(this.platformId)) {
          this.transferState.set<T>(stateKey, data);
        } else {
          updateFn(data);
        }
      };

      const handleDeals = (deals: DealDataItem[]) => {
        this.dealsLocal = [...deals];
        setStateOrStore<DealDataItem[]>('dealsByFilter', deals, d =>
          this.dealsStoreService.updateDealsListDeals(d)
        );
      };

      // Resolve which API to call
      if (!dealType && !category || (dealType === 'All' && category === 'All')) {
        this.dealsService
          .getDealsByCountry(this.country, this.platformId)
          .subscribe(handleDeals);
      } else if (dealType === 'All' && category !== 'All') {
        this.dealsService
          .getDealsByCountryAndCategory(this.country, category, this.platformId)
          .subscribe(handleDeals);
      } else if (dealType !== 'All' && category === 'All') {
        this.dealsService
          .getDealsByCountryAndDealType(this.country, dealType, this.platformId)
          .subscribe(handleDeals);
      } else if (dealType !== 'All' && category !== 'All') {
        this.dealsService
          .getDealsByCountryCategoryAndDealType(this.country, dealType, category, this.platformId)
          .subscribe(handleDeals);
      }
  }


    // fetchData(dealType: string, category: string): void{

    //   if(!dealType && !category){
    //     this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
    //       this.dealsLocal = _.cloneDeep(deals);
    //       this.dealsLocal =  _.cloneDeep(deals);
    //        if(isPlatformServer(this.platformId)){
    //         this.transferState.set<DealDataItem[]>(
    //           makeStateKey('dealsByFilter'), deals
    //         );
    //       }else{
    //            this.dealsStoreService.updateDealsListDeals(deals);
    //       }
    //     });
    //   }else if((dealType && dealType === 'All')
    //      && (this.dealsService && category === 'All')){
    //     this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
    //       this.dealsLocal = _.cloneDeep(deals);
    //       this.dealsLocal =  _.cloneDeep(deals);
    //       if(isPlatformServer(this.platformId)){
    //         this.transferState.set<DealDataItem[]>(
    //           makeStateKey('dealsByFilter'), deals
    //         );
    //       }else{
    //           //  this.dealsStoreService.updateDeals(deals);
    //       }
    //     });
    //   }else if((dealType && dealType === 'All') && 
    //          (category && category !== 'All'))
    //   {
    //     this.dealsService.getDealsByCountryAndCategory('usa', category, this.platformId).subscribe((deals) => {
    //       this.dealsLocal = _.cloneDeep(deals);
    //       this.dealsLocal =  _.cloneDeep(deals);
    //       if(isPlatformServer(this.platformId)){
    //         this.transferState.set<DealDataItem[]>(
    //           makeStateKey('dealsByFilter'), deals
    //         );
    //       }else{
    //           //  this.dealsStoreService.updateDeals(deals);
    //       }
    //     });
    //   }else if((dealType && dealType !== 'All') && 
    //   (category && category === 'All'))
    //   {
    //     this.dealsService.getDealsByCountryAndDealType('usa', dealType, this.platformId).subscribe((deals) => {
    //       this.dealsLocal = _.cloneDeep(deals);
    //       this.dealsLocal =  _.cloneDeep(deals);
    //       if(isPlatformServer(this.platformId)){
    //         this.transferState.set<DealDataItem[]>(
    //           makeStateKey('dealsByFilter'), deals
    //         );
    //       }else{
    //           //  this.dealsStoreService.updateDeals(deals);
    //       }
    //     });
    //   }else if((dealType && dealType !== 'All') && 
    //           (category && category !== 'All')){
    //     this.dealsService.getDealsByCountryCategoryAndDealType('usa', dealType, category, this.platformId ).subscribe((deals) => {
    //       this.dealsLocal = _.cloneDeep(deals);
    //       this.dealsLocal =  _.cloneDeep(deals);
    //       if(isPlatformServer(this.platformId)){
    //         this.transferState.set<DealDataItem[]>(
    //           makeStateKey('dealsByFilter'), deals
    //         );
    //       }else{
    //           //  this.dealsStoreService.updateDeals(deals);
    //       }

    //     });
    //   }else{
    //     this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
    //       this.dealsLocal = _.cloneDeep(deals);
    //       this.dealsLocal =  _.cloneDeep(deals);
    //       if(isPlatformServer(this.platformId)){
    //         this.transferState.set<DealDataItem[]>(
    //           makeStateKey('dealsByFilter'), deals
    //         );
    //       }else{
    //           //  this.dealsStoreService.updateDeals(deals);
    //       }
    //     });
    //   }

    //     this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
    //       // this.categories = [...categories];
    //         /// divide into parentList
    //       // Group categories by parent and map them to the desired format
    //       let selectedCategory = [];
    //       if(category === 'All'){
    //         let cat: Category = new Category();
    //         cat.code = "All",
    //         cat.country = this.country,
    //         cat.description = '';
    //         cat.title = 'All Deals',
    //         cat.subTitle = 'All Deals'
    //         selectedCategory.push(cat);
    //       }else{
    //         selectedCategory = categories.filter((cat: Category) => cat.code === category);
    //       }

    //       if(isPlatformServer(this.platformId)){
    //         this.transferState.set<Category>(
    //           makeStateKey('selectedCategory'), selectedCategory
    //         );
    //          this.transferState.set<DealDataItem[]>(
    //           makeStateKey('categoriesTable'), categories
    //         );
    //       }else{
    //           //  this.dealsStoreService.updateDeals(deals);
    //       }
    //       this.dealsService.getDealTypes('usa', this.platformId).subscribe((dealTypes) => {
    //         // this.dealTypes = [...dealTypes]
    //         let selectedDealTypes: Array<DealType> = [];
    //         let selectedDealType: any;

    //         if(dealType === 'All'){
    //           let dt:DealType = new DealType();
    //           dt.code = "All",
    //           dt.country = this.country,
    //           dt.title = 'All Deals',
    //           dt.subTitle = 'All Deals'
    //           selectedDealTypes.push(dt);
    //         }else{
    //           selectedDealType = selectedDealTypes.filter((dtype) => dtype.code === dealType);
    //         }

    //           if(isPlatformServer(this.platformId)){
    //           this.transferState.set<Array<DealType>>(
    //             makeStateKey('selectedDealTypes'), selectedDealTypes
    //           );
    //           this.transferState.set<DealDataItem[]>(
    //             makeStateKey('dealTypes'), dealTypes
    //           );
    //         }else{
    //             this.dealsStoreService.updateDealTypes(dealTypes);
    //         }

    //        this.loadDealPageBreadgrumText(selectedDealTypes[0], this.selectedCategory());

    //       });
        
    //     });
    // }

  // loadFetcheddata(dealType: string, category: string){
  //     //consolie.log('This is isPlatformBrowser...');
    
  //     if(this.transferState.hasKey(makeStateKey('dealsByFilter'))){
  //       this.dealsStoreService.updateDealsListDeals(this.transferState.get(makeStateKey('dealsByFilter'), []));
  //     }else{
  //       // this.fetchData(this.selectedDealId);
  //     }

  //     if(this.transferState.hasKey(makeStateKey('selectedCategory'))){
  //       this.dealsStoreService.updateSelectedCategory(this.transferState.get(makeStateKey('selectedCategory'), new Category()));
  //     }else{
  //       // this.fetchData(this.selectedDealId);
  //     }
      
  //     if(this.transferState.hasKey(makeStateKey('categoriesTable'))){
  //       this.dealsStoreService.updateCategories(this.transferState.get(makeStateKey('categoriesTable'), []));
  //     }else{
  //       // this.fetchData(this.selectedDealId);
  //     }

  //     if(this.transferState.hasKey(makeStateKey('dealTypes'))){
  //       this.dealsStoreService.updateDealTypes(this.transferState.get(makeStateKey('dealTypes'), []));
  //     }else{
  //       // this.fetchData(this.selectedDealId);
  //     }

  // }

    loadDealPageBreadgrumText(dealType: DealType, category: Category){
      let selType = ''; 
      //////consolie.log('Selected DealType' + dealType?.title);
      //////consolie.log('Selected Category' + category?.title);
      if(dealType && dealType.code){
        selType = dealType.title;
        let selectedDealTitle =  ' 🔥 Naari Deals - ' +  selType?selType  + ' Savings Deals for You': 'All Best Deals';
        this.meta.updateTag({property:"og:title",content:selectedDealTitle});
        this.meta.updateTag({property:"og:description",content:'Share & Help Friends to Save more..'});
        this.meta.updateTag({property:"og:url",content: "https://naarideals.com/deals"});
                  
        this.meta.updateTag({property:"twitter:title",content:selectedDealTitle});
        this.meta.updateTag({property:"twitter:description",content:'Share & Help Friends to Save more..'});
        this.meta.updateTag({property:"twitter:url",content: "https://naarideals.com/deals"});
      }
      if(category && category.code){
        selType = selType + ' ( ' + category.title + ' ) ';
      }
      this.currentUrl = selType;
      
      this.title.setTitle(this.currentUrl);
  
    }
    
       
  gotToShop(dealUrl: any){
    window.open(dealUrl);
  }

  public onPageChanged(event: any){
    this.page = event;
    // this.getAllProducts(); 
    // if (isPlatformBrowser(this.platformId)) {
      //////consolie.log('Screen Height: ' + document.documentElement.clientHeight);
      if(this.isMobile){
        window.scrollTo(0, 275);
      }else{
        window.scrollTo(0, 375);
      }
    // } 
  }

  showStartDate(startDate: any){
    let dDate: Date = new Date(startDate);
    let today: Date = new Date();
    return (dDate >= today);
  }

  public changeSorting(sort: any){
    this.selectedSorting = sort;
    this.dealsStoreService.sortDeals(sort);
    // if(this.selectedSorting && this.selectedSorting.title === 'Lowest Discount First'){
    //   this.sortedDeals = [..._.orderBy(this.deals, (d: DealDataItem) => +d.discount, ['asc'])];
    // }else if(this.selectedSorting && this.selectedSorting.title === 'Highest Discount First'){
    //   this.sortedDeals = [..._.orderBy(this.deals, d => +d.discount,  ['desc'])];
    // }else{
    //   this.sortedDeals = [...this.deals];
    // }
    if(this.isMobile){
      window.scrollTo(0, 275);
    }else{
      window.scrollTo(0, 375);
    }
  }

  onCategoryChange(category: string){
    
  }

  onDealTypeChange(dealType: string){

  }

  shareOnWhatsApp($event:any, selectedDeal: DealDataItem){
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedDeal);
  }
}
