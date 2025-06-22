import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { HeaderStyleComponent } from '../naari-home/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Category, DealDataItem, DealSorting, DealType, Merchant, PCategory } from '@app/services/deals.model';
import { DealsService } from '@app/services/deals.service';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPaginationModule } from 'ngx-pagination';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AppUtilService } from '@app/services/app.util.service';
import { DealsBlogComponent } from '@app/general/deals-blog/deals-blog.component';
import { FooterComponent } from '@app/common/footer/footer.component';
import { LanguageSubscribeComponent } from '@app/general/language-subscribe/language-subscribe.component';

@Component({
    selector: 'app-boutique-page',
    imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, NgxPaginationModule,
        NgOptimizedImage, HeaderStyleComponent, DealsBlogComponent, FooterComponent,
        CarouselModule, MatButtonModule, MatChipsModule, MatIconModule,
        MatMenuModule, LanguageSubscribeComponent, MatCardModule, MatProgressBarModule],
    templateUrl: './boutique-page.component.html',
    styleUrls: ['./boutique-page.component.scss']
})
export class BoutiquePageComponent implements OnInit, OnDestroy {

  public page:any = 0;
  public counts = [50, 100, 200];
  public count:any = 50;
  public viewCol: number = 25;
  maxSize = 5;
  autoHide= false;
  country: any = 'usa';
  selectedSorting: DealSorting = {title: 'All Botiques', isSelected: true};
  public sortings = [
    {title: 'All Botiques', isSelected: true},
    {title: 'By City', isSelected: false},
    {title: 'By Zipcode', isSelected: false}
    ];


    isToggled = false;
    categories: Array<Category> = new Array<Category>();
    pCategories: Array<PCategory> = new Array<PCategory>();
    deals: Array<DealDataItem> = new Array<DealDataItem>();
    boutiques:Array<Merchant> = new Array<Merchant>();
    displayBoutiques:Array<Merchant> = new Array<Merchant>();

    private appService: AppUtilService =  inject(AppUtilService);

    private dealsService: DealsService= inject(DealsService);
    private platformId: object =  inject(PLATFORM_ID);
    private route: ActivatedRoute =  inject(ActivatedRoute);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private meta:Meta = inject(Meta);
    private title:Title = inject(Title);
    
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;
    currentUrl = '';
    subs:Array<Subscription> = new Array<Subscription>();


    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });

    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnDestroy(): void {
        
    }

    ngOnInit(): void {
        if(!this.boutiques.length){
          this.fetchData();
        }
        if(isPlatformBrowser(this.platformId)){
          this.browser = true;
        if(this.deviceService.isDesktop()){
          this.isDesktop = true;
          this.isMobile = false;
          this.isTablet = false;
        }else if(this.deviceService.isMobile()){
          this.isMobile = true;
          this.isDesktop = false;
          this.isTablet = false;
        }else if(this.deviceService.isTablet()){
          this.isTablet = true;
          this.isMobile = false;
          this.isDesktop = false;
        }
      }
    }

    // for tab click event
    // currentTab = 'tab1';
    // switchTab(event: MouseEvent, tab: string) {
    //     event.preventDefault();
    //     this.currentTab = tab;
    // }

    // coursesSlides: OwlOptions = {
    //   loop: false,
    //   nav: true,
    //   dots: true,
    //   autoplayHoverPause: true,
    //   autoplay: true,
    //   margin: 30,
    //   navText: [
    //     "<i class='bx bx-left-arrow-alt'></i>",
    //     "<i class='bx bx-right-arrow-alt'></i>"
    //   ],
    //   responsive: {
    //     0: {
    //       items: 1,
    //     },
    //     768: {
    //       items: 2,
    //     },
    //     1200: {
    //       items: 3,
    //     }
    //   }
    //   }

    // detailsImageSlides: OwlOptions = {
		// loop: true,
		// nav: false,
		// dots: false,
		// autoplayHoverPause: true,
		// autoplay: true,
		// margin: 30,
    //     items: 1,
		// navText: [
		// 	"<i class='bx bx-left-arrow-alt'></i>",
		// 	"<i class='bx bx-right-arrow-alt'></i>"
		// ]
    // }


    fetchData(): void{

        this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
          this.deals = _.cloneDeep(deals);
        });
        // if(isPlatformBrowser(this.platformId)){
          this.dealsService.getMerchantsByCountryAndType('usa', 'BOUTIQUE', this.platformId).subscribe((boutiques) => {
            this.boutiques = _.cloneDeep(boutiques);
            this.displayBoutiques =  [...boutiques];
            // ////consolie.log('Boti --- ' + this.displayBoutiques);
          });
        // }
        ////consolie.log('Botique Component: Fetch Data');
        this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
          this.categories = [...categories];

          this.pCategories = [..._.map(
              _.groupBy(categories, 'parent'),
              (categories, parent) => ({ parent, categories }))];
        });

       
     
    }

  public onPageChanged(event: any){
    this.page = event;
      ////consolie.log('Screen Height: ' + document.documentElement.clientHeight);
      if(this.isMobile){
        window.scrollTo(0, 275);
      }else{
        window.scrollTo(0, 375);
      }
  }

  shareOnWhatsApp($event:any, selectedDeal: Merchant){
    $event.stopPropagation();
    // this.appService.shareOnWhatsApp(selectedDeal);
  }

  getLocation(location: string){
    let locationName = ''
    if(location && location === 'IN_STORE'){
      locationName = 'In Store';
    }else if(location && location === 'ONLINE'){
      locationName = 'On Line';
    }else if(location && location === 'ONLINE_STORE'){
      locationName = 'In Store & On Line';
    }
    
    return locationName;
  }

  public changeSorting(sort: any){

    this.selectedSorting = sort;
    if(this.selectedSorting && this.selectedSorting.title === 'By City'){
      ;
      this.displayBoutiques = [..._.orderBy(this.boutiques, d => +d.city, ['asc'])];
    }else if(this.selectedSorting && this.selectedSorting.title === 'By Zipcode'){
      ;
      this.displayBoutiques = [..._.orderBy(this.boutiques, d => +d.city,  ['asc'])];
    }else{
      ;
      this.displayBoutiques = [...this.boutiques];
    }
    ;
    if(this.isMobile){
      window.scrollTo(0, 275);
    }else{
      window.scrollTo(0, 375);
    }
  }
}
