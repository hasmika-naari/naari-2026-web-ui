import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  EnvironmentInjector,
  runInInjectionContext,
  effect,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer
} from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { faWhatsapp, faHotjar } from '@fortawesome/free-brands-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';

import { SeoService } from '@app/services/seo/seo.service';
import { AppUtilService } from '@app/services/app.util.service';
import { DealsService } from '@app/services/deals.service';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { FooterWorkifenceComponent } from '@app/pages/landing/footer-wifence/footer-wifence.component';
import {
  Category,
  PCategory,
  Slide,
  DealType,
  DealDataItem
} from '@app/services/deals.model';

@Component({
  selector: 'app-deals-image-view',
  standalone: true,
  imports: [
    CommonModule, MatMenuModule, MatIconModule, FontAwesomeModule, RouterModule, MatChipsModule,
    MatButtonModule, FormsModule, MatSelectModule, MatCardModule, MatAutocompleteModule,
    MatProgressBarModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,
    MatCheckboxModule, MatSidenavModule, FooterWorkifenceComponent
  ],
  templateUrl: './deals-image-view.component.html',
  styleUrls: ['./deals-image-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms ease-in-out')),
    ])
  ]
})
export class DealsImageViewComponent implements OnInit, OnDestroy {

  faWhatsapp = faWhatsapp;
  faHotjar = faHotjar;

  isActionInProgress = false;
  deals: DealDataItem[] = [];
  categoriesLocal: Category[] = [];
  filteredCategoriesLocal: Category[] = [];
  pCategoriesLocal: PCategory[] = [];
  dealTypes: DealType[] = [];

  selectedStatus = '-1';
  selectedCategory = 'All';
  selectedText = '';

  browser = false;
  viewCol = 20;
  isDesktop = false;
  isMobile = false;
  isTablet = false;
  dealsLoaded = false;

  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);
  private envInjector = inject(EnvironmentInjector);
  private seoService = inject(SeoService);
  private appService = inject(AppUtilService);
  private dealsService = inject(DealsService);
  private dealsStoreService = inject(DealsStoreService);
  private router = inject(Router);
  private deviceService = inject(DeviceDetectorService);

  pCategories = this.dealsStoreService.getPcCategories();
  categories = this.dealsStoreService.getCategories();
  allFilteredDeals = this.dealsStoreService.getFilteredAllDeals();

  constructor(
    private cd: ChangeDetectorRef,
    iconLibrary: FaIconLibrary
  ) {
    iconLibrary.addIcons(faHotjar, faWhatsapp);

    runInInjectionContext(this.envInjector, () => {
      effect(() => {
        const cats = this.categories();
        if (cats.length) {
          setTimeout(() => {
            this.categoriesLocal = cats;
            this.filteredCategoriesLocal = [...cats];
          });
        }

        // const pcCats = this.pCategories();
        // if (pcCats?.length) this.pCategoriesLocal = [...pcCats];

        const pcCats = this.pCategories();
        if (pcCats?.length) {
          setTimeout(() => {
            this.pCategoriesLocal = pcCats;
            // this.filteredCategoriesLocal = [...cats];
          });
        }


        const deals = this.allFilteredDeals();
        if (deals?.length) this.deals = [...deals];
      });
    });
  }

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.browser = true;

    requestAnimationFrame(() => {
      this.isActionInProgress = true;
      this.cd.detectChanges(); // <== Force re-render immediately

      const content = 'Naari Deals - Femine Specials';
      const title = 'Naari Deals - Femine Specials';
      this.seoService.setMetaDescription(content);
      this.seoService.setMetaTitle(title);

      if (this.deviceService.isDesktop()) this.isDesktop = true;
      else if (this.deviceService.isMobile()) this.isMobile = true;
      else if (this.deviceService.isTablet()) this.isTablet = true;

      if (window.innerWidth < 1280) this.viewCol = 25;

      this.loadFetcheddata();
    });
  } else {
    this.fetchData();
  }
}


  fetchData(): void {
    this.isActionInProgress = true;

    this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
      this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory, this.selectedText);
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(makeStateKey<DealDataItem[]>('dealsTable'), deals);
      } else {
        this.dealsLoaded = true;
        setTimeout(() => this.isActionInProgress = false, 400);
      }
    });

    this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(makeStateKey<Category[]>('categoriesTable'), categories);
      }
      this.dealsStoreService.updateCategories(categories);
    });

    this.dealsService.getDealTypes('usa', this.platformId).subscribe((dealTypes) => {
      this.dealTypes = [...dealTypes];
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(makeStateKey<DealType[]>('dealTypes'), dealTypes);
      }
    });
  }

  loadFetcheddata(): void {
    const dealsKey = makeStateKey<DealDataItem[]>('dealsTable');
    const dealTypesKey = makeStateKey<DealType[]>('dealTypes');
    const categoriesKey = makeStateKey<Category[]>('categoriesTable');

    if (this.transferState.hasKey(dealsKey)) {
      const deals = this.transferState.get(dealsKey, [] as DealDataItem[]);
      this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory, this.selectedText);
      this.dealsLoaded = true;
      setTimeout(() => this.isActionInProgress = false, 400);
    }

    if (this.transferState.hasKey(dealTypesKey)) {
      this.dealTypes = this.transferState.get(dealTypesKey, [] as DealType[]);
    }

    if (this.transferState.hasKey(categoriesKey)) {
      const categories = this.transferState.get(categoriesKey, [] as Category[]);
      this.dealsStoreService.updateCategories(categories);
    }
  }

  refreshData(): void {
    this.isActionInProgress = true;
    this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
      this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory, this.selectedText);
      setTimeout(() => this.isActionInProgress = false, 400);
    });
  }

  removeStausFilter() {
    this.selectedStatus = '-1';
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText);
  }

  removeCategoryFilter() {
    this.selectedCategory = 'All';
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText);
  }

  editDeal(deal: DealDataItem) {
    this.router.navigateByUrl('admin/edit-deal/' + deal.id);
  }

  deleteDeal(deal: DealDataItem) {}
  expireDeal(deal: DealDataItem) {}
  deActivateDeal(deal: DealDataItem) {}
  activateDeal(deal: DealDataItem) {}
  approveDeal(deal: DealDataItem) {}
  menuClickHandler(event: MouseEvent, deal: DealDataItem) { event.stopPropagation(); }

  showStartDate(startDate: string) {
    const dDate = new Date(startDate);
    const today = new Date();
    return dDate >= today;
  }

  setDealSelected(event: any, deal: DealDataItem) {
    deal.selected = !deal.selected;
  }

  inputChangeHandler(event: any) {
    this.selectedText = event.target.value;
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText);
  }

  selectionChangeHandler(event: any) {
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText);
  }

  get statusLabel(): string {
    if (this.selectedStatus === '' || +this.selectedStatus === -1) return 'All Deals';
    return this.selectedStatus === 'true' ? 'Approved' : 'Not Approved';
  }

  get selectedCat(): string {
    if (this.selectedCategory === '' || this.selectedCategory === 'All') return 'All Categories';
    return this.selectedCategory;
  }

  selectionStatusChangeHandler(event: any) {
    this.selectedStatus = event.value;
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText);
  }

  selectionCategoryChangeHandler(event: any) {
    this.selectedCategory = event.value;
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText);
  }

  checkDeal(deal: DealDataItem) {
    window.open(deal.dealUrl, '_blank');
  }

  postaDeal(event: any) {
    this.dealsStoreService.updateSelectedDeal(new DealDataItem());
    this.router.navigateByUrl('admin/post-deal');
  }

  ngOnDestroy(): void {}
}