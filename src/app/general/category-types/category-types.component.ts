import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
// import { faTags, faHeart  } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Category, DealType } from '@app/services/deals.model';
import { AppConstantsService } from '@app/services/app-constants.service';
import { LocalStorageService } from '@app/services/local-storage.service';

@Component({
  selector: 'app-category-types',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './category-types.component.html',
  styleUrls: ['./category-types.component.scss']
})
export class CategoryTypesComponent implements OnInit, OnChanges {
	faTags = 'faTags';
	isMobile = false;
	isTablet = false;
	isDesktop = true;
	isBrowser!: boolean;
	hover = false;

	@Input() dealTypes: Array<DealType> = new Array<DealType>();
	filteredDealTypes: Array<DealType> = new Array<DealType>();

	categoryTypesSlideConfig: OwlOptions = {
		touchDrag: true,
		pullDrag: true,
		loop:true,
		nav:false,
		autoplay:false,
		autoplayHoverPause: true,
		autoplayTimeout : 5000,
		mouseDrag: true,
		center: false,
		margin: 7,
		dots: false,
		navText: [
			// "<i class='icofont-bubble-left'></i>",
			// "<i class='icofont-bubble-right'></i>"
		],
		responsive: {
			0: {
				items: 1.2
			},
			576: {
				items: 3.2
			},
			768: {
				items: 4.2
			},
			992: {
				items: 4.2
			},
			1024: {
				items: 5.2
			},
			2048: {
				items: 6.2
			},
			3072: {
				items: 7.2
			}
		}
    }

    constructor(
		private router: Router, 
		private constants: AppConstantsService,
		private _localStorageService: LocalStorageService,
		public deviceService: DeviceDetectorService,
		@Inject(PLATFORM_ID) private platformId: Object) {
		
	
		// this.dealsStoreFacade.getDealTypes(country?country:'', new DealType());

		this.isBrowser = isPlatformBrowser(platformId);
	 }

    ngOnInit(): void {
		if(this.isBrowser){
			let country = this._localStorageService.getItem('naariCountry');
			if(country){
			  country = country.replace(/\"/g, " ");
			  country = country.replace(/\s+/g, '');
			  country = country.replace(/\\/g, '');
			}
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
				autoplayTimeout : 5000,
				mouseDrag: true,
				center: false,
				margin: 7,
				dots: false,
				navText: [
					// "<i class='icofont-bubble-left'></i>",
					// "<i class='icofont-bubble-right'></i>"
				],
				responsive: {
					0: {
						items: 1.2
					},
					576: {
						items: 3.2
					},
					768: {
						items: 4.2
					},
					992: {
						items: 4.2
					},
					1024: {
						items: 5.2
					},
					2048: {
						items: 6.2
					},
					3072: {
						items: 7.2
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
			this.filteredDealTypes = [...this.dealTypes.filter(d => d.status === 'active' )]
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
			let cat:Category = new Category();
			cat.code = 'All'
			cat.title = 'All Deals'
			cat.id = '0';
			this.router.navigateByUrl('/deals/' + dtype.code);
			
		}else{
			// this.snackBar.openSnackBar(
			// 	'Sorry This feature still not available...', 
			// 	this.constants.snackbarType.INFO, 3000
			// );
		}
	}
}