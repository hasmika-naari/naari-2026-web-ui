import { Component, OnInit } from '@angular/core'; 
import { MatDialog } from '@angular/material/dialog';
import { DealsStoreFacade } from '@app/core/store/deals/deals-store.facade';
import { DealDataItem, Merchant } from '@app/core/store/deals/deals.model';
import { AppService } from '@app/pages/app.service';
import { MerchantDialogComponent } from './merchant-dialog/merchant-dialog.component';

@Component({
  selector: 'app-manage-merchants',
  templateUrl: './manage-merchants.component.html',
  styleUrls: ['./manage-merchants.component.scss']
})
export class ManageMerchantsComponent implements OnInit { 
 
 isImageView:Boolean = false;

  constructor(
      public appService:AppService, 
      public dialog: MatDialog,
      public dealsFacade: DealsStoreFacade,) {  
  }

  ngOnInit(): void {
  }  

  editMerchantDialog(merchant: Merchant){
    debugger
    this.merchantDialog(merchant, true);
  }

  openNewMerchantDialog($event){
    let newMerchant = new Merchant();
    this.merchantDialog(newMerchant, false);
  }

  merchantDialog(merchant: Merchant, edit:boolean){
   
    const dialogRef = this.dialog.open(MerchantDialogComponent, {
      data: {
        merchant: merchant,
        categories: [],
        dealTypes: []
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });
    dialogRef.afterClosed().subscribe((res) => {
      debugger;
      if(res.merchant){
        if(res.merchant.id){    
          this.dealsFacade.updateMerchant(res.merchant, res.fileName, res.file);
        }else{
          this.dealsFacade.createMerchant(res.merchant, res.fileName, res.file);
        }
      }
    });
  }
}
