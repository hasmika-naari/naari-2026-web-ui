import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NgClass, NgIf, isPlatformBrowser } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { Router, RouterLink } from '@angular/router';
import { ToggleService } from './toggle.service';
import { DrawerModule } from 'primeng/drawer';
import { UserStoreService } from '@app/services/store/user-store.service';

@Component({
    selector: 'app-header',
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, DrawerModule, RouterLink, NgClass, NgIf],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

    constructor(
        public toggleService: ToggleService,
        private router: Router,
        private userStore: UserStoreService,
        @Inject(PLATFORM_ID) private platformId: object
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.isBrowser = isPlatformBrowser(this.platformId);
        if (this.isBrowser) {
            this.hasScrolled = window.scrollY > 20;
        }
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    hasScrolled = false;
    isBrowser = false;

    @HostListener('window:scroll')
    onWindowScroll() {
        if (!this.isBrowser) {
            return;
        }
        this.hasScrolled = window.scrollY > 20;
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Profile Drawer
    profileDrawerVisible = false;

    openProfileDrawer() {
        this.profileDrawerVisible = true;
    }

    logout(event?: Event) {
        event?.preventDefault();
        this.userStore.logout();
        this.profileDrawerVisible = false;
        this.router.navigateByUrl('/');
    }

}