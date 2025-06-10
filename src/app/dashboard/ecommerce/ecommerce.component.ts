import { Component, Inject, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { WebsiteOverviewComponent } from './website-overview/website-overview.component';
import { TopSellingProductsComponent } from './top-selling-products/top-selling-products.component';
import { RevenueOverviewComponent } from './revenue-overview/revenue-overview.component';
import { VisitsByWeekComponent } from './visits-by-week/visits-by-week.component';
import { OrderStatisticsComponent } from './order-statistics/order-statistics.component';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { SalesByLocationsComponent } from './sales-by-locations/sales-by-locations.component';
import { EarningsReportsComponent } from './earnings-reports/earnings-reports.component';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { ToggleService } from '../../common/header/toggle.service';

const DATA_KEY = makeStateKey<any>('my-ssr-data');

@Component({
    selector: 'app-ecommerce',
    imports: [WebsiteOverviewComponent, TopSellingProductsComponent, RevenueOverviewComponent, VisitsByWeekComponent, OrderStatisticsComponent, SalesOverviewComponent, RecentOrdersComponent, TransactionsHistoryComponent, SalesByLocationsComponent, EarningsReportsComponent],
    templateUrl: './ecommerce.component.html',
    styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent {

        constructor(
        public router: Router,
        public toggleService: ToggleService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private transferState: TransferState,
    ) {
      
    }

    // ngOnInit
    ngOnInit(){
        if (isPlatformServer(this.platformId)) {
            // Server: Fetch and set data
            const data = { message: 'Hello from SSR!' };
            console.log('Hydrating data at server:', data);
            this.transferState.set(DATA_KEY, data);
        } else {
            // Browser: Read and remove data
            const data = this.transferState.get(DATA_KEY, null);
            console.log('Hydrated data from server:', data);
            this.transferState.remove(DATA_KEY); // Optional cleanup
        }
    }
}