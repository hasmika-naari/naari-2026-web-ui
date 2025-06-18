import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '@app/common/footer/footer.component';
import { HeaderComponent } from '@app/common/header/header.component';
import { ToggleService } from '@app/common/header/toggle.service';
import { SidebarComponent } from '@app/common/sidebar/sidebar.component';
import { filter } from 'rxjs';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';

@Component({
    selector: 'app-ecommerce-page',
    imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent, FooterWorkifenceComponent],
    templateUrl: './ecommerce-page.component.html',
    styleUrl: './ecommerce-page.component.scss'
})
export class EcommercePageComponent {
     // Toggle Service
    isToggled = false;
    routerSubscription: any;
    location: any;
    
    public  toggleService:ToggleService =  inject(ToggleService);
    public  router:Router =  inject(Router);

     constructor(
        @Inject(PLATFORM_ID) private platformId: Object
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
    ngOnInit(){
        if (isPlatformBrowser(this.platformId)) {
            this.recallJsFuntions();
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

}