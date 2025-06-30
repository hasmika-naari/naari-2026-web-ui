import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, Inject, Injector, OnInit, PLATFORM_ID, Signal, TransferState, effect, inject, makeStateKey, runInInjectionContext } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Category, DealType, Merchant, PCategory } from '@app/services/deals.model';
import { DealsService } from '@app/services/deals.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CategoryListComponent } from './category-list/category-list.component';
declare var bootstrap: any;

@Component({
    selector: 'app-category-sidebar',
    imports: [
        CommonModule, NgOptimizedImage, RouterModule, 
        RouterLink, NgbModule, NgbNavModule,CategoryListComponent
    ],
    templateUrl: './category-sidebar.component.html',
    styleUrls: ['./category-sidebar.component.scss']
})
export class CategorySidebarComponent implements OnInit {
  country: string = '';
  selectedCountry: any = '';
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;

  pCatsLocal: PCategory[] = [];
  catsLocal: Category[] = [];
  pCategories!: Signal<PCategory[]>;
  categories!: Signal<Category[]>;
  dealTypes: DealType[] = [];
  merchants: Merchant[] = [];
  selectedCategoryCode: string = '';
  selectedDealTypeCode: string = '';

  private _localStorageService: LocalStorageService= inject(LocalStorageService);

  constructor( 
    @Inject(PLATFORM_ID) private platformId: object,
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
     private transferState: TransferState,
    private deviceService: DeviceDetectorService,
    private dealsService: DealsService,
    private dealsStoreService: DealsStoreService) {
   
    if (isPlatformBrowser(this.platformId)) {
      this.browser = true;
      this.isDesktop = this.deviceService.isDesktop();
      this.isMobile = this.deviceService.isMobile();
      this.isTablet = this.deviceService.isTablet();
    }

    // Assign after dealsStoreService is ready
    this.pCategories = this.dealsStoreService.getPcCategories();
    this.categories = this.dealsStoreService.getCategories();

    this.loadFetcheddata();
    let hasInitialized = false;

 runInInjectionContext(this.injector, () => {
    effect(() => {
      const pCats = this.pCategories();
      const catList = this.categories();

      if (!hasInitialized && pCats.length > 0 && catList.length > 0) {
        this.pCatsLocal = [...pCats];
        this.catsLocal = [...catList];
        hasInitialized = true;
      }
    });
  });

   }

  ngOnInit() {
  }

   loadFetcheddata() {
    const getOrFetch = <T>(key: string, fetchFn: () => void): T[] => {
      const stateKey = makeStateKey<T[]>(key);
      const value = this.transferState.get(stateKey, []);
      if (!value.length) fetchFn();
      return value;
    };

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


  // countrySelectionChanged($event){
  //   
  //   if($event.value === '1'){
  //     this.selectedCountry = '1';
  //     this._localStorageService.setItem('naariCountry', 'usa');
  //     this.dealStoreFacade.setSelectedCountry('usa');
  //     this.country = 'usa';
  //   }else{
  //     this.selectedCountry = '2';
  //     this._localStorageService.setItem('naariCountry', 'india');
  //     this.dealStoreFacade.setSelectedCountry('india');
  //     this.country = 'india';
  //   }
  // }

  onCategorySelected(category: Category): void {
  this.selectedCategoryCode = category.code;
  this.dealsStoreService.updateSelectedCategory(category);
    debugger;
  this.selectedDealTypeCode = 'All'; // Reset to 'All' when a category
  // Navigate with updated query params
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      category: this.selectedCategoryCode,
      type: this.selectedDealTypeCode
    },
    queryParamsHandling: 'merge',
  });

  // Close modal using Bootstrap’s JS
  const modalEl = document.getElementById('categoryModalSidebar2');
  if (modalEl) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
  }
}


}
