import { Component, inject, effect, signal, Signal, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DealDialogComponent } from './deal-dialog/deal-dialog.component';
import { AmazonDealDialogComponent } from './amazon-deal-dialog/amazon-deal-dialog.component';
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
import { Category, DealDataItem } from '@app/services/deals.model';

@Component({
  selector: 'app-manage-deals',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterModule,
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
export class ManageDealsComponent {

  isImageView: string = 'image';
  isActionInProgress = signal(false);
  allDeals: Array<DealDataItem> = [];
  filteredDeals: Array<DealDataItem> = [];
  selectedIds: Array<string> = [];
  selectedCountry = 'usa';

  private dealsStoreService: DealsStoreService = inject(DealsStoreService);
  private dealsService: DealsService = inject(DealsService);
  private envInjector = inject(EnvironmentInjector);
  public dialog: MatDialog = inject(MatDialog);

  categories: Signal<Category[]> = this.dealsStoreService.getCategories();
  deals: Signal<DealDataItem[]> = this.dealsStoreService.getFilteredAllDeals();

  constructor() {
    this.loadDeals();

    runInInjectionContext(this.envInjector, () => {
      effect(() => {
        const deals = this.deals();
        const cats = this.categories();
        if (deals.length || cats.length) {
          this.allDeals = deals;
          this.filteredDeals = [...deals];
        }
      });
    });
  }

  loadDeals() {
    this.isActionInProgress.set(true);
    this.dealsService.getDealsByCountry(this.selectedCountry, '').subscribe({
      next: (deals: DealDataItem[]) => {
        this.dealsStoreService.updateAllDeals(deals, -1, 'All', '');
        this.isActionInProgress.set(false);
      },
      error: () => {
        this.isActionInProgress.set(false);
      }
    });
  }

  editDealDialog(deal: DealDataItem) {
    this.dealDialog(deal, false);
  }

  openNewDealDialog($event: any) {
    let newDeal = new DealDataItem();
    this.dealDialog(newDeal, false);
  }

  dealDialog(deal: DealDataItem, edit: boolean) {
    const dialogRef = this.dialog.open(DealDialogComponent, {
      data: {
        deal: deal,
        categories: this.categories(),
        dealTypes: this.dealsStoreService.getDealTypes()()
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr'
    });

    dialogRef.afterClosed().subscribe((deal: DealDataItem) => {
      if (deal) {
        this.isActionInProgress.set(true);
        const action$ = deal.id
          ? this.dealsService.updateDeal(deal)
          : this.dealsService.postDeal(deal);

        action$.subscribe({
          next: () => this.loadDeals(),
          error: () => this.isActionInProgress.set(false),
          complete: () => this.isActionInProgress.set(false)
        });
      }
    });
  }

  loadAmazonDeals($event: any) {
    const dialogRef = this.dialog.open(AmazonDealDialogComponent, {
      maxWidth: '60vw',
      maxHeight: '60vh',
      data: {},
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr'
    });

    dialogRef.afterClosed().subscribe((amazonDealsRequest) => {
      if (amazonDealsRequest) {
        // Hook to call service to load amazon deals
      }
    });
  }

  deleteAllExpiredDeals(event: any, country: string) {
    // Hook to delete expired deals
  }

  setSelectedIds(selectedIds: Array<string>) {
    this.selectedIds = [...selectedIds];
  }

  deleteSelectedDeals($event: any) {
    if (this.selectedIds.length) {
      // Hook to delete selected deals
    }
  }
}
