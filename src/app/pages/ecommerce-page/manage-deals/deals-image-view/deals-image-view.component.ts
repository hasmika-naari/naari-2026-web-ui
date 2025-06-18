import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterContentChecked,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  inject,
  TransferState,
  PLATFORM_ID,
  makeStateKey,
  Signal,
  effect
} from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DeviceDetectorService } from 'ngx-device-detector';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { faWhatsapp, faHotjar } from '@fortawesome/free-brands-svg-icons';
import * as _ from 'lodash';
import { Subscription, Observable, merge } from "rxjs";
import { Category, CategoryListItem, DealDataItem, DealType, PCategory, Slide } from '@app/services/deals.model';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SeoService } from '@app/services/seo/seo.service';
import { AppUtilService } from '@app/services/app.util.service';
import { DealsService } from '@app/services/deals.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FooterWorkifenceComponent } from '@app/pages/landing/footer-wifence/footer-wifence.component';
import { FeathericonsModule } from '@app/icons/feathericons/feathericons.module';

export interface Deals {

  title: String;
  startDate: String;
  endDate: String;
  originalPrice: String;
  currentPrice: String;
  discount: String;
  merchant: String;
  category:String;
  tags: String;

}

export class DealsFilter {
  name: string;
  number: string;
  state: string;

  constructor() {
    this.name = '';
    this.number = '';
    this.state = '';
  }
}

@Component({
    selector: 'app-deals-image-view',
    imports: [CommonModule, MatMenuModule, MatIconModule, FontAwesomeModule, RouterModule, MatChipsModule, MatButtonModule,
        FormsModule, MatSelectModule, MatCardModule, MatAutocompleteModule, MatProgressBarModule,FeathericonsModule,
        MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule, MatSidenavModule, FooterWorkifenceComponent
    ],
    templateUrl: './deals-image-view.component.html',
    styleUrls: ['./deals-image-view.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class DealsImageViewComponent implements OnInit, OnDestroy {
  faWhatsapp = faWhatsapp;
  faHotjar = faHotjar;

  @Output() edit = new EventEmitter<DealDataItem>()
  @Output() idNums = new EventEmitter<Array<string>>()

  deals: Array<DealDataItem> = [];
  displayDeals:Array<DealDataItem> = new Array<DealDataItem>();
  public viewCol: number = 20;

  filterDeals: Array<DealDataItem> = [];
  selectedDeal = new Set<DealDataItem>();
  dealsFilter!: DealsFilter;

  isMobile: Boolean = false;
  isDesktop: Boolean = false;
  isTablet: Boolean = false;
  public page:any;

  selectedStatus: string = '-1';
  selectedCategory: string = 'All';
  selectedText: string = '';
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();


  rows: any[] = [];
  expanded: any = {};
  timeout: any;
  loginData: any;
 
  countries = [
    { viewValue: 'INDIA', value: 'india' },
    { viewValue: 'USA', value: 'usa' }
  ];
  selectedCountry = 'usa';
  isActionInProgress$!: Observable<boolean>;
  isActionInProgress: boolean =  true;
  _subs: Array<Subscription> = [];


  categoriesLocal: Array<Category> = new Array<Category>();
  pCategoriesLocal: Array<PCategory> = new Array<PCategory>();
  slides!: Array<Slide>;
  dealTypes: Array<DealType>  = new Array<DealType>();;
  dailyDeals: Array<DealDataItem> = new Array<DealDataItem>();
  isShowContent = true;
  hover = true;
  browser = false;
  myCounttry: string = '';
  dealsLoaded = false;

 updateLocalDealEffect = effect(() => {

    const ppccats = this.pCategories();
    if (ppccats) {
      this.pCategoriesLocal = [...ppccats];
    }

    const pcats = this.categories();
    if (pcats) {
      this.categoriesLocal = [...pcats];
    }

    setTimeout(() => {
      // this.isActionInProgress = false;
    }, 300);
  });

  private seoService:SeoService = inject(SeoService);
  private appService: AppUtilService =  inject(AppUtilService);
  private dealsService: DealsService= inject(DealsService);
  private _localStorageService: LocalStorageService= inject(LocalStorageService);
  private router: Router= inject(Router);
  private transferState: TransferState = inject(TransferState);
  private platformId: object =  inject(PLATFORM_ID);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  private dealsStoreService: DealsStoreService = inject(DealsStoreService);


  pCategories: Signal< Array<PCategory>> = this.dealsStoreService.getPcCategories();
  categories: Signal< Array<Category>> = this.dealsStoreService.getCategories();

  allFilteredDeals: Signal<DealDataItem[]> = this.dealsStoreService.getFilteredAllDeals();
  filteredDeals: Array<DealDataItem> = [];

  constructor(
    private cd: ChangeDetectorRef,
    library: FaIconLibrary
  ) {
   
    library.addIcons(faHotjar,faWhatsapp);
 
  //  this.filterDeals = [...this.allDeals.filter(d => d.country === this.selectedCountry)];
    // this._subs.push(this.dealsFacade.selectedCountry$.subscribe(c => {
    //   this.selectedCountry = c;
    //   this.dealsFacade.getAllDeals(this.selectedCountry);
    // }));
    

    // this.deals$ = this.dealsFacade.allDeals$;
    // this.categories$ = this.dealsFacade.categories$
    // this.isActionInProgress$ = this.dealsFacade.actionInProgress$;
    // this._subs.push(this.isActionInProgress$.subscribe((progress) => {
    //   this.isActionInProgress = progress;
    // }))

  }

  ngOnDestroy(): void {
      this._subs.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
   
    // this.deals$.subscribe((deals) => {
    //   debugger;
    //   this.deals = [..._.cloneDeep(deals)];
    //   this.filterDeals = [...this.deals.filter(d => d.country === this.selectedCountry)];
    //   this.displayDeals = [...this.deals];

    // });

    // if(isPlatformServer(this.platformId)){
    //   this.fetchData();
    //   console.log('DealsImageViewComponent: isPlatformServer' + this.platformId);
    // }else{
    //   console.log('DealsImageViewComponent: isPlatformBrowser' + this.platformId);

      // this.loadFetcheddata();
    // }

    if(isPlatformBrowser(this.platformId)){
       const content =
        'Naari Deals - Femine Specials';
       const title = 'Naari Deals - Femine Specials';
    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
    this.isActionInProgress =  true;

      this.loadFetcheddata();
      this.browser = true;
      // setTimeout(() => {
      //   this.isActionInProgress = false;
      // }, 10);
      console.log('DealsImageViewComponent: isPlatformBrowser' + this.platformId);

    if(this.deviceService.isDesktop()){
      this.isDesktop = true;
      this.isMobile = false;
      this.isTablet = false;
    }else if(this.deviceService.isMobile()){
      this.isMobile = true;
      this.isDesktop = false;
      this.isTablet = false;
    }else if(this.deviceService.isTablet()){
      this.isTablet = true;
      this.isMobile = false;
      this.isDesktop = false;
    }

     if(window.innerWidth < 1280){
      this.viewCol = 25;
    };
  }else{
    this.fetchData();
  }

    // if (this.deviceService.isMobile()) {
    //   this.isMobile = true;
    // } else {
    //   this.isMobile = false;
    // }

    // this.settingsFacadeService.setHeaderShowTime('always');
    // setTimeout(() => {
    //   this.settingsFacadeService.showHeader();
    // }, 100);

   
   
  }


  fetchData(): void{

  //   if(isPlatformServer(this.platformId)){
  //     console.log('deals-image-view - fetchData + ' + this.platformId);
  //   }
  //   // if(!this.dailyDeals.length){
      this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {

          this.deals = [..._.cloneDeep(deals)];
          this.dailyDeals = [...deals];
          this.filterDeals = [...this.deals.filter(d => d.country === this.selectedCountry)];
          console.log('Server: ' + this.deals);
          if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem[]>(
              makeStateKey('dealsTable'), deals
            );
          }else{
            this.dealsLoaded = true;
             setTimeout(() => {
              this.isActionInProgress = false;
            }, 400);
            this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory, this.selectedText);
          }
      });
  //   // }
  //   // this.dealsService.getSlidesByCountryAndTag('usa', 'HOME').subscribe((slides) => {
  //   //   this.slides = [...slides];
  //   // });
  //   // if(isPlatformBrowser(this.platformId)){
  //   //   console.log('fetch Data Browser categories' + this.categories.length);
  //   // } 
  //   // if(this.categories && !this.categories.length){
      this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
        // this.transferState.set<CategoryListItem[]>(
        //   makeStateKey('categoriesTable'), categoriesTable
        // );
        debugger;
        console.log('Categories: ' + this.categories);
        this.categoriesLocal = [...categories];
            if(isPlatformServer(this.platformId)){
              console.log('naari-home - fetchData pCategories+ ' + this.platformId);
              this.transferState.set<CategoryListItem[]>(
                makeStateKey('categoriesTable'), categories
              );
            }else{
              this.dealsStoreService.updateCategories(categories);
            }
          
          // //console.log(groupedCategories);
      });
  //   // }
  //   // if(isPlatformBrowser(this.platformId)){
  //   //   console.log('fetch Data Browser dealTypes' + this.dealTypes.length);
  //   // } 
  //   // if(this.dealTypes && !this.dealTypes.length){
  //     this.dealsService.getDealTypes('usa', this.platformId).subscribe((dealTypes) => {
  //       this.dealTypes = [...dealTypes]
  //       if(isPlatformServer(this.platformId)){
  //         console.log('naari-home - fetchData dealTypes+ ' + this.platformId);
  //         this.transferState.set<DealType[]>(
  //           makeStateKey('dealTypes'), dealTypes
  //         );
  //       }
  //     });
  //   // }

    
  //  }
  }

  loadFetcheddata(){
    console.log('This is isPlatformBrowser...');
    //  if(this.transferState.hasKey(makeStateKey('slideTable'))){
    //   this.slides = this.transferState.get(makeStateKey('slideTable'), []);
    //  }else{
    //   // this.fetchData();
    //  }
     if(this.transferState.hasKey(makeStateKey('dealsTable'))){
      let deals: Array<DealDataItem> = this.transferState.get(makeStateKey('dealsTable'), []);
      this.dealsLoaded = true;
      this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory, this.selectedText);
      // this.dailyDeals = [...this.deals];
       setTimeout(() => {
        this.isActionInProgress = false;
      }, 400);
     }else{
      // this.fetchData();
     }
     if(this.transferState.hasKey(makeStateKey('dealTypes'))){
      this.dealTypes = this.transferState.get(makeStateKey('dealTypes'), []);
     }else{
      // this.fetchData();
     }
     if(this.transferState.hasKey(makeStateKey('categoriesTable'))){
      this.categoriesLocal = this.transferState.get(makeStateKey('categoriesTable'), []);
      this.dealsStoreService.updateCategories(this.categoriesLocal);

     }else{
      // this.fetchData();
     }

    //  this.isActionInProgress = false;

}

removeStausFilter(){
  this.selectedStatus = '-1'
}

removeCategoryFilter(){
  this.selectedCategory = ''
}


  editDeal(deal: any){
    this.edit.emit(deal);
  }
  
  showStartDate(startDate: any){
    let dDate: Date = new Date(startDate);
    let today: Date = new Date();
    return (dDate >= today);
  }

  deleteDeal(deal: DealDataItem){
    // this.dealsFacade.deleteDeal(deal);
  }

  expireDeal(deal: any){

  }

  deActivateDeal(deal: DealDataItem){
    let uDeal: DealDataItem = _.cloneDeep(deal);
    uDeal.active = 'false';
    // this.dealsFacade.updateDeal(uDeal);
  }

  
  activateDeal(deal: DealDataItem){
    let uDeal: DealDataItem = _.cloneDeep(deal);

    uDeal.active = 'true';
    // this.dealsFacade.updateDeal(uDeal);
  }

  approveDeal(deal: DealDataItem){
    let uDeal: DealDataItem = _.cloneDeep(deal);

    uDeal.active = 'true';
    uDeal.approved = true;
    // this.dealsFacade.updateDeal(uDeal);
  }

  setDealSelected($event: any, deal: DealDataItem){
    // $event.stopPropagation();
    deal.selected = !deal.selected;
    let ids: Array<string> = [];
    this.deals.forEach(d => {
      if(d.selected){
        ids.push(d.id);
      }
    })
    this.idNums.emit(ids);
  }

  inputChangeHandler($event: any){
    this.selectedText = $event.target.value;
    // this.dealsFacade.setActionInProgress();
    // this.filterDeals = [...this.deals.filter(d => d.title.toLowerCase().indexOf(textVal.toLowerCase()) !== -1)];
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText)
    setTimeout(() => {
      // this.dealsFacade.stopActionInProgress();
    }, 100);
    debugger;
  }
  
  
  selectionChangeHandler($event: any){
    // this.dealsFacade.setActionInProgress();
    // this.dealsFacade.setSelectedCountry($event.value);
    // this.filterDeals = [...this.deals.filter(d => d.country === $event.value)];
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText)
    setTimeout(() => {
      // this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  get statusLabel(): string {
  if (this.selectedStatus === '' || +this.selectedStatus === -1) return 'All Deals';
  return this.selectedStatus === 'true' ? 'Approved' : 'Not Approved';
  }

    get selectedCat(): string {
  if (this.selectedCategory === ''  || this.selectedCategory === 'All') return 'All Categories';
  return this.selectedCategory;
  }
  
  selectionStatusChangeHandler($event: any){
    // this.dealsFacade.setActionInProgress();
    debugger;
    this.selectedStatus = $event.value;
    // if(+$event.value === -1){
    //   this.filterDeals = [...this.deals];
    // }else{
    //   this.filterDeals = [...this.deals.filter(d => {
    //     debugger;
    //     let check = (d.approved === JSON.parse($event.value));
    //     return check;
    //   })];
    // }
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText)
    setTimeout(() => {
      // this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  selectionCategoryChangeHandler($event: any){
    // this.dealsFacade.setActionInProgress();
    this.selectedCategory = $event.value;
    // this.filterDeals = [...this.deals.filter(d => d.category === $event.value)];
    this.dealsStoreService.filterAllDeals(this.selectedStatus, this.selectedCategory, this.selectedText)
    setTimeout(() => {
      // this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  checkDeal(deal: DealDataItem){
    window.open(deal.dealUrl);
  }

  selectRow($event: any, deal:DealDataItem){
    // this.dealsFacade.setSelectedRowDeal(deal);
  }
  
  menuClickHandler($event: any, deal:DealDataItem){
    $event.stopPropagation();
  }
  onActivate($event: any){
    // if($event.type == 'click') {
    //   this.dealsFacade.setSelectedAgency($event.row);
    //   this.router.navigateByUrl('/agency/agency-details');
    // }

  }

  onPage(event: MouseEvent) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  clearNameFilter($event: MouseEvent) {
    // $event.stopPropagation();
    // this.agencyFilter.name = '';

    // this.searchAgency($event);
  }

  clearStateFilter($event: MouseEvent) {
    // $event.stopPropagation();
    // this.agencyFilter.state = '';

    // this.searchAgency($event);
  }

  clearNumberFilter($event: MouseEvent) {
    // $event.stopPropagation();
    // this.agencyFilter.number = '';

    // this.searchAgency($event);
  }

  navigateToDetails(event: MouseEvent, agency: DealDataItem) {
    // this.dealsFacade.setSelectedAgency(agency);
    // this.router.navigateByUrl('/agency/agency-details');
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    }


  goToFeaturesHandler($event: MouseEvent) {
    this.router.navigateByUrl('/dashboard');
  }

  nameChangeHandler($event: any) {
    // this.agencyFilter.name = $event;
  }

  numberChangeHandler($event: any) {
    // this.agencyFilter.number = $event;
  }

  stateChangeHandler($event: any) {
    // this.agencyFilter.state = $event;
  }

  refreshData($event: any){
    this.isActionInProgress = true;
    this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
      this.dealsStoreService.updateAllDeals(deals, this.selectedStatus, this.selectedCategory, this.selectedText)
      // this.deals = [..._.cloneDeep(deals)];
      // this.filterDeals = [...this.deals.filter(d => d.country === this.selectedCountry)];
      setTimeout(() => {
        this.isActionInProgress = false;
      }, 400);
      // this.isActionInProgress = false;
    });
  }

}