declare let $: any;
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, inject, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from '../app/common/header/toggle.service';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterOutlet, Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { ThemeCustomizerService } from './services/theme-customizer/theme-customizer.service';
import { Platform } from '@angular/cdk/platform';
import { MenuListItem } from './services/bee-compete.model';
import { AppUtilService } from './services/app.util.service';
import { LocalStorageService } from './services/local-storage.service';
import { AppConstantsService } from './services/app-constants.service';
import { UserStoreService } from './services/store/user-store.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent {

    title = 'Naarideals.com -  Deals for Women needs';
    routerSubscription: any;
    location: any;
    // Toggle Service
    isToggled = false;

      isLoading = true;
    menuList: Array<MenuListItem> =[
        {
          id: '1',
          parent: 'Features',
          menuItems: [
            {
              id: '1',
              title: 'AI Resume Optimizer',
              count: '31',
              code: 'AIRESUME',
              status: 'active',
              isSelected: false
            },
            {
              id: '2',
              title: 'Resume Manager',
              count: '40',
              code: 'RESUME-OPTI',
              status: 'active',
              isSelected: false
            },
            {
              id: '3',
              title: 'JOB Application Manager',
              count: '31',
              code: 'JOB-MANAGER',
              status: 'active',
              isSelected: false
            }
          ]
        },
        {
          id: '2',
          parent: 'Our Dashboard',
          menuItems:[]
        },
        {
          id: '3',
          parent: 'Resources',
          menuItems: []
        },
        {
          id: '4',
          parent: 'Trends',
          menuItems: []
        }
      ];
      private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private appUtilService: AppUtilService | null = this.isBrowser ? inject(AppUtilService) : null;
    private storageService: LocalStorageService = inject(LocalStorageService);
    private constantsService: AppConstantsService= inject(AppConstantsService);
    private userStore: UserStoreService = inject(UserStoreService);
    // private appUtilService: AppUtilService =  inject(AppUtilService);
    private locationService:Location =  inject(Location);
    public  router:Router =  inject(Router);

constructor(
        public toggleService: ToggleService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private iconRegistry: MatIconRegistry,
        private renderer: Renderer2,
        public themeCustomizer: ThemeCustomizerService,
        @Inject(DOCUMENT) private document: Document,
        private platform: Platform,
        // private route: ActivatedRoute,
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Settings Button Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // ngOnInit
  
    // ngOnInit
    async ngOnInit(){
        this.userStore.updateMenuList(this.menuList);

        if(isPlatformBrowser(this.platformId)){
          import('aos').then(AOS => {
            AOS.default.init({
              duration: 1000,  // Animation duration (in milliseconds)
              once: false,       // Ensures animation happens only once
              easing: 'ease-in-out' // Animation style
            });
          });
        
          setTimeout(() => {
            this.isLoading = false; // Set to false when data is loaded
          }, 10);
          this.storageService.removeItem('authToken');
          let userName:any = this.storageService.getItemByName("userName");
          let passWord:any = this.storageService.getItemByName("passWord");
          let locationPath:string = this.locationService.path(true);
          
          console.log('UserName: ' + userName);
          console.log('passWord: ' + passWord);
          console.log('locationPath: ' + this.router.url);
      // const item = localStorage.getItem('yourKey'); // Replace 'yourKey' with the actual key used
      if (!userName || !passWord) {
        // No value in localStorage for the given key
        console.log('No value found in localStorage');
        if(!locationPath.includes('activate') && !locationPath.includes('reset-finish') ){
          // this.router.navigateByUrl('/');
        }
      }
      let parsedUserName;
      let parsedUserPassword;

      try {
        parsedUserName =JSON.parse(userName);
      } catch (e) {
        // item is not a valid JSON, handle it as a plain string
        console.log('Item is not a valid JSON, treating it as plain string');
        parsedUserName = { notoken: userName };
      }

      try {
        parsedUserPassword =JSON.parse(passWord);
      } catch (e) {
        // item is not a valid JSON, handle it as a plain string
        console.log('Item is not a valid JSON, treating it as plain string');
        parsedUserPassword = { notoken: passWord };
      }
        
      try {
        
        if (!parsedUserName || !parsedUserPassword) {
          // noToken exists and is an empty string
          console.log('noToken is an empty string');
          this.storageService.removeItem('authenticated');
          if(!locationPath.includes('activate') && !locationPath.includes('reset-finish') && !locationPath.includes('opening')){
          }
        } else {
          console.log('noToken is not an empty string or does not exist');
          if (this.appUtilService) {
           this.appUtilService.loginWithCredentials(parsedUserName, parsedUserPassword, locationPath);
          }
        }
      } catch (e) {
        // Handle JSON parse error
        console.log('Error parsing JSON from localStorage', e);
      }
        
        }
    }

    // recallJsFuntions
    recallJsFuntions() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
            this.location = this.router.url;
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.scrollToTop();
        });
    }
    scrollToTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
        }
    }


      async ngAfterViewInit(): Promise<void> {
 
      if(isPlatformBrowser(this.platformId)){
        console.log('This is from Browser');
          
          $.ajaxSetup({
            cache: true
          });
          if($ !== undefined && $.getScript){
            $.getScript('assets/js/custom.js');
            console.log('ngAfterViewInit -  called from browser' )
          }
          this.recallJsFuntions();
        }else{
          console.log('This is from Server');
        }
      }




}