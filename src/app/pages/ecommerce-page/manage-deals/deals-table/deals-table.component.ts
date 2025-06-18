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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DeviceDetectorService } from 'ngx-device-detector';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Category, DealDataItem } from '@app/services/deals.model';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
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

export class NGXDataTableMessages {
  emptyMessage!: string;
  totalMessage!: string;
  selectedMessage!: string;

  constructor() {
    this.emptyMessage = 'No deals Found';
    this.totalMessage = 'Total deals';
  }
}
@Component({
    selector: 'app-deals-table',
    imports: [CommonModule, MatPaginatorModule, MatTableModule, MatMenuModule, MatIconModule,
        MatProgressBarModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatSelectModule,
    ],
    templateUrl: './deals-table.component.html',
    styleUrls: ['./deals-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class DealsTableComponent implements OnInit {


  @Output() edit = new EventEmitter<DealDataItem>()
  deals$!: Observable<Array<DealDataItem>>;
  deals: Array<DealDataItem> = [];
  filterDeals: Array<DealDataItem> = [];
  categories$!: Observable<Array<Category>>;
  selectedDeal = new Set<DealDataItem>();
  dealsFilter!: DealsFilter;
  isMobile: Boolean = false;

  displayedColumns = ['action','title','startDate','endDate','currentPrice','discount','merchant','tags'];
  ngxDisplayedColumns = [
    { name: 'title' },
    { name: 'startDate'},
    { name: 'endDate' },
    { name: 'currentPrice'},
    { name: 'discount' },
    { name:'merchant' },
    {name:'category'}
  ];
  selectedStatus: string = 'approved';
  selectedCategory: string = '';
  dealsDataSource!: MatTableDataSource<DealDataItem>;

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
  isActionInProgress$!: Observable<boolean>;
  _subs: Array<Subscription> = [];
  constructor(
    public deviceService: DeviceDetectorService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.dataTableMessage = new NGXDataTableMessages();
    this.dataTableMessage.emptyMessage = '';
    this.dataTableMessage.totalMessage = 'Deals';
    
    // this._subs.push(this.dealsFacade.selectedCountry$.subscribe(c => {
    //   this.selectedCountry = c;
    //   this.dealsFacade.getAllDeals(this.selectedCountry);
    // }));
    // this.deals$ = this.dealsFacade.allDeals$;
    // this.categories$ = this.dealsFacade.categories$
    // this.isActionInProgress$ = this.dealsFacade.actionInProgress$;

    // this.deals$.pipe(first()).subscribe((Deals) => {
    //   // if (!deals.length) {
    //     this.dataTableMessage.emptyMessage = '';
    //     this.dataTableMessage.totalMessage = ' deals';
    //   // }
    // });

  }

  ngOnInit() {
    // this.dealsFacade.deals$.subscribe(e =>{
    //   debugger;
    //   console.log(e);
    //   this.deals=e;
    // })
    // this.dealsFacade.actionInProgress$.subscribe(p => {
    //   if(p){
    //     this.dataTableMessage = new NGXDataTableMessages();
    //     this.dataTableMessage.emptyMessage = 'Loading Please wait...';
    //     this.dataTableMessage.totalMessage = ' Deals';
    //   }else{
    //     if(!this.deals.length){
    //       this.dataTableMessage = new NGXDataTableMessages();
    //       this.dataTableMessage.emptyMessage = 'No deals Found...';
    //       this.dataTableMessage.totalMessage = ' deals';
    //     }
    //   }
    // })
    this.deals$.subscribe((deals) => {
      debugger;
      this.deals = [...deals];
      this.filterDeals = [...deals.filter(d => d.country === this.selectedCountry)];
      this.dealsDataSource = new MatTableDataSource(deals);
      this.dealsDataSource.paginator = this.paginator;
      this.dealsDataSource.sort = this.sort;
    });

    if (this.deviceService.isMobile()) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    // this.settingsFacadeService.setHeaderShowTime('always');
    // setTimeout(() => {
    //   this.settingsFacadeService.showHeader();
    // }, 100);
  }

  editDeal(deal: any){
    this.edit.emit(deal);
  }

  deleteDeal(deal: DealDataItem){
    // this.dealsFacade.deleteDeal(deal);
  }

  expireDeal(deal: any){

  }

  deActivateDeal(deal: any){

  }


  activateDeal(deal: any){

  }

  inputChangeHandler($event: any){
    let textVal = $event.target.value;
    // this.dealsFacade.setActionInProgress();
    this.filterDeals = [...this.deals.filter(d => d.title.toLowerCase().indexOf(textVal.toLowerCase()) !== -1)];
    this.dealsDataSource = new MatTableDataSource(this.filterDeals);
    this.dealsDataSource.paginator = this.paginator;
    this.dealsDataSource.sort = this.sort;
    setTimeout(() => {
      // this.dealsFacade.stopActionInProgress();
    }, 100);
    debugger;
  }
  
  
  selectionChangeHandler($event: any){
    // this.dealsFacade.setActionInProgress();
    this.filterDeals = [...this.deals.filter(d => d.country === $event.value)];
    this.dealsDataSource = new MatTableDataSource(this.filterDeals);
    this.dealsDataSource.paginator = this.paginator;
    this.dealsDataSource.sort = this.sort;
    this.selectedCountry = $event.value;
    setTimeout(() => {
      // this.dealsFacade.stopActionInProgress();
    }, 100);
  }
  
  selectionStatusChangeHandler($event: any){
    // this.dealsFacade.setActionInProgress();
    this.filterDeals = [...this.deals.filter(d => d.approved === $event.value)];
    this.dealsDataSource = new MatTableDataSource(this.filterDeals);
    this.dealsDataSource.paginator = this.paginator;
    this.dealsDataSource.sort = this.sort;
    setTimeout(() => {
      // this.dealsFacade.stopActionInProgress();
    }, 100);
  }

  selectionCategoryChangeHandler($event: any){
    // this.dealsFacade.setActionInProgress();
    this.filterDeals = [...this.deals.filter(d => d.category === $event.value)];
    this.dealsDataSource = new MatTableDataSource(this.filterDeals);
    this.dealsDataSource.paginator = this.paginator;
    this.dealsDataSource.sort = this.sort;
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

    this.dealsDataSource.paginator = this.paginator;
    this.dealsDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dealsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.dealsDataSource.paginator) {
      this.dealsDataSource.paginator.firstPage();
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

  refreshData($event: any){
    // this.dealsFacade.getAllDeals(this.selectedCountry);
  }
}