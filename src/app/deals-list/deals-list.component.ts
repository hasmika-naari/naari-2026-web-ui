import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, Signal, TransferState, inject, makeStateKey } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { HeaderStyleComponent } from '../naari-home/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Category, DealDataItem, DealSorting, DealType, PCategory } from '@app/services/deals.model';
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
import { SeoService } from '@app/services/seo/seo.service';
import { AuthService } from '@app/services/auth.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { DealsStoreService } from '@app/services/store/deals-store.service';

@Component({
    selector: 'app-deals-list',
    imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, NgxPaginationModule,
        NgOptimizedImage, HeaderStyleComponent, DealsBlogComponent, FooterComponent,
        CarouselModule, MatButtonModule, MatChipsModule, MatIconModule,
        MatMenuModule, LanguageSubscribeComponent, MatCardModule, MatProgressBarModule],
    templateUrl: './deals-list.component.html',
    styleUrls: ['./deals-list.component.scss']
})
export class DealsListComponent implements OnInit, OnDestroy {

  public page:any = 0;
  public counts = [42, 84, 126];
  public count:any = 42;
  public viewCol: number = 14.25;
  maxSize = 5;
  autoHide= false;
  country: any = 'usa';
  selectedSorting: DealSorting = {title: 'Default', isSelected: true};
  public sortings = [
    {title: 'Default', isSelected: true},
    {title: 'Lowest Discount First', isSelected: false},
    {title: 'Highest Discount First', isSelected: false}
    ];

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


    isToggled = false;
    // dealTypes: Array<DealType> = new Array<DealType>();
    // selectedDealType: Array<DealType> = new Array<DealType>();
    // selectedCategory: Array<Category> = new Array<Category>();
    // deals: Array<DealDataItem> = new Array<DealDataItem>();
    // sortedDeals: Array<DealDataItem> = new Array<DealDataItem>();


    pCategories: Signal< Array<PCategory>> = this.dealsStoreService.getPcCategories();
    categories: Signal< Array<Category>> = this.dealsStoreService.getCategories();

    dealTypes: Signal<Array<DealType>> = this.dealsStoreService.getDealTypes();
    selectedDealType: Signal<DealType> = this.dealsStoreService.getSelectedDealType();
    selectedCategory: Signal<Category> = this.dealsStoreService.getSelectedCategory();
    
    selectedDeal: Signal<DealDataItem> = this.dealsStoreService.getSelectedDeal();
    localSelectedDeal: DealDataItem = new DealDataItem();
    deals:  Signal<Array<DealDataItem>> =this.dealsStoreService.getDeals();
    sortedDeals:  Signal<Array<DealDataItem>> =this.dealsStoreService.getDeals();


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

        if(isPlatformServer(this.platformId)){
            //////consolie.log('isPlatformServer');
          }

          if(isPlatformBrowser(this.platformId)){
            //////consolie.log('isPlatformBrowser');
          }
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnDestroy(): void {
        
    }

    ngOnInit(): void {

      // this.subs.push(this.route.params.subscribe(params => { 
      //   ;
      //   const dealType = params['type'];
      //   const category = params['category'];
      //   // //////consolie.log('ngOnInit: query param: category' + category);
      //   //////consolie.log('ngOnInit: query param: dealType' + dealType);
      //   this.fetchData(dealType, category);

      // })); 

        const dealType = this.route.snapshot.queryParams['type'];
        const category = this.route.snapshot.queryParams['category'];
        //////consolie.log('ngOnInit: query param: category' + category);
        //////consolie.log('ngOnInit: query param: dealType' + dealType);
        this.fetchData(dealType, category);

        // if(isPlatformServer(this.platformId)){
        //     //////consolie.log('isPlatformServer - dealId' + dealType);

        //   }

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


    fetchData(dealType: string, category: string): void{

      if(!dealType && !category){
        this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
          this.deals = _.cloneDeep(deals);
          this.sortedDeals =  _.cloneDeep(deals);
           if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem[]>(
              makeStateKey('dealsByFilter'), deals
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }
        });
      }else if((dealType && dealType === 'All')
         && (this.dealsService && category === 'All')){
        this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
          this.deals = _.cloneDeep(deals);
          this.sortedDeals =  _.cloneDeep(deals);
          if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem[]>(
              makeStateKey('dealsByFilter'), deals
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }
        });
      }else if((dealType && dealType === 'All') && 
             (category && category !== 'All'))
      {
        this.dealsService.getDealsByCountryAndCategory('usa', category, this.platformId).subscribe((deals) => {
          this.deals = _.cloneDeep(deals);
          this.sortedDeals =  _.cloneDeep(deals);
          if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem[]>(
              makeStateKey('dealsByFilter'), deals
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }
        });
      }else if((dealType && dealType !== 'All') && 
      (category && category === 'All'))
      {
        this.dealsService.getDealsByCountryAndDealType('usa', dealType, this.platformId).subscribe((deals) => {
          this.deals = _.cloneDeep(deals);
          this.sortedDeals =  _.cloneDeep(deals);
          if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem[]>(
              makeStateKey('dealsByFilter'), deals
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }
        });
      }else if((dealType && dealType !== 'All') && 
              (category && category !== 'All')){
        this.dealsService.getDealsByCountryCategoryAndDealType('usa', dealType, category, this.platformId ).subscribe((deals) => {
          this.deals = _.cloneDeep(deals);
          this.sortedDeals =  _.cloneDeep(deals);
          if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem[]>(
              makeStateKey('dealsByFilter'), deals
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }

        });
      }else{
        this.dealsService.getDealsByCountry('usa', this.platformId).subscribe((deals) => {
          this.deals = _.cloneDeep(deals);
          this.sortedDeals =  _.cloneDeep(deals);
          if(isPlatformServer(this.platformId)){
            this.transferState.set<DealDataItem[]>(
              makeStateKey('dealsByFilter'), deals
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }
        });
      }

        this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
          // this.categories = [...categories];
            /// divide into parentList
          // Group categories by parent and map them to the desired format
          let selectedCategory = [];
          if(category === 'All'){
            let cat: Category = new Category();
            cat.code = "All",
            cat.country = this.country,
            cat.description = '';
            cat.title = 'All Deals',
            cat.subTitle = 'All Deals'
            selectedCategory.push(cat);
          }else{
            selectedCategory = categories.filter((cat: Category) => cat.code === category);
          }

          if(isPlatformServer(this.platformId)){
            this.transferState.set<Category>(
              makeStateKey('selectedCategory'), selectedCategory
            );
             this.transferState.set<DealDataItem[]>(
              makeStateKey('categoriesTable'), categories
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }
          //////consolie.log('Sel Category = ' + category);
          //////consolie.log('Sel Cat length = ' + this.selectedCategory.length);
          this.dealsService.getDealTypes('usa', this.platformId).subscribe((dealTypes) => {
            // this.dealTypes = [...dealTypes]
            let selectedDealTypes: Array<DealType> = [];
            let selectedDealType: any;

            if(dealType === 'All'){
              let dt:DealType = new DealType();
              dt.code = "All",
              dt.country = this.country,
              dt.title = 'All Deals',
              dt.subTitle = 'All Deals'
              selectedDealTypes.push(dt);
            }else{
              selectedDealType = selectedDealTypes.filter((dtype) => dtype.code === dealType);
            }

              if(isPlatformServer(this.platformId)){
            this.transferState.set<Array<DealType>>(
              makeStateKey('selectedDealTypes'), selectedDealTypes
            );
             this.transferState.set<DealDataItem[]>(
              makeStateKey('dealTypes'), dealTypes
            );
          }else{
              //  this.dealsStoreService.updateDeals(deals);
          }

           this.loadDealPageBreadgrumText(selectedDealTypes[0], this.selectedCategory());

          });
        

          // this.pCategories = [..._.map(
          //     _.groupBy(categories, 'parent'),
          //     (categories, parent) => ({ parent, categories }))];
        });

       
     
    }

    loadFetcheddata(){
        //consolie.log('This is isPlatformBrowser...');
      
        if(this.transferState.hasKey(makeStateKey('dealsByFilter'))){
          // this.dealsStoreService.updateDeals(this.transferState.get(makeStateKey('dealsByFilter'), []));
        }else{
          // this.fetchData(this.selectedDealId);
        }
  
        if(this.transferState.hasKey(makeStateKey('selectedCategory'))){
          this.dealsStoreService.updateSelectedCategory(this.transferState.get(makeStateKey('selectedCategory'), new Category()));
        }else{
          // this.fetchData(this.selectedDealId);
        }
        
        if(this.transferState.hasKey(makeStateKey('categoriesTable'))){
          this.dealsStoreService.updateCategories(this.transferState.get(makeStateKey('categoriesTable'), []));
        }else{
          // this.fetchData(this.selectedDealId);
        }

        if(this.transferState.hasKey(makeStateKey('dealTypes'))){
          this.dealsStoreService.updateDealTypes(this.transferState.get(makeStateKey('dealTypes'), []));
        }else{
          // this.fetchData(this.selectedDealId);
        }
  
    }

    loadDealPageBreadgrumText(dealType: DealType, category: Category){
      let selType = ''; 
      //////consolie.log('Selected DealType' + dealType?.title);
      //////consolie.log('Selected Category' + category?.title);
      if(dealType && dealType.code){
        selType = dealType.title;
        let selectedDealTitle =  ' 🔥 Naari Deals - ' +  selType?selType  + ' Savings Deals for You': 'All Best Deals';
        this.meta.updateTag({property:"og:title",content:selectedDealTitle});
        this.meta.updateTag({property:"og:description",content:'Share & Help Friends to Save more..'});
        this.meta.updateTag({property:"og:url",content: "https://naarideals.com/deals"});
                  
        this.meta.updateTag({property:"twitter:title",content:selectedDealTitle});
        this.meta.updateTag({property:"twitter:description",content:'Share & Help Friends to Save more..'});
        this.meta.updateTag({property:"twitter:url",content: "https://naarideals.com/deals"});
      }
      if(category && category.code){
        selType = selType + ' ( ' + category.title + ' ) ';
      }
      this.currentUrl = selType;
      
      this.title.setTitle(this.currentUrl);
  
    }
    
       
  gotToShop(dealUrl: any){
    window.open(dealUrl);
  }

  public onPageChanged(event: any){
    this.page = event;
    // this.getAllProducts(); 
    // if (isPlatformBrowser(this.platformId)) {
      //////consolie.log('Screen Height: ' + document.documentElement.clientHeight);
      if(this.isMobile){
        window.scrollTo(0, 275);
      }else{
        window.scrollTo(0, 375);
      }
    // } 
  }

  showStartDate(startDate: any){
    let dDate: Date = new Date(startDate);
    let today: Date = new Date();
    return (dDate >= today);
  }

  public changeSorting(sort: any){
    this.selectedSorting = sort;
    this.dealsStoreService.sortDeals(sort);
    // if(this.selectedSorting && this.selectedSorting.title === 'Lowest Discount First'){
    //   this.sortedDeals = [..._.orderBy(this.deals, (d: DealDataItem) => +d.discount, ['asc'])];
    // }else if(this.selectedSorting && this.selectedSorting.title === 'Highest Discount First'){
    //   this.sortedDeals = [..._.orderBy(this.deals, d => +d.discount,  ['desc'])];
    // }else{
    //   this.sortedDeals = [...this.deals];
    // }
    if(this.isMobile){
      window.scrollTo(0, 275);
    }else{
      window.scrollTo(0, 375);
    }
  }

  shareOnWhatsApp($event:any, selectedDeal: DealDataItem){
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedDeal);
  }
}
