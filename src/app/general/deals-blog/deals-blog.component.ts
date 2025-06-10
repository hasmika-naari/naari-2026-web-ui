import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { AppUtilService } from '@app/services/app.util.service';
import { DealDataItem } from '@app/services/deals.model';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-deals-blog',
    imports: [CommonModule, NgOptimizedImage, RouterModule, MatCardModule,
        FlexLayoutModule, CarouselModule, MatButtonModule, MatChipsModule],
    templateUrl: './deals-blog.component.html',
    styleUrls: ['./deals-blog.component.scss']
})
export class DealsBlogComponent implements OnInit {

    isToggled = false;
	@Input() deals: Array<DealDataItem> = new Array<DealDataItem>();
	country = 'usa';
	viewCol = 12.5;
    private platformId: object =  inject(PLATFORM_ID);
	blogSlides: OwlOptions = {
		touchDrag: true,
		pullDrag: true,
		loop:true,
		nav:true,
		autoplay:false,
		autoplayHoverPause: true,
		autoplayTimeout : 500000,
		mouseDrag: true,
		center: false,
		margin: 7,
		dots: false,
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
	};
	browser = false;

    private appService: AppUtilService =  inject(AppUtilService);

    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });

		if(isPlatformBrowser(this.platformId)){
            console.log('isPlatformBrowser');
			this.browser = true;
          }

		  afterNextRender(() => {
			this.blogSlides = {
				touchDrag: true,
				pullDrag: true,
				loop:true,
				nav:true,
				autoplay:false,
				autoplayHoverPause: true,
				autoplayTimeout : 500000,
				mouseDrag: true,
				center: false,
				margin: 7,
				dots: false,
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
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {}

  

	
	showStartDate(startDate: any){
		let dDate: Date = new Date(startDate);
		let today: Date = new Date();
		return (dDate >= today);
	  }

	  shareOnWhatsApp($event:any, selectedDeal: DealDataItem){
		$event.stopPropagation();
		this.appService.shareOnWhatsApp(selectedDeal);
	  }

}