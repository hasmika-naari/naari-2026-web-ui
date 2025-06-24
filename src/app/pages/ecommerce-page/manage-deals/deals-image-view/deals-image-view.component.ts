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
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  DealDataItem,
  AmazonDealDataRequestItem,
  PostDealItem
} from '@app/services/deals.model';
import _ from 'lodash';
import { response } from 'express';
import { AmazonDealDialogComponent } from '../amazon-deal-dialog/amazon-deal-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-deals-image-view',
  standalone: true,
  imports: [
    CommonModule, MatMenuModule, MatIconModule, FontAwesomeModule, RouterModule, MatChipsModule,
    MatButtonModule, FormsModule, MatSelectModule, MatCardModule, MatAutocompleteModule,
    MatProgressBarModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDialogModule,
    MatCheckboxModule, MatSidenavModule, FooterWorkifenceComponent, AmazonDealDialogComponent,MatDatepickerModule
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
  public amazonDealFormGroup!: UntypedFormGroup;
  isActionInProgress = false;
  deals: DealDataItem[] = [];
  categoriesLocal: Category[] = [];
  filteredCategoriesLocal: Category[] = [];
  pCategoriesLocal: PCategory[] = [];
  dealTypesLocal: DealType[] = [];
  title = 'Load Amazon Deals';
  buttonTitle = 'Load Deals';
  selectedStatus = '-1';
  selectedCategory = 'All';
  selectedText = '';
   countries = [
    { viewValue: 'USA', value: 'usa' },
    { viewValue: 'INDIA', value: 'india' }
  ];
  subs: Array<Subscription> = [];
  postDealItems: Array<PostDealItem> = [
    {
      title: 'Deal URL',
      valid: 1
    },
    {
      title: 'Deal Title',
      valid: 1
    },
    {
      title: 'Description',
      valid: 0
    },
    {
      title: 'Deal Type',
      valid: 0
    },
    {
      title: 'Deal Category',
      valid: 0
    },
    {
      title: 'Image URL',
      valid: 0
    },
    {
      title: 'Country',
      valid: 0
    },
    {
      title: 'Current Price',
      valid: 0
    },
    {
      title: 'Original Price',
      valid: 0
    },
    {
      title: 'Discount',
      valid: 0
    },
    {
      title: 'Discount Type',
      valid: 0
    },
    {
      title: 'Stores',
      valid: 0
    },
    
  
  ];
  marketPlaces = [
    { viewValue: 'AMAZON-USA', value: 'www.amazon.com' },
    { viewValue: 'AMAZON-IN', value: 'www.amazon.in' }
  ];
  partnerTags = [
    { viewValue: 'NaariDeals-USA', value: 'naarideals00-20' },
    { viewValue: 'Naarideals-IN', value: 'naarideals00-21' }
  ];
  searchIndex = [
    { viewValue: 'All Departments', value: 'All' },
    { viewValue: 'Prime Video', value: 'AmazonVideo' },
    { viewValue: 'Clothing & Accessories', value: 'Apparel' },
    { viewValue: 'Appliances', value: 'Appliances' },
    { viewValue: 'Arts, Crafts & Sewing', value: 'ArtsAndCrafts' },
    { viewValue: 'Automotive Parts & Accessories', value: 'Automotive' },
    { viewValue: 'Baby', value: 'Baby' },
    { viewValue: 'Beauty & Personal Care', value: 'Beauty' },
    { viewValue: 'Books', value: 'Books' },
    { viewValue: 'Classical', value: 'Classical' },
    { viewValue: 'Collectibles & Fine Art', value: 'Collectibles' },
    { viewValue: 'Computers', value: 'Computers' },
    { viewValue: 'Digital Music', value: 'DigitalMusic' },
    { viewValue: 'Digital Educational Resources', value: 'DigitalEducationalResources' },
    { viewValue: 'Electronics', value: 'Electronics' },
    { viewValue: 'Everything Else', value: 'EverythingElse' },
    { viewValue: 'Clothing, Shoes & Jewelry', value: 'Fashion' },
    { viewValue: 'Clothing, Shoes & Jewelry Baby', value: 'FashionBaby' },
    { viewValue: 'Clothing, Shoes & Jewelry Girls', value: 'FashionGirls' },
    { viewValue: 'Clothing, Shoes & Jewelry Women', value: 'FashionWomen' },
    { viewValue: 'Garden & Outdoor', value: 'GardenAndOutdoor' },
    { viewValue: 'Gift Cards', value: 'GiftCards' },
    { viewValue: 'Grocery & Gourmet Food', value: 'GroceryAndGourmetFood' },
    { viewValue: 'Handmade', value: 'Handmade' },
    { viewValue: 'Health, Household & Baby Care', value: 'HealthPersonalCare' },
    { viewValue: 'Home & Kitchen', value: 'HomeAndKitchen' },
    { viewValue: 'Industrial & Scientific', value: 'Industrial' },
    { viewValue: 'Jewelry', value: 'Jewelry' },
    { viewValue: 'Kindle Store', value: 'KindleStore' },
    { viewValue: 'Home & Business Services', value: 'LocalServices' },
    { viewValue: 'Luggage & Travel Gear', value: 'Luggage' },
    { viewValue: 'Luxury Beauty', value: 'LuxuryBeauty' },
    { viewValue: 'Magazine Subscriptions', value: 'Magazines' },
    { viewValue: 'Cell Phones & Accessories', value: 'MobileAndAccessories' },
    { viewValue: 'Apps & Games', value: 'MobileApps' },
    { viewValue: 'Movies & TV', value: 'MoviesAndTV' },
    { viewValue: 'CDs & Vinyl', value: 'Music' },
    { viewValue: 'Musical Instruments', value: 'MusicalInstruments' },
    { viewValue: 'Office Products', value: 'OfficeProducts' },
    { viewValue: 'Camera & Photo', value: 'Photo' },
    { viewValue: 'Shoes', value: 'Shoes' },
    { viewValue: 'Software', value: 'Software' },
    { viewValue: 'Sports & Outdoors', value: 'SportsAndOutdoors' },
    { viewValue: 'Tools & Home Improvement', value: 'ToolsAndHomeImprovement' },
    { viewValue: 'Toys & Games', value: 'ToysAndGames' },
    { viewValue: 'VHS', value: 'VHS' },
    { viewValue: 'Video Games', value: 'VideoGames' },
    { viewValue: 'Watches', value: 'Watches' }
  ];

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
  dealTypes = this.dealsStoreService.getDealTypes();
  allFilteredDeals = this.dealsStoreService.getFilteredAllDeals();

  constructor(
    private cd: ChangeDetectorRef,
    iconLibrary: FaIconLibrary,
    public dialog: MatDialog,
    public fb: UntypedFormBuilder
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

         const dTypes = this.dealTypes();
        if (dTypes.length) {
          setTimeout(() => {
            this.dealTypesLocal = dTypes;
            // this.filteredCategoriesLocal = [...cats];
          });
        }


        const deals = this.allFilteredDeals();
        if (deals?.length) this.deals = [...deals];
      });
    });
  }

  ngOnInit(): void {
     this.amazonDealFormGroup = this.fb.group({
          keywords: new FormControl('', Validators.required),
          searchIndex: new FormControl('', Validators.required),
          minSavingPercent: new FormControl(null, [Validators.required, Validators.min(0)]),
          maxPrice: new FormControl(''),
          partnerTag: new FormControl('', Validators.required),
          marketplace: new FormControl('', Validators.required),
          validDays: new FormControl('', Validators.required),
          type: new FormControl('', [Validators.required]),
          category: new FormControl('', Validators.required),
          country: new FormControl('', Validators.required),
          startDate: new FormControl('', Validators.required),
          numPages: new FormControl('', Validators.required)
        }); 

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
      this.dealTypesLocal = [...dealTypes];
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(makeStateKey<DealType[]>('dealTypes'), dealTypes);
      }
    });
  }

  loadFetcheddata(): void {
    const dealsKey = makeStateKey<DealDataItem[]>('dealsTable');
    const dealTypesKey = makeStateKey<DealType[]>('dealTypes');
    const categoriesKey = makeStateKey<Category[]>('categoriesTable');

    let keysFound = false;

    if (this.transferState.hasKey(dealsKey)) {
      const deals = this.transferState.get(dealsKey, [] as DealDataItem[]);
      this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory, this.selectedText);
      this.dealsLoaded = true;
      keysFound = true;
      setTimeout(() => this.isActionInProgress = false, 400);
    }

    if (this.transferState.hasKey(dealTypesKey)) {
      this.dealTypesLocal = this.transferState.get(dealTypesKey, [] as DealType[]);
        keysFound = true;
    }

    if (this.transferState.hasKey(categoriesKey)) {
      const categories = this.transferState.get(categoriesKey, [] as Category[]);
      this.dealsStoreService.updateCategories(categories);
        keysFound = true;
    }
     // Even if TransferState keys don't exist, stop loader
    setTimeout(() => {
      this.isActionInProgress = false;

      // If no keys found, optionally fetch
      if (!keysFound) {
        this.fetchData(); // fallback
      }
    }, 400);
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

   submitForm($event: any){
    $event.stopPropagation();

    //consolie.log(this.amazonDealFormGroup.value);
    if(this.amazonDealFormGroup.valid){

      let amazonAPIRequest: AmazonDealDataRequestItem = new AmazonDealDataRequestItem();
      amazonAPIRequest.keywords = this.amazonDealFormGroup.controls['keywords'].value;
      amazonAPIRequest.searchIndex = this.amazonDealFormGroup.controls['searchIndex'].value;
      amazonAPIRequest.minSavingPercent = this.amazonDealFormGroup.controls['minSavingPercent'].value;
      amazonAPIRequest.maxPrice = this.amazonDealFormGroup.controls['maxPrice'].value;
      amazonAPIRequest.validDays = this.amazonDealFormGroup.controls['validDays'].value;
      amazonAPIRequest.tags = this.amazonDealFormGroup.controls['type'].value?this.amazonDealFormGroup.controls['type'].value.join(','):'';
      amazonAPIRequest.category = this.amazonDealFormGroup.controls['category'].value;
      amazonAPIRequest.country = this.amazonDealFormGroup.controls['country'].value;
      amazonAPIRequest.partnerTag = this.amazonDealFormGroup.controls['partnerTag'].value;
      amazonAPIRequest.marketplace = this.amazonDealFormGroup.controls['marketplace'].value;
      amazonAPIRequest.numPages = this.amazonDealFormGroup.controls['numPages'].value;

      let sDate = new Date(this.amazonDealFormGroup.controls['startDate'].value);
      amazonAPIRequest.startDate = (sDate.getMonth() + 1).toString().padStart(2, "0") + "/" + sDate.getDate().toString().padStart(2, "0") + "/" + sDate.getFullYear();

       this.dealsService.loadAmazonDeals(amazonAPIRequest).subscribe(response => {
          this.dealsService.getDealsByCountry('usa', this.platformId).subscribe(deals => {
          this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory,  this.selectedText);
        });
      });
    }
  }

  isInactive(deal: DealDataItem): boolean {
  return String(deal.active) === 'false';
}

  removeCategoryFilter() {
    this.selectedCategory = 'All';
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText);
  }

  editDeal(deal: DealDataItem) {
    this.router.navigateByUrl('admin/edit-deal/' + deal.id);
  }

  deleteDeal(deal: DealDataItem) {
     this.dealsService.deleteDeal(deal.id).subscribe(res => {
      this.dealsService.getDealsByCountry('usa', this.platformId).subscribe(deals => {
        this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory,  this.selectedText);
      });
    });
  }

   deleteSelectedDeals($event: any){
    // Get selected deals (assuming `selected` is a boolean field)
    const selectedDeals = this.allFilteredDeals().filter(deal => deal.selected);

    // Get array of IDs as strings
    const selectedDealIds: string[] = selectedDeals.map(deal => String(deal.id));
    if(selectedDealIds.length){
     this.dealsService.deleteSelectedDeals(selectedDealIds).subscribe(response => {
        this.dealsService.getDealsByCountry('usa', this.platformId).subscribe(deals => {
        this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory,  this.selectedText);
      });
      });
    }
  }

  deleteExpiredDealsByCountry(country:string){
      this.dealsService.deleteAllExipredDeals(country).subscribe(response => {
        this.dealsService.getDealsByCountry('usa', this.platformId).subscribe(deals => {
        this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory,  this.selectedText);
      });
      });
  }

  expireDeal(deal: DealDataItem) {

  }

    loadAmazonDeals($event: any, rightSidenav: any){
     debugger;
     if(rightSidenav){rightSidenav.open()};
    // const dialogRef = this.dialog.open(AmazonDealDialogComponent, {
    //   maxWidth: '60vw',
    //   maxHeight: '60vh',
    //   data: { },
    //   panelClass: ['theme-dialog'],
    //   autoFocus: false,
    //   direction: 'ltr' 
    // });
    // dialogRef.afterClosed().subscribe((amazonDealsRequest: AmazonDealDataRequestItem) => {
    //   debugger;
    //   if(amazonDealsRequest){
    //     this.isActionInProgress = true;
    //     this.dealsService.loadAmazonDeals(amazonDealsRequest).subscribe(res => {

    //       setTimeout(() => {
    //           this.dealsService.getDealsByCountry('usa', this.platformId).subscribe(deals => {
    //             this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory,  this.selectedText);
    //                 this.isActionInProgress = false;

    //             });
    //           }, 1000);

    //     })
    //       // this.dealsFacade.loadAmazonDeals(amazonDealsRequest);
    //   }
    // });
  }

  deActivateDeal(deal: DealDataItem) {
    let uDeal: DealDataItem = _.cloneDeep(deal);
    uDeal.active = 'false';
    this.dealsService.updateDeal(uDeal).subscribe(res => {
      this.dealsService.getDealsByCountry('usa', this.platformId).subscribe(deals => {
        this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory,  this.selectedText);
      });
    });
  }
  activateDeal(deal: DealDataItem) {
      let uDeal: DealDataItem = _.cloneDeep(deal);
    uDeal.active = 'true';
    this.dealsService.updateDeal(uDeal).subscribe(res => {
      this.dealsService.getDealsByCountry('usa', this.platformId).subscribe(deals => {
        this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory,  this.selectedText);
      });
    });
  }
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