import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Signal, TransferState, effect, inject, makeStateKey } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { HeaderStyleComponent } from '../naari-home/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Category, CategoryListItem, DealDataItem, PCategory } from '@app/services/deals.model';
import { DealsService } from '@app/services/deals.service';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Meta, Title } from '@angular/platform-browser';
import { AppUtilService } from '@app/services/app.util.service';
import { DealsBlogComponent } from '@app/general/deals-blog/deals-blog.component';
import { FooterComponent } from '@app/common/footer/footer.component';
import { LanguageSubscribeComponent } from '@app/general/language-subscribe/language-subscribe.component';
import { SeoService } from '@app/services/seo/seo.service';
import { AuthService } from '@app/services/auth.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { FooterWorkifenceComponent } from '@app/pages/landing/footer-wifence/footer-wifence.component';
import { filter } from 'rxjs';

@Component({
    selector: 'app-deal-details-page',
    imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
        NgOptimizedImage, HeaderStyleComponent, DealsBlogComponent, FooterComponent,
        CarouselModule, MatButtonModule, MatChipsModule, MatIconModule,FooterWorkifenceComponent,
        MatMenuModule, LanguageSubscribeComponent, MatCardModule, MatProgressBarModule],
    templateUrl: './deal-details-page.component.html',
    styleUrls: ['./deal-details-page.component.scss']
})
export class DealDetailsPageComponent implements OnInit {

    isToggled = false;

    private seoService:SeoService = inject(SeoService);
    private appService: AppUtilService =  inject(AppUtilService);
    private dealsService: DealsService= inject(DealsService);
    private authService: AuthService= inject(AuthService);
    private _localStorageService: LocalStorageService= inject(LocalStorageService);
    private router: Router= inject(Router);
    private transferState: TransferState = inject(TransferState);
    private platformId: object =  inject(PLATFORM_ID);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private dealsStoreService: DealsStoreService = inject(DealsStoreService);
    private route: ActivatedRoute =  inject(ActivatedRoute);
    private meta:Meta = inject(Meta);
    private title:Title = inject(Title);

    pCategories: Signal< Array<PCategory>> = this.dealsStoreService.getPcCategories();
    categories: Signal< Array<Category>> = this.dealsStoreService.getCategories();
    selectedDeal: Signal<DealDataItem> = this.dealsStoreService.getSelectedDeal();
    localSelectedDeal: DealDataItem = new DealDataItem();
    relatedDeals:  Signal<Array<DealDataItem>> =this.dealsStoreService.getRelatedDeals();
    localRelatedDeals: Array<DealDataItem> = new Array<DealDataItem>();
    selectedDealId = '';
    
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;
    headerColor = true;

    updateLocalDealEffect = effect(() => {
      const deal = this.selectedDeal();
      if (deal) {
        this.localSelectedDeal = { ...deal };
      }
      const deals = this.relatedDeals();
      if(deals){
        this.localRelatedDeals = [...deals];
      }
    });

    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });

        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
          this.selectedDealId = this.route.snapshot.params['id'];
          this.fetchData(this.selectedDealId);
        });
     
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
        this.selectedDealId = this.route.snapshot.params['id'];
       
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
          debugger;
           //consolie.log(' deal details page - ngOnInit + isPlatformBrowser Reading Hydrated data:');
          this.loadFetcheddata();
        }else{
          //consolie.log('deal details page - ngOnInit + isPlatformServer ' + this.platformId);
          this.fetchData(this.selectedDealId);
        }
    }

    // for tab click event
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    coursesSlides: OwlOptions = {
      loop: false,
      nav: true,
      dots: true,
      autoplayHoverPause: true,
      autoplay: true,
      margin: 30,
      navText: [
        "<i class='bx bx-left-arrow-alt'></i>",
        "<i class='bx bx-right-arrow-alt'></i>"
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        1200: {
          items: 3,
        }
      }
      }

    detailsImageSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
        items: 1,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		]
    }


    fetchData(dealId: string): void{
      debugger;
      this.dealsService.getDealDetailsById(dealId).subscribe((deal) => {
          this.localSelectedDeal = _.cloneDeep(deal[0]);
          //consolie.log('deal Details - fetchData selectedDeal+ ' + deal[0].title);

          this.updateMetaTags();

          if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem>(
              makeStateKey('selectedDeal'), this.localSelectedDeal
            );
          }else{
              this.dealsStoreService.updateSelectedDeal(this.localSelectedDeal);
          }

        this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
          // this.dealsService.getDealsByCountryAndCategory(this.localSelectedDeal.country, this.localSelectedDeal.category, this.platformId).subscribe((deals) => {
          //  this.relatedDeals = [...deals.filter((rd: DealDataItem) => +rd.id !== +this.selectedDeal.id)];
           // this.relatedDeals = [...this.relatedDeals.splice(deals.length < 10?deals.length:10)];
          //consolie.log('deal Details - fetchData delas  by country+ ' + deals);
            
            if(isPlatformServer(this.platformId)){
              this.transferState.set<DealDataItem[]>(
                makeStateKey('relatedDeals'),  [...deals],  //[...deals.splice(deals.length < 10?deals.length:10)]
              );
            }else{
            this.dealsStoreService.updateRelatedDeals(deals);
            }
          })

      });
      this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
          if(isPlatformServer(this.platformId)){
          //consolie.log('naari-home - fetchData pCategories+ ' + this.platformId);
          this.transferState.set<CategoryListItem[]>(
            makeStateKey('categoriesTable'), categories
          );
        }else{
           this.dealsStoreService.updateCategories(categories);
        }
      });
    }

    loadFetcheddata(){
      //consolie.log('This is isPlatformBrowser...');
    
      if(this.transferState.hasKey(makeStateKey('relatedDeals'))){
        let rdeals: Array<DealDataItem> = this.transferState.get(makeStateKey('relatedDeals'), new Array<DealDataItem>());
        this.dealsStoreService.updateRelatedDeals(rdeals);
      }else{
        this.fetchData(this.selectedDealId);
      }

      if(this.transferState.hasKey(makeStateKey('selectedDeal'))){
        let dealSeleced: DealDataItem = this.transferState.get(makeStateKey('selectedDeal'), new DealDataItem());
        this.dealsStoreService.updateSelectedDeal(dealSeleced);
      }else{
        this.fetchData(this.selectedDealId);
      }
     
      if(this.transferState.hasKey(makeStateKey('categoriesTable'))){
        let categories: Array<Category> = this.transferState.get(makeStateKey('categoriesTable'), new Array<Category>());
        this.dealsStoreService.updateCategories(categories);
      }else{
        this.fetchData(this.selectedDealId);
      }

    }


    updateMetaTags(){
          //consolie.log('updateMetaTags+ ' + this.localSelectedDeal.title);
      this.title.setTitle(this.localSelectedDeal.title);
      this.localSelectedDeal.description?this.meta.updateTag({property:"description",content:this.localSelectedDeal.description}):'';
      //  let cSymbol = this.dealService.country === 'us'?'$':'₹';
        let amount:any = '';
        // NOTE - Patch - need to change in future.
        if(this.localSelectedDeal.country == null || this.localSelectedDeal.country == ''){
          this.localSelectedDeal.country = this.localSelectedDeal.city;
        }
        
      if(this.localSelectedDeal.country && this.localSelectedDeal.country.toLocaleLowerCase() === 'usa'){

        amount =  new Intl.NumberFormat('en-US',
                { style: 'currency', currency: 'USD' }
              ).format(+this.localSelectedDeal.currentPrice); // '$100.00'
      }else{
        amount =  new Intl.NumberFormat('en-IN',
                      { style: 'currency', currency: 'INR' }
                    ).format(+this.localSelectedDeal.currentPrice); // '$100.00';
      }
      
      let discountText = this.localSelectedDeal.discountType === '%'?this.localSelectedDeal.discount + '%off': 
        this.localSelectedDeal.discountType + this.localSelectedDeal.discount + 'off';
      let selectedDealTitle =  ' 🔥 Naari Deals - Now: ' + amount.toString() + ' (' + discountText +  ') ' + " " + this.localSelectedDeal.title; 
      // //consolie.log('SERVER: ' + selectedDealTitle);
      this.localSelectedDeal.title?this.meta.updateTag({property:"og:title",content:selectedDealTitle}):'';
      this.localSelectedDeal.description?this.meta.updateTag({property:"og:description",content:this.localSelectedDeal.description}):'';
     
      let baseUrl: string = '';

      if(this.localSelectedDeal.merchant === 'Amazon' && !this.localSelectedDeal.imageUrl?.includes('https')){
        baseUrl = 'https:';
      }
     
      this.localSelectedDeal.imageUrl?this.meta.updateTag({property:"og:image",content: baseUrl + this.localSelectedDeal.imageUrl}):'';
     
      this.localSelectedDeal.id?this.meta.updateTag({property:"og:url",content: "https://naarideals.com/deals/deal/" + this.localSelectedDeal.id}):'';
  
      this.localSelectedDeal.title?this.meta.updateTag({name:"twitter:title",content:selectedDealTitle}):'';
      this.localSelectedDeal.description?this.meta.updateTag({name:"twitter:description",content:this.localSelectedDeal.description}):'';
      this.localSelectedDeal.imageUrl?this.meta.updateTag({name:"twitter:image",content: baseUrl + this.localSelectedDeal.imageUrl}):'';
      this.localSelectedDeal.id?this.meta.updateTag({name:"twitter:url",content: "https://naarideals.com/deals/deal/" + this.localSelectedDeal.id}):'';
    }
    
    gotoHome($event: any){
      this.router.navigateByUrl('/home')
    }
    
  gotToShop(dealUrl: any){
    window.open(dealUrl);
  }

  shareOnWhatsApp($event:any, selectedDeal: DealDataItem){
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedDeal);
  }

}
