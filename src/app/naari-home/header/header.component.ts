import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, Input, inject, Signal, PLATFORM_ID, OnChanges, SimpleChanges, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PCategory } from '@app/services/deals.model';
import { SignalStore } from '@app/services/store/signal-store';
import { UserState } from '@app/services/store/user-store';
import { UserStoreService } from '@app/services/store/user-store.service';
import { Account } from '@app/services/profile.model';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SaasSidebarComponent } from './sidebar/sidebar.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, NgOptimizedImage, RouterModule, RouterLink, NgbModule, NgbNavModule,
        SaasSidebarComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderStyleComponent implements OnInit, OnChanges, OnDestroy {

    isSticky: boolean = false;
    @Input() menuList: Array<PCategory> = new Array<PCategory>();
    @Input() mobile: boolean =  false;
    @Input() color: boolean =  false;
    
    @HostListener('window:scroll', [])
    checkScroll() {
        if (isPlatformBrowser(this.platformId)) {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            console.log('Scroll position:', scrollPosition, 'isSticky:', this.isSticky);
            if (scrollPosition >= 50) {
                if (!this.isSticky) {
                    this.isSticky = true;
                    this.cdr.detectChanges();
                    console.log('Set sticky to TRUE');
                }
            } else {
                if (this.isSticky) {
                    this.isSticky = false;
                    this.cdr.detectChanges();
                    console.log('Set sticky to FALSE');
                }
            }
        }
    }

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = false;
    isBrowser: boolean = false;
    // private readonly userStore = inject(SignalStore<UserState>);
    // readonly account = this.userStore.select(x => x.account);
    // readonly token = this.userStore.select(x => x.token);
    private userStore: UserStoreService = inject(UserStoreService);
    userAccount: Signal<Account> = this.userStore.getUserAccount();
    isLoggedIn: Signal<boolean> = this.userStore.getUserLoginStatus();
    // public platformId: object =  inject(PLATFORM_ID);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private router: Router=  inject(Router);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    
    constructor(
        public themeService: ThemeCustomizerService,
        @Inject(PLATFORM_ID) public platformId: object,
    ) {
        this.themeService.isToggled$.subscribe((isToggled: boolean) => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
        //consolie.log('Header : ngOnInit = ' + this.platformId);
        if(isPlatformBrowser(this.platformId)){
            this.isBrowser = true;
            this.detectDevice();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        //consolie.log('Header: ngOnChanges = ' + this.platformId);
        if(isPlatformBrowser(this.platformId)){
            this.isBrowser = true;
            this.detectDevice();
        }
    }

    private detectDevice(): void {
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

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    classApplied2 = false;
    toggleClass2() {
        this.classApplied2 = !this.classApplied2;
    }

    classApplied3 = false;
    toggleClass3() {
        this.classApplied3 = !this.classApplied3;
    }

    sidebarVisible: boolean = false;
    appsDrawerVisible: boolean = false;
    
    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
        this.syncBodyScrollLock();
    }
    
    toggleAppsDrawer() {
        this.appsDrawerVisible = !this.appsDrawerVisible;
        this.syncBodyScrollLock();
    }

    closeAppsDrawer() {
        if (this.appsDrawerVisible) {
            this.appsDrawerVisible = false;
            this.syncBodyScrollLock();
        }
    }

    logout($event: any){
        this.userStore.logout();
        this.router.navigateByUrl('/');

    }

    ngOnDestroy(): void {
        this.unlockBodyScroll();
    }

    private syncBodyScrollLock(): void {
        const shouldLock = this.sidebarVisible || this.appsDrawerVisible;
        this.setBodyScrollLock(shouldLock);
    }

    private setBodyScrollLock(lock: boolean): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const className = 'drawer-scroll-lock';
        const htmlElement = document.documentElement;
        if (lock) {
            document.body.classList.add(className);
            htmlElement.classList.add(className);
        } else {
            document.body.classList.remove(className);
            htmlElement.classList.remove(className);
        }
    }

    private unlockBodyScroll(): void {
        this.setBodyScrollLock(false);
    }

}