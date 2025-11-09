import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DealType } from '@app/services/deals.model';
import { YeaSnackBarService } from '@app/services/utilities/snackbar';
import { AppConstantsService } from '@app/services/app-constants.service';
import { LocalStorageService } from '@app/services/local-storage.service';

@Component({
    selector: 'app-category-types',
    imports: [CommonModule, CarouselModule],
    templateUrl: './category-types.component.html',
    styleUrls: ['./category-types.component.scss']
})
export class CategoryTypesComponent implements OnInit, OnChanges {
	faTags = 'faTags';
	hover = false;
	@Input() dealTypes: Array<DealType> = new Array<DealType>();
	filteredDealTypes: Array<DealType> = new Array<DealType>();
	isMobile = false;
	isTablet = false;
	isDesktop = true;
	isBrowser!: boolean;
	categoryTypesSlideConfig: OwlOptions = {
		touchDrag: true,
		pullDrag: true,
		loop:true,
		nav:false,
		autoplay:false,
		autoplayHoverPause: true,
		autoplayTimeout : 500000,
		mouseDrag: true,
		center: false,
		margin: 7,
		dots: true,
		navText: [
			"<i class='icofont-bubble-left'></i>",
			"<i class='icofont-bubble-right'></i>"
		],
		responsive: {
			0: {
				items: 1.2
			},
			576: {
				items: 3.2
			},
			768: {
				items: 4.5
			},
			992: {
				items: 5.5
			},
			1024: {
				items: 5.5
			},
			2048: {
				items: 6.5
			},
			3072: {
				items: 7.5
			}
		}
    }

    constructor(
		private snackBar: YeaSnackBarService,
		private router: Router, 
		private constants: AppConstantsService,
		private _localStorageService: LocalStorageService,
		public deviceService: DeviceDetectorService,
		@Inject(PLATFORM_ID) private platformId: Object) {

		this.isBrowser = isPlatformBrowser(platformId);
	 }

    ngOnInit(): void {
		if(this.isBrowser){
		if(this.deviceService.isDesktop()){
			this.isDesktop = true;
			this.isMobile = false;
			this.isTablet = false;
		  }else if(this.deviceService.isMobile()){
			this.isMobile = true;
			this.isDesktop = false;
			this.isTablet = false;
			this.categoryTypesSlideConfig = {
				touchDrag: true,
				pullDrag: true,
				loop:true,
				nav:false,
				autoplay:false,
				autoplayHoverPause: true,
				autoplayTimeout : 500000,
				mouseDrag: true,
				center: false,
				margin: 7,
				dots: true,
				navText: [
					"<i class='icofont-bubble-left'></i>",
					"<i class='icofont-bubble-right'></i>"
				],
				responsive: {
					0: {
						items: 1.2
					},
					576: {
						items: 3.2
					},
					768: {
						items: 4.5
					},
					992: {
						items: 5.5
					},
					1024: {
						items: 6.5
					},
					2048: {
						items: 7.5
					},
					3072: {
						items: 7.5
					}
				}
			}
		
		  }else if(this.deviceService.isTablet()){
			this.isTablet = true;
			this.isMobile = false;
			this.isDesktop = false;
		  }
		}

	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['dealTypes']){
			// Sort dealTypes by seqOrder field if it exists
			this.dealTypes.sort((a: any, b: any) => {
				const orderA = a.seqOrder !== undefined ? +a.seqOrder : 999;
				const orderB = b.seqOrder !== undefined ? +b.seqOrder : 999;
				return orderA - orderB;
			});
			// this.filteredDealTypes = [...this.dealTypes.filter(d => d.status === 'active' )]
		}
	}

	getdelay(i: any){
		let delayText = 'ms';
		if(i > 0){
			delayText = (+i*200).toString() + 'ms';
		}
		return delayText;
	}
   
	gotoDeals($event: any, dtype: DealType){
		if(dtype.status === 'active'){
			// Check if it's Black Friday deal type and route to special landing page
			if(dtype.code === 'BLACK-FRIDAY' || dtype.code === 'BLACKFRIDAY' || 
			   dtype.title?.toLowerCase().includes('black friday')) {
				this.router.navigateByUrl('/black-friday');
			} else {
				this.router.navigateByUrl('/deals?type=' + dtype.code + '&category=' + 'All');
			}
		}else{
			this.snackBar.openSnackBar(
				'Sorry This feature still not available...', 
				this.constants.snackbarType.INFO, 3000
			);
		}
	}
}