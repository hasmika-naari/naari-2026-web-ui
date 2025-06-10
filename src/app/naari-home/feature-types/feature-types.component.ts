import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { YeaSnackBarService } from '@app/services/utilities/snackbar';
import { AppConstantsService } from '@app/services/app-constants.service';
import { LocalStorageService } from '@app/services/local-storage.service';

@Component({
    selector: 'app-feature-types',
	standalone:true,
    imports: [CommonModule, CarouselModule, MatProgressBarModule, NgOptimizedImage],
    templateUrl: './feature-types.component.html',
    styleUrls: ['./feature-types.component.scss']
})
export class FeatureTypesComponent implements OnInit {
	// faTags = 'faTags';
	hover = false;
	public dealTypes = [
		{
			title: 'Boutique',
			subTitle: 'love in fashion',
			bgColor: '',
			bgImageUrl: '/assets/images/lovein/boutique.jpg',
			route: '/boutiques',
			status: 'active'
		},
		{
			title: 'Beauty Parlour',
			subTitle: 'love in care',
			bgColor: '',
			bgImageUrl: '/assets/images/lovein/beauty.jpg',
			route: '/boutiques',
			status: 'in-active'
		},
		{
			title: 'Wedding Makeup',
			subTitle: 'love in makeup',
			bgColor: '',
			bgImageUrl: '/assets/images/lovein/makeup.jpg',
			route: '/boutiques',
			status: 'in-active'
		},
		{
			title: 'Jewellery',
			subTitle: 'show tradition',
			bgColor: '',
			bgImageUrl: '/assets/images/lovein/jewellery.jpg',
			route: '/boutiques',
			status: 'in-active'
		},
		{
			title: 'Boutique',
			subTitle: 'love in fashion',
			bgColor: '',
			bgImageUrl: '/assets/images/lovein/boutique.jpg',
			route: '/boutiques',
			status: 'active'
		},
		{
			title: 'Beauty Parlour',
			subTitle: 'love in care',
			bgColor: '',
			bgImageUrl: '/assets/images/lovein/beauty.jpg',
			route: '/boutiques',
			status: 'in-active'
		},
		{
			title: 'Wedding Makeup',
			subTitle: 'love in makeup',
			bgColor: '',
			bgImageUrl: '/assets/images/lovein/makeup.jpg',
			route: '/boutiques',
			status: 'in-active'
		},
		
	];
	categoryTypesSlideConfig: OwlOptions = {
		touchDrag: true,
		pullDrag: true,
		loop:true,
		nav:true,
		autoplay:false,
		autoplayHoverPause: true,
		autoplayTimeout : 5000,
		mouseDrag: true,
		center: false,
		margin: 7,
		dots: false,
		navText: [
			"<i class='icofont-bubble-left'></i>",
			"<i class='icofont-bubble-right ' ></i>"
		],
		responsive: {
			0: {
				items: 1.4
			},
			576: {
				items: 3.4
			},
			768: {
				items: 4.4
			},
			992: {
				items: 4.4
			},
			1024: {
				items: 4.4
			},
			2048: {
				items: 5.4
			},
			3072: {
				items: 5.4
			}
		}
    }
	isMobile = false;
    isTablet = false;
    isDesktop = true;
	isBrowser!: boolean;
    constructor(
		private snackBar: YeaSnackBarService,
		private router: Router, 
		@Inject(PLATFORM_ID) private platformId: Object,
		public deviceService: DeviceDetectorService,
		private constants: AppConstantsService,
		private _localStorageService: LocalStorageService) {
		// let country = this._localStorageService.getItem('naariCountry');
		// if(country){
		//   country = country.replace(/\"/g, " ");
		//   country = country.replace(/\s+/g, '');
		//   country = country.replace(/\\/g, '');
		// }
		// // this.dealsStoreFacade.getDealTypes(country?country:'', new DealType());
		this.isBrowser = isPlatformBrowser(platformId);
	 }

    ngOnInit(): void {
		if(this.isBrowser){
			this.categoryTypesSlideConfig  = {
				touchDrag: true,
				pullDrag: true,
				loop:true,
				nav:true,
				autoplay:false,
				autoplayHoverPause: true,
				autoplayTimeout : 5000,
				mouseDrag: true,
				center: false,
				margin: 7,
				dots: false,
				navText: [
					"<i class='icofont-bubble-left'></i>",
					"<i class='icofont-bubble-right ' ></i>"
				],
				responsive: {
					0: {
						items: 1.4
					},
					576: {
						items: 3.4
					},
					768: {
						items: 4.4
					},
					992: {
						items: 4.4
					},
					1024: {
						items: 4.4
					},
					2048: {
						items: 5.4
					},
					3072: {
						items: 5.4
					}
				}
			};
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
					"<i class='icofont-bubble-left'></i>",
					"<i class='icofont-bubble-right ' ></i>"
				],
				responsive: {
					0: {
						items: 1.4
					},
					576: {
						items: 3.4
					},
					768: {
						items: 4.4
					},
					992: {
						items: 4.4
					},
					1024: {
						items: 4.4
					},
					2048: {
						items: 5.4
					},
					3072: {
						items: 5.4
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
   
	gotoLovin($event: any, dtype: any){
		if(dtype.status === 'active'){
			this.router.navigateByUrl(dtype.route);
		}else{
			this.snackBar.openSnackBar(
				'Sorry This feature still not available...', 
				this.constants.snackbarType.INFO, 3000
			);
		}
	}

	public getBgImage(index: any){
		let bgImage = {
		  'background-image': index != null && this.dealTypes[index] ? "url(" + this.dealTypes[index].bgImageUrl + ")" : "url(https://via.placeholder.com/600x400/ff0000/fff/)"
		};
		return bgImage;
	  } 

	  getdelay(i: any){
		let delayText = '0ms';
		if(i > 0){
			delayText = (+i*200).toString() + 'ms';
		}
		return delayText;
	}
}