import { Component, inject, OnInit } from '@angular/core'; 
import { MatDialog } from '@angular/material/dialog';
import { DealDialogComponent } from './deal-dialog/deal-dialog.component';
import { Observable, Subscription } from 'rxjs';
import { AmazonDealDialogComponent } from './amazon-deal-dialog/amazon-deal-dialog.component';
import * as _ from 'lodash';
import { AmazonDealDataRequestItem, DealDataItem } from '@app/services/deals.model';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { DealsTableComponent } from './deals-table/deals-table.component';
import { DealDetailsComponent } from './deal-details/deal-details.component';
import { DealsImageViewComponent } from './deals-image-view/deals-image-view.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { DealsService } from '@app/services/deals.service';

@Component({
    selector: 'app-manage-deals',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule,
        NgOptimizedImage,
        DealsTableComponent,
        DealDialogComponent,
        DealDetailsComponent,
        DealsImageViewComponent,
        AmazonDealDialogComponent,
        MatCardModule,
        MatDividerModule,
        MatMenuModule,
        MatIconModule,
        MatRadioModule,
        FormsModule,
        MatButtonModule
    ],
    templateUrl: './manage-deals.component.html',
    styleUrls: ['./manage-deals.component.scss']
})
export class ManageDealsComponent implements OnInit { 
 
  isImageView:string = 'image';
  isActionInProgress: boolean = false;
  allDeals: Array<DealDataItem> = [];
  filteredDeals: Array<DealDataItem> = [];
  _subs: Array<Subscription> = [];
  selectedIds: Array<string> = [];
  selectedCountry = 'usa';
  private dealsStoreService: DealsStoreService = inject(DealsStoreService);
  private dealsService:DealsService =  inject(DealsService);

  constructor(
      public dialog: MatDialog) {  

        // this._subs.push(this.dealsFacade.selectedCountry$.subscribe(c => {
        //   this.selectedCountry = c;
          // this.dealsService.getDealsByCountry(this.selectedCountry, '').subscribe((deals: any) => {
          //   this.dealsStoreService.updateAllDeals(deals);
          // });
          //   this.allDeals = this.dealsStoreService.getAllDailyDeals()();
        // }));

        // this._subs.push(this.dealsFacade.allDeals$.subscribe((deals) => {
        //   this.deals = [..._.cloneDeep(deals)];
        // }))
        // this._subs.push(this.dealsFacade.actionInProgress$.subscribe((isActionInProgress) => {
        //   this.isActionInProgress = isActionInProgress;
        // }))

    console.log('ManageDealsComponent: constructor');

  }

  ngOnInit(): void {
    console.log('ManageDealsComponent: ngOnInit');
  }  

  editDealDialog(deal: DealDataItem){
    this.dealDialog(deal, false);
  }

  openNewDealDialog($event: any){
    let newDeal = new DealDataItem();
    this.dealDialog(newDeal, false);
  }

  dealDialog(deal: DealDataItem, edit:boolean){
   
    const dialogRef = this.dialog.open(DealDialogComponent, {
      data: {
        deal: deal,
        categories: [],
        dealTypes: []
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });
    dialogRef.afterClosed().subscribe((deal: DealDataItem) => {
      debugger;
      if(deal){
        if(deal.id){    
          // this.dealsFacade.updateDeal(deal);
          this.dealsService.updateDeal(deal);
        }else{
          // this.dealsService.postDeal(deal);
           this.dealsService.postDeal(deal).subscribe((result: any) => {
            debugger;
          });
          // this.dealsFacade.postDeal(deal);
        }
      }
    });
  }

  loadAmazonDeals($event: any){
   
    const dialogRef = this.dialog.open(AmazonDealDialogComponent, {
      maxWidth: '60vw',
      maxHeight: '60vh',
      data: { },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });
    dialogRef.afterClosed().subscribe((amazonDealsRequest: AmazonDealDataRequestItem) => {
      debugger;
      if(amazonDealsRequest){
          // this.dealsFacade.loadAmazonDeals(amazonDealsRequest);
      }
    });
  }

  deleteAllExpiredDeals(event: any, country: string){
    // this.dealsFacade.deleteAllExpiredDeals(country);
  }

  setSelectedIds(selectedIds: Array<string>){
    this.selectedIds = [...selectedIds];
  }

  deleteSelectedDeals($event: any){
    if(this.selectedIds.length){
      // this.dealsFacade.deleteSelectedDeals(this.selectedIds, this.selectedCountry);
    }
  }
}
