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
  EventEmitter
} from '@angular/core';

import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SettingsStoreFacade } from '@app/core/store/settings/settings-store.facade';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Category, DealDataItem, Merchant } from '@app/core/store/deals/deals.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DealsStoreFacade } from '@app/core/store/deals/deals-store.facade';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/naari-core.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { faWhatsapp, faHotjar } from '@fortawesome/free-brands-svg-icons';
import * as _ from 'lodash';

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
  selector: 'app-merchant-image-view',
  templateUrl: './merchant-image-view.component.html',
  styleUrls: ['./merchant-image-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MerchantImageViewComponent implements OnInit {
  faWhatsapp = faWhatsapp;
  faHotjar = faHotjar;

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  @Output() edit = new EventEmitter<DealDataItem>()
  deals$: Observable<Array<DealDataItem>>;
  deals: Array<DealDataItem> = [];
  displayDeals:Array<DealDataItem> = new Array<DealDataItem>();
  public viewCol: number = 20;

  filterDeals: Array<DealDataItem> = [];
  categories$: Observable<Array<Category>>;
  selectedDeal = new Set<DealDataItem>();
  dealsFilter: DealsFilter;

  isMobile: Boolean = false;
  isDesktop: Boolean = false;
  isTablet: Boolean = false;
  public page:any;

  selectedStatus: string = '-1';
  selectedCategory: string = '';

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
  isActionInProgress$: Observable<boolean>;
  _subs: Array<Subscription> = [];
  constructor(
    public deviceService: DeviceDetectorService,
    public dealsFacade: DealsStoreFacade,
    private cd: ChangeDetectorRef,
    public settingsFacadeService: SettingsStoreFacade,
    private router: Router,
    private authStoreFacade: DealsStoreFacade
  ) {
    
    this._subs.push(this.dealsFacade.selectedCountry$.subscribe(c => {
      this.selectedCountry = c;
      this.dealsFacade.getAllDeals(this.selectedCountry);
    }));
    this.deals$ = this.dealsFacade.allDeals$;
    this.categories$ = this.dealsFacade.categories$
    this.isActionInProgress$ = this.dealsFacade.actionInProgress$;


  }

  ngOnInit() {
   
    this.deals$.subscribe((deals) => {
      debugger;
      this.deals = [...deals];
      this.filterDeals = [...deals.filter(d => d.country === this.selectedCountry)];
      this.displayDeals = [...this.deals];

    });

    if (this.deviceService.isMobile()) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    this.settingsFacadeService.setHeaderShowTime('always');
    setTimeout(() => {
      this.settingsFacadeService.showHeader();
    }, 100);

   
    if(window.innerWidth < 1280){
      this.viewCol = 25;
    };
  }

  editDeal(deal){
    this.edit.emit(deal);
  }

  deleteDeal(deal: DealDataItem){
    this.dealsFacade.deleteDeal(deal);
  }

  expireDeal(deal){

  }

  deActivateDeal(deal: DealDataItem){
    let uDeal: DealDataItem = _.cloneDeep(deal);
    uDeal.active = 'false';
    this.dealsFacade.updateDeal(uDeal);
  }

  
  activateDeal(deal: DealDataItem){
    let uDeal: DealDataItem = _.cloneDeep(deal);

    uDeal.active = 'true';
    this.dealsFacade.updateDeal(uDeal);
  }

  approveDeal(deal: DealDataItem){
    let uDeal: DealDataItem = _.cloneDeep(deal);

    uDeal.active = 'true';
    uDeal.approved = true;
    this.dealsFacade.updateDeal(uDeal);
  }


  inputChangeHandler($event: any){
    let textVal = $event.target.value;
    this.dealsFacade.setActionInProgress();
    this.filterDeals = [...this.deals.filter(d => d.title.toLowerCase().indexOf(textVal.toLowerCase()) !== -1)];
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
    debugger;
  }
  
  
  selectionChangeHandler($event){
    this.dealsFacade.setActionInProgress();
    this.filterDeals = [...this.deals.filter(d => d.country === $event.value)];
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
  }
  
  selectionStatusChangeHandler($event){
    this.dealsFacade.setActionInProgress();
    debugger;
    if(+$event.value === -1){
      this.filterDeals = [...this.deals];
    }else{
      this.filterDeals = [...this.deals.filter(d => {
        debugger;
        let check = (d.approved === JSON.parse($event.value));
        return check;
      })];
    }
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  selectionCategoryChangeHandler($event){
    this.dealsFacade.setActionInProgress();
    this.filterDeals = [...this.deals.filter(d => d.category === $event.value)];
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  checkDeal(deal: DealDataItem){
    window.open(deal.dealUrl);
  }

  selectRow($event, deal:DealDataItem){
    this.dealsFacade.setSelectedRowDeal(deal);
  }
  
  menuClickHandler($event, deal:DealDataItem){
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
      //consolie.log('paged!', event);
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

  refreshData($event){
    this.dealsFacade.getAllDeals(this.selectedCountry);
  }

}