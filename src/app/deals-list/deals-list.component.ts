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
import { CategorySidebarComponent } from './category-sidebar/category-sidebar.component';
import { MerchantSidebarComponent } from './merchant-sidebar/merchant-sidebar.component';
import { DealTypeSidebarComponent } from './deal-type-sidebar/deal-type-sidebar.component';
import { FooterWorkifenceComponent } from '@app/pages/landing/footer-wifence/footer-wifence.component';

@Component({
    selector: 'app-deals-list',
    imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, NgxPaginationModule,
        NgOptimizedImage, HeaderStyleComponent, DealsBlogComponent, FooterComponent,
        CarouselModule, MatButtonModule, MatChipsModule, MatIconModule, MatFormFieldModule,
        MatSelectModule,CategorySidebarComponent,MerchantSidebarComponent, DealTypeSidebarComponent,
        FooterWorkifenceComponent,
        MatMenuModule, LanguageSubscribeComponent, MatCardModule, MatProgressBarModule],
    templateUrl: './deals-list.component.html',
    styleUrls: ['./deals-list.component.scss']
})
export class DealsListComponent implements OnInit, OnDestroy {
  page: number = 0;
  readonly counts: number[] = [42, 84, 126];
  readonly viewCol: number = 2;
  readonly maxSize = 5;
  readonly autoHide = false;
  readonly country: string = 'usa';
  selectedSorting: DealSorting = { title: 'High to Low', isSelected: true };
  readonly sortings = [
    { title: 'Default', isSelected: true },
    { title: 'Low to High', isSelected: false },
    { title: 'High to Low', isSelected: true }
  ];

  isToggled = false;
  pCategories!: Signal<Array<PCategory>>;
  private pCategoriesLocal: Array<PCategory> = [];
  categories!: Signal<Array<Category>>;
  public categoriesLocal: Array<Category> = [];
  private filteredCategoriesLocal: Category[] = [];
  dealTypes!: Signal<Array<DealType>>;
  public dealTypesLocal: Array<DealType> = [];
  selectedDealType!: Signal<DealType>;
  selectedDealTypeLocal: DealType = new DealType();
  selectedCategory!: Signal<Category>;
  selectedCategoryLocal!: Category;
  allFilteredDeals!: Signal<Array<DealDataItem>>;
  public dealsLocal: Array<DealDataItem> = [];
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  public currentUrl = '';
  private subs: Array<Subscription> = [];

  private readonly dealsStoreService = inject(DealsStoreService);

  public selectedCategoryCode: string = 'All';
  public selectedDealTypeCode: string = 'All';

  selectedMerchant: any = {title: 'All'};

  constructor(
    public readonly themeService: ThemeCustomizerService,
    private readonly injector: Injector,
    private readonly seoService: SeoService,
    private readonly appService: AppUtilService,
    private readonly dealsService: DealsService,
    private readonly authService: AuthService,
    private readonly _localStorageService: LocalStorageService,
    private readonly router: Router,
    private readonly transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly deviceService: DeviceDetectorService,
    private readonly route: ActivatedRoute,
    private readonly meta: Meta,
    private readonly title: Title
  ) {
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
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

        const dealTypes = this.dealTypes();
        if (dealTypes?.length) {
          this.dealTypesLocal = [...dealTypes.filter(d => d.status === 'active')];
        }

        const selectedDealType = this.selectedDealType();
        if (selectedDealType && selectedDealType.code) {    
          this.selectedDealTypeLocal = selectedDealType;
          this.selectedDealTypeCode = selectedDealType.code;
          this.loadDealPageBreadgrumText(selectedDealType, this.selectedCategory());
        } else {
          this.selectedDealTypeLocal = new DealType();
          this.selectedDealTypeCode = 'All';
          this.loadDealPageBreadgrumText(this.selectedDealTypeLocal, this.selectedCategory());
        }   

        const selectedCategory = this.selectedCategory();
        if (selectedCategory && selectedCategory.code) {    
          this.selectedCategoryLocal = selectedCategory;
          this.selectedCategoryCode = selectedCategory.code;
        }   
        else {
          this.selectedCategoryLocal = new Category();
          this.selectedCategoryCode = 'All';
        }   

      });

    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.browser = true;
      this.isDesktop = this.deviceService.isDesktop();
      this.isMobile = this.deviceService.isMobile();
      this.isTablet = this.deviceService.isTablet();
    }
    // const dealType = this.route.snapshot.queryParams['type'] || 'All';
    // const category = this.route.snapshot.queryParams['category'] || 'All';
    // this.fetchData(dealType, category);
     // 👇 Reactively handle route query param changes
    const queryParamSub = this.route.queryParams.subscribe(params => {
      const dealType = params['type'] || 'All';
      const category = params['category'] || 'All';
      this.fetchData(dealType, category);
      this.currentUrl = category;
      this.selectedDealTypeCode = dealType;
    });
    this.subs.push(queryParamSub); // to clean up later in ngOnDestroy

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
      this.currentUrl = category;
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

  loadDealPageBreadgrumText(dealType: DealType, category: Category): void {
    let selType = '';
    if (dealType && dealType.code) {
      selType = dealType.title;
      let selectedDealTitle = ' 🔥 Naari Deals - ' + selType ? selType + ' Savings Deals for You' : 'All Best Deals';
      this.meta.updateTag({ property: "og:title", content: selectedDealTitle });
      this.meta.updateTag({ property: "og:description", content: 'Share & Help Friends to Save more..' });
      this.meta.updateTag({ property: "og:url", content: "https://naarideals.com/deals" });

      this.meta.updateTag({ property: "twitter:title", content: selectedDealTitle });
      this.meta.updateTag({ property: "twitter:description", content: 'Share & Help Friends to Save more..' });
      this.meta.updateTag({ property: "twitter:url", content: "https://naarideals.com/deals" });
    }
    if (category && category.code) {
      selType = selType + ' ' + category.title  ;
    }
    this.currentUrl = selType;

    this.title.setTitle(this.currentUrl);
  }

  gotToShop(dealUrl: string): void {
    window.open(dealUrl);
  }

  public onPageChanged(event: number): void {
    this.page = event;
    if (this.isMobile) {
      window.scrollTo(0, 275);
    } else {
      window.scrollTo(0, 375);
    }
  }

  showStartDate(startDate: string): boolean {
    let dDate: Date = new Date(startDate);
    let today: Date = new Date();
    return (dDate >= today);
  }

  public changeSorting(sort: DealSorting): void {
    this.selectedSorting = sort;
    this.dealsStoreService.sortDeals(sort);
    if (this.isMobile) {
      window.scrollTo(0, 275);
    } else {
      window.scrollTo(0, 375);
    }
  }

  onCategoryChange(category: string): void {
    this.selectedCategoryCode = category;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategoryCode,
        type: this.selectedDealTypeCode
      },
      queryParamsHandling: 'merge',
    });
    this.fetchData(this.selectedDealTypeCode, this.selectedCategoryCode);
    if (this.isMobile) {
      window.scrollTo(0, 275);
    } else {
      window.scrollTo(0, 375);
    }
  }

  onDealTypeChange(dealType: string): void {
    this.selectedDealTypeCode = dealType;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategoryCode,
        type: this.selectedDealTypeCode
      },
      queryParamsHandling: 'merge',
    });
    this.fetchData(this.selectedDealTypeCode, this.selectedCategoryCode);
    if (this.isMobile) {
      window.scrollTo(0, 275);
    } else {
      window.scrollTo(0, 375);
    }
  }

  openMerchantSidenav(){

  }

  openCategorySidenav(){

  }

  openDealTypeSidenav(){

  }

  shareOnWhatsApp($event: Event, selectedDeal: DealDataItem): void {
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedDeal);
  }

  // Add a trackBy function for ngFor best practice
  trackByCategoryCode(index: number, item: Category): string {
    return item.code;
  }
  trackByDealTypeCode(index: number, item: DealType): string {
    return item.code;
  }
  trackByDealId(index: number, item: DealDataItem): string {
    return item.id;
  }
}
