import { CommonModule, isPlatformServer, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input, makeStateKey, OnInit, PLATFORM_ID, TransferState } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FeatureTypesComponent } from '../feature-types/feature-types.component';
import { DealType } from '@app/services/deals.model';
import { DealsService } from '@app/services/deals.service';
import { CategoryTypesComponent } from '../category-types/category-types.component';

@Component({
    selector: 'app-main-banner',
    imports: [CommonModule, NgOptimizedImage, 
        CarouselModule, FeatureTypesComponent, 
          CategoryTypesComponent],
    templateUrl: './main-banner.component.html',
    styleUrls: ['./main-banner.component.scss']
})
export class MainBannerComponent implements OnInit {
  @Input() browser: boolean = false;
  @Input() desktop: boolean = false;
  @Input() tablet: boolean = false;
  @Input() dealTypes: Array<DealType> = new Array<DealType>();

  private dealsService: DealsService= inject(DealsService);
  private transferState: TransferState = inject(TransferState);
  private platformId: object =  inject(PLATFORM_ID);

  constructor() { }

  ngOnInit(): void {
     this.dealsService.getDealTypes('usa', this.platformId).subscribe((dealTypes) => {
        this.dealTypes = [...dealTypes]
        if(dealTypes){
            this.dealTypes = [...dealTypes.filter((d: DealType) => d.status === 'active')];
        }
        if(isPlatformServer(this.platformId)){
          console.log('naari-home - fetchData dealTypes+ ' + this.platformId);
          this.transferState.set<DealType[]>(
            makeStateKey('dealTypes'), this.dealTypes
          );
        }
      });
  }

}
