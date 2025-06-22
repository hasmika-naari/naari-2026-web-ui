declare let $: any;

import {
  Component,
  inject,
  Inject,
  makeStateKey,
  PLATFORM_ID,
  Renderer2,
  TransferState
} from '@angular/core';
import {
  isPlatformBrowser,
  isPlatformServer,
  CommonModule,
  Location,
  LocationStrategy,
  PathLocationStrategy,
  DOCUMENT
} from '@angular/common';
import {
  Router,
  RouterOutlet,
  NavigationCancel,
  NavigationEnd
} from '@angular/router';

import { MatIconRegistry } from '@angular/material/icon';
import { Platform } from '@angular/cdk/platform';

import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';

import { ToggleService } from './common/header/toggle.service';
import { MenuListItem } from './services/bee-compete.model';
import { AppUtilService } from './services/app.util.service';
import { LocalStorageService } from './services/local-storage.service';
import { AppConstantsService } from './services/app-constants.service';
import { UserStoreService } from './services/store/user-store.service';
import { DealsService } from './services/deals.service';
import { DealsStoreService } from './services/store/deals-store.service';
import { ThemeCustomizerService } from './services/theme-customizer/theme-customizer.service';

import { filter } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Console } from 'console';

const CATEGORIES_KEY = makeStateKey<any>('categories');
const DEAL_TYPES_KEY = makeStateKey<any>('dealTypes');
const BRANDS_KEY = makeStateKey<any>('brands');
const MERCHANTS_KEY = makeStateKey<any>('merchants');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class AppComponent {
  title = 'Naarideals.com - Deals for Women needs';
  isToggled = false;
  isLoading = true;
  routerSubscription: any;
  location: any;

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private platformId = inject(PLATFORM_ID);
  private appUtilService: AppUtilService | null = this.isBrowser ? inject(AppUtilService) : null;
  private storageService: LocalStorageService = inject(LocalStorageService);
  private constantsService: AppConstantsService = inject(AppConstantsService);
  private userStore: UserStoreService = inject(UserStoreService);
  private locationService: Location = inject(Location);
  public router: Router = inject(Router);
  private dealsService: DealsService = inject(DealsService);
  private dealsStoreService: DealsStoreService = inject(DealsStoreService);
  private transferState: TransferState = inject(TransferState);
  private themeCustomizer: ThemeCustomizerService = inject(ThemeCustomizerService);

  constructor(
    public toggleService: ToggleService,
    private iconRegistry: MatIconRegistry,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private platform: Platform
  ) {
    this.toggleService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
  this.userStore.updateMenuList(this.getDefaultMenu());

  if (this.isBrowser) {
    this.initializeAOS();
  }

  // Remove this line:
  // this.maybeLoadSharedAppData();

  // Keep only this (runs after first NavigationEnd, which is enough)
  this.routerSubscription = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.maybeLoadSharedAppData();
    });
}

  private maybeLoadSharedAppData() {
    // console.log('APP Component maybeLoadSharedAppData .. START');
    const hasCategories = this.dealsStoreService.getCategories()()?.length;
    const hasDealTypes = this.dealsStoreService.getDealTypes()()?.length;
    const hasBrands = this.dealsStoreService.getBrands()()?.length;
    const hasMerchants = this.dealsStoreService.getMerchants()()?.length;

    const isAlreadyLoaded = hasCategories && hasDealTypes && hasBrands && hasMerchants;

    if (!isAlreadyLoaded) {
    // console.log('APP Component maybeLoadSharedAppData.. Data not Loaded.. ');
      this.tryAutoLoginAndFetchData(); // Will call loadSharedAppData
    } else {
      this.isLoading = false;
    }
  }

  private initializeAOS() {
    import('aos').then(AOS => {
      AOS.default.init({
        duration: 1000,
        once: false,
        easing: 'ease-in-out'
      });
    });
  }

  private tryAutoLoginAndFetchData() {
    if (!this.isBrowser) return;

    const userNameRaw = this.storageService.getItemByName("userName");
    const passwordRaw = this.storageService.getItemByName("passWord");
    const locationPath = this.locationService.path(true);

    const parsedUserName = this.parseJSON(userNameRaw);
    const parsedPassword = this.parseJSON(passwordRaw);

    if (!parsedUserName || !parsedPassword) {
      this.storageService.removeItem('authenticated');
      this.isLoading = false;
      return;
    }

    this.appUtilService?.loginWithCredentials(parsedUserName, parsedPassword, locationPath).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.userStore.setUserLoginStatus(true);
          // console.log('After Login is done.. Load the Data ');
          this.loadSharedAppData().then(() => this.isLoading = false);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private parseJSON(value: string | null): any {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  private async loadSharedAppData(): Promise<void> {
    try {
      let categories: any[] = [];
      let dealTypes: any[] = [];
      let brands: any[] = [];
      let merchants: any[] = [];

      const isServer = isPlatformServer(this.platformId);
      const isBrowser = isPlatformBrowser(this.platformId);

      if (isServer) {
        console.log('APP Component : SSR: Fetching fresh data from APIs');
        categories = await firstValueFrom(this.dealsService.getCategoriesByCountry('usa', this.platformId));
        dealTypes = await firstValueFrom(this.dealsService.getDealTypes('usa', this.platformId));
        brands = await firstValueFrom(this.dealsService.getBrands('usa'));
        merchants = await firstValueFrom(this.dealsService.getMerchants('usa'));

        this.transferState.set(CATEGORIES_KEY, categories);
        this.transferState.set(DEAL_TYPES_KEY, dealTypes);
        this.transferState.set(BRANDS_KEY, brands);
        this.transferState.set(MERCHANTS_KEY, merchants);
      } else if (isBrowser) {
        console.log('App Component: Browser: Hydrating from TransferState');
        categories = this.transferState.get(CATEGORIES_KEY, []);
        dealTypes = this.transferState.get(DEAL_TYPES_KEY, []);
        brands = this.transferState.get(BRANDS_KEY, []);
        merchants = this.transferState.get(MERCHANTS_KEY, []);

        this.transferState.remove(CATEGORIES_KEY);
        this.transferState.remove(DEAL_TYPES_KEY);
        this.transferState.remove(BRANDS_KEY);
        this.transferState.remove(MERCHANTS_KEY);
      }
        console.log('App Component: Browser: dealTypes' + dealTypes);

      this.dealsStoreService.updateCategories(categories);
      this.dealsStoreService.updateDealTypes(dealTypes);
      this.dealsStoreService.updateBrands(brands);
      this.dealsStoreService.updateMerchants(merchants);
    } catch (err) {
      console.error('Error loading shared app data', err);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      $.ajaxSetup({ cache: true });
      if ($ !== undefined && $.getScript) {
        $.getScript('assets/js/custom.js');
      }
      this.recallJsFunctions();
    }
  }

  private recallJsFunctions() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
      .subscribe(event => {
        this.location = this.router.url;
        if (event instanceof NavigationEnd) {
          this.scrollToTop();
          if ($ !== undefined && $.getScript) {
            $.getScript('assets/js/custom.js');
          }
        }
      });
  }

  private scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo(0, 0);
    }
  }

  toggleTheme() {
    this.toggleService.toggleTheme();
  }

  toggle() {
    this.toggleService.toggle();
  }

  private getDefaultMenu(): Array<MenuListItem> {
    return [
      {
        id: '1',
        parent: 'Features',
        menuItems: [
          { id: '1', title: 'AI Resume Optimizer', count: '31', code: 'AIRESUME', status: 'active', isSelected: false },
          { id: '2', title: 'Resume Manager', count: '40', code: 'RESUME-OPTI', status: 'active', isSelected: false },
          { id: '3', title: 'JOB Application Manager', count: '31', code: 'JOB-MANAGER', status: 'active', isSelected: false }
        ]
      },
      { id: '2', parent: 'Our Dashboard', menuItems: [] },
      { id: '3', parent: 'Resources', menuItems: [] },
      { id: '4', parent: 'Trends', menuItems: [] }
    ];
  }
}
