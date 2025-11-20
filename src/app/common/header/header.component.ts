import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { RouterLink } from '@angular/router';
import { ToggleService } from './toggle.service';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-header',
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, DrawerModule, RouterLink, NgClass],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

    constructor(
        public toggleService: ToggleService,
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
    private isBrowser = false;

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

}