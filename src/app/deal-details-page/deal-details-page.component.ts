import { CommonModule, Location, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, Signal, TransferState, effect, inject, makeStateKey } from '@angular/core';
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
export class DealDetailsPageComponent implements OnInit, OnDestroy {

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
    private location: Location = inject(Location);
    private readonly siteBaseUrl = 'https://naarideals.com';
    private readonly defaultShareImage = `${this.siteBaseUrl}/assets/img/og/naarideals-share.png`;
    private readonly twitterHandle = '@NaariDeals';
    private readonly siteName = 'Naari Deals';

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
      if (deal && deal.id) {
        this.localSelectedDeal = { ...deal };
        this.updateMetaTags(this.localSelectedDeal);
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
      this.dealsService.getDealDetailsById(dealId).subscribe((deal) => {
          this.localSelectedDeal = _.cloneDeep(deal[0]);
          //consolie.log('deal Details - fetchData selectedDeal+ ' + deal[0].title);

      this.updateMetaTags(this.localSelectedDeal);

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

    ngOnDestroy(): void {
      this.meta.removeTag("property='og:updated_time'");
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


    updateMetaTags(deal: DealDataItem | null = this.localSelectedDeal){
      if(!deal || !deal.id){
        return;
      }

      const country = this.resolveCountry(deal);
      this.localSelectedDeal.country = country;

      const formattedPrice = this.formatPrice(deal, country);
      const discountText = this.buildDiscountText(deal);
      const shareTitle = this.buildShareTitle(deal.title, formattedPrice, discountText);
      const shareDescription = this.buildShareDescription(deal.description, discountText);
      const canonicalUrl = `${this.siteBaseUrl}/deal/${deal.id}`;
      const imageUrl = this.buildImageUrl(deal.imageUrl, deal.merchant);
      const locale = this.resolveLocale(country);
      const updatedTime = new Date().toISOString();

      const pageTitle = deal.title ? `${deal.title} | ${this.siteName}` : this.siteName;
      this.title.setTitle(pageTitle);
      this.meta.updateTag({name:'description', content: shareDescription});

      const openGraphTags = [
        { property: 'og:title', content: shareTitle },
        { property: 'og:description', content: shareDescription },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: 'product' },
        { property: 'og:site_name', content: this.siteName },
        { property: 'og:locale', content: locale },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:alt', content: shareTitle },
        { property: 'og:updated_time', content: updatedTime }
      ];
      openGraphTags.forEach(tag => this.meta.updateTag(tag));

      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: shareTitle },
        { name: 'twitter:description', content: shareDescription },
        { name: 'twitter:image', content: imageUrl },
        { name: 'twitter:image:alt', content: shareTitle },
        { name: 'twitter:site', content: this.twitterHandle },
        { name: 'twitter:creator', content: this.twitterHandle },
        { name: 'twitter:url', content: canonicalUrl }
      ];
      twitterTags.forEach(tag => this.meta.updateTag(tag));
    }
    
    gotoHome($event: any){
      this.router.navigateByUrl('/home')
    }

    navigateBack(event: Event): void {
      event.preventDefault();
      event.stopPropagation();

      if (isPlatformBrowser(this.platformId) && window.history.length > 1) {
        this.location.back();
        return;
      }

      this.router.navigateByUrl('/deals');
    }
    
  gotToShop(dealUrl: any){
    window.open(dealUrl);
  }

  shareOnWhatsApp($event:any, selectedDeal: DealDataItem){
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedDeal);
  }
 
  private resolveCountry(deal: DealDataItem): string {
    if(deal.country && deal.country.trim().length){
      return deal.country;
    }
    if(deal.city && deal.city.trim().length){
      return deal.city;
    }
    return 'USA';
  }

  private formatPrice(deal: DealDataItem, country: string): string {
    const priceValue = Number(deal.currentPrice ?? 0);
    if(!priceValue){
      return '';
    }
    const isUsa = country?.toLocaleLowerCase() === 'usa';
    const currency = isUsa ? 'USD' : 'INR';
    const locale = isUsa ? 'en-US' : 'en-IN';
    try{
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(priceValue);
    }catch{
      return priceValue.toString();
    }
  }

  private buildDiscountText(deal: DealDataItem): string {
    if(!deal.discount){
      return '';
    }
    if(deal.discountType === '%'){
      return `${deal.discount}% off`;
    }
    return `${deal.discountType ?? ''}${deal.discount} off`.trim();
  }

  private buildShareTitle(title: string, formattedPrice: string, discountText: string): string {
    const priceSection = formattedPrice ? `Now ${formattedPrice}` : '';
    const discountSection = discountText ? ` • ${discountText}` : '';
    return [`${this.siteName}`, priceSection, discountSection, title].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }

  private buildShareDescription(description?: string, discountText?: string): string {
    if(description && description.trim().length){
      return description.trim();
    }
    return `Discover limited-time savings ${discountText ? '(' + discountText + ')' : ''} on Naari Deals.`.trim();
  }

  private buildImageUrl(imageUrl?: string | null, merchant?: string | null): string {
    if(!imageUrl){
      return this.defaultShareImage;
    }
    let resolved = imageUrl.trim();
    const isProtocolRelative = resolved.startsWith('//');
    const hasProtocol = resolved.startsWith('http');
    if(isProtocolRelative){
      resolved = `https:${resolved}`;
    }else if(!hasProtocol){
      if(resolved.startsWith('/')){
        resolved = `${this.siteBaseUrl}${resolved}`;
      }else if(merchant === 'Amazon'){
        resolved = `https:${resolved}`;
      }else{
        resolved = `${this.siteBaseUrl}/${resolved}`;
      }
    }
    return resolved;
  }

  private resolveLocale(country: string): string {
    return country?.toLocaleLowerCase() === 'usa' ? 'en_US' : 'en_IN';
  }

}
