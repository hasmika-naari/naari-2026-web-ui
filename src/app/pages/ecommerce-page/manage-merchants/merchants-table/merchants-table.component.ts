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
import { Observable } from 'rxjs';
import { SettingsStoreFacade } from '@app/core/store/settings/settings-store.facade';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Category, DealDataItem, Merchant, SocialLinks } from '@app/core/store/deals/deals.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DealsStoreFacade } from '@app/core/store/deals/deals-store.facade';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/naari-core.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UploadService } from '@app/shared/module/file-upload/upload.service';

export interface MerchantTableItem {
  code : string;
  id: string;
  title: string;
  subTitle: string;
  address: string;
  phone: string;
  country: string;
  city: string;
  imageUrl: string;
  type: string;
  location: string;
  siteUrl: string;
  status: string;
  socialLinks: Array<SocialLinks>;
}

export class MerchantFilter {
  name: string;
  zipCode: string;
  state: string;
  country: string;
  status: string;

  constructor() {
    this.name = '';
    this.zipCode = '';
    this.state = '';
    this.country = '';
    this.status = '';
  }
}

export class NGXDataTableMessages {
  emptyMessage!: string;
  totalMessage!: string;
  selectedMessage!: string;

  constructor() {
    this.emptyMessage = 'No Merchants Found';
    this.totalMessage = 'Total Merchants';
  }
}
@Component({
  selector: 'app-merchants-table',
  templateUrl: './merchants-table.component.html',
  styleUrls: ['./merchants-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MerchantsTableComponent implements OnInit {


  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  @Output() edit = new EventEmitter<Merchant>()
  merchants$: Observable<Array<Merchant>>;
  merchants: Array<Merchant> = [];
  filterMerchants: Array<Merchant> = [];
  categories$: Observable<Array<Category>>;
  selectedMerchant = new Set<Merchant>();
  merchantFilter: MerchantFilter;
  isMobile: Boolean = false;

  displayedColumns = ['action','title','type','city','country', "status"];
  ngxDisplayedColumns = [
    { name: 'title' },
    { name: 'type'},
    { name: 'city'},
    { name:'country' },
    { name:'status' }
  ];
  selectedStatus: any = '2';
  selectedCategory: string = '';
  merchantsDataSource!: MatTableDataSource<Merchant>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  dataTableMessage: NGXDataTableMessages;

  @ViewChild('myTable') table: any;

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

  constructor(
    public deviceService: DeviceDetectorService,
    public dealsFacade: DealsStoreFacade,
    private cd: ChangeDetectorRef,
    public settingsFacadeService: SettingsStoreFacade,
    private router: Router,
    private authStoreFacade: DealsStoreFacade,
    private uploadService : UploadService
  ) {
    this.dataTableMessage = new NGXDataTableMessages();
    this.dataTableMessage.emptyMessage = '';
    this.dataTableMessage.totalMessage = 'Merchants';
    
    this.dealsFacade.getMerchants();
    this.merchants$ = this.dealsFacade.merchants$;
    this.categories$ = this.dealsFacade.categories$
    this.isActionInProgress$ = this.dealsFacade.actionInProgress$;

  }

  ngOnInit() {
    this.merchants$.subscribe((merchants) => {
      debugger;
      this.merchants = [...merchants];
      this.filterMerchants = [...merchants.filter(d => d.country === this.selectedCountry)];
      this.merchantsDataSource = new MatTableDataSource(merchants);
      this.merchantsDataSource.paginator = this.paginator;
      this.merchantsDataSource.sort = this.sort;
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
  }

  editMerchant(merchant){
    this.edit.emit(merchant);
  }

  deleteMerchant(merchant: Merchant){
    this.dealsFacade.deleteMerchant(merchant.id);
    const key = 'merchant/' + merchant.id + '/' + merchant.imageUrl;
    this.uploadService.deleteFile(key);
  }

  expireMerchant(deal){

  }

  deActivateMerchant(deal){

  }

  inputChangeHandler($event: any){
    let textVal = $event.target.value;
    this.dealsFacade.setActionInProgress();
    this.filterMerchants = [...this.merchants.filter(d => d.title.toLowerCase().indexOf(textVal.toLowerCase()) !== -1)];
    this.merchantsDataSource = new MatTableDataSource(this.filterMerchants);
    this.merchantsDataSource.paginator = this.paginator;
    this.merchantsDataSource.sort = this.sort;
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
    debugger;
  }
  
  
  selectionChangeHandler($event){
    this.dealsFacade.setActionInProgress();
    if(+$event.value !== 2){
      this.filterMerchants = [...this.merchants.filter(d => d.country === $event.value)];
    }else{
      this.filterMerchants = [...this.merchants];
    }
    this.merchantsDataSource = new MatTableDataSource(this.filterMerchants);
    this.merchantsDataSource.paginator = this.paginator;
    this.merchantsDataSource.sort = this.sort;
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
  }
  
  selectionStatusChangeHandler($event){
    this.dealsFacade.setActionInProgress();
    if(+$event.value !== 2){
      this.filterMerchants = [...this.merchants.filter(d => d.status === $event.value)];
    }else{
      this.filterMerchants = [...this.merchants];
    }
    this.merchantsDataSource = new MatTableDataSource(this.filterMerchants);
    this.merchantsDataSource.paginator = this.paginator;
    this.merchantsDataSource.sort = this.sort;
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  selectionCityChangeHandler($event){
    this.dealsFacade.setActionInProgress();
    this.filterMerchants = [...this.merchants.filter(d => d.city === $event.value)];
    this.merchantsDataSource = new MatTableDataSource(this.filterMerchants);
    this.merchantsDataSource.paginator = this.paginator;
    this.merchantsDataSource.sort = this.sort;
    setTimeout(() => {
      this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  checkMerchant(deal: Merchant){
    // window.open(deal.dealUrl);
  }

  selectRow($event, merchant:Merchant){
    this.dealsFacade.setSelectedRowMerchant(merchant);
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

    this.merchantsDataSource.paginator = this.paginator;
    this.merchantsDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.merchantsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.merchantsDataSource.paginator) {
      this.merchantsDataSource.paginator.firstPage();
    }
  }

  // dealsSortChange(sortState: Sort) {
  //   if (sortState.direction) {
  //     if (sortState.direction === 'asc') {
  //       this.filterdeals = [
  //         ...this.deals.sort((a: Agency, b: Agency) =>
  //           a.agencyNumber.localeCompare(b.agencyNumber)
  //         )
  //       ];
  //       this.agencyDataSource = new MatTableDataSource(this.filterdeals);
  //     } else {
  //       this.filterdeals = [
  //         ...this.deals.sort((a: Agency, b: Agency) =>
  //           b.agencyNumber.localeCompare(a.agencyNumber)
  //         )
  //       ];
  //       this.agencyDataSource = new MatTableDataSource(this.filterdeals);
  //     }
  //     this.cd ? this.cd.detectChanges() : '';
  //   } else {
  //     this.filterdeals = [...this.deals];
  //     this.agencyDataSource = new MatTableDataSource(this.filterdeals);
  //   }
  // }

  // searchAgency($event: MouseEvent) {
  //   if (
  //     this.agencyFilter.name !== '' ||
  //     this.agencyFilter.number !== '' ||
  //     this.agencyFilter.state !== ''
  //   ) {
  //     this.filterdeals = [
  //       ...this.deals.filter((a) =>
  //         this.agencyFilter.name
  //           ? a.agencyName
  //               ?.toLowerCase()
  //               .includes(this.agencyFilter.name.toLowerCase().trim())
  //           : true && this.agencyFilter.number
  //           ? a.agencyNumber?.includes(this.agencyFilter.number.trim())
  //           : true && this.agencyFilter.state
  //           ? a.stateId === this.agencyFilter.state
  //           : true
  //       )
  //     ];
  //     this.agencyDataSource = new MatTableDataSource(this.filterdeals);
  //   } else {
  //     this.filterdeals = [...this.deals];
  //     this.agencyDataSource = new MatTableDataSource(this.filterdeals);
  //   }
  // }

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
    this.dealsFacade.getMerchants();
  }
}