import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ToggleService } from '../header/toggle.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';

interface SidebarMenuItem {
    label: string;
    icon: string;
    route: string;
    color?: string;
}

@Component({
    selector: 'app-sidebar',
    imports: [
        RouterLinkActive,
        RouterModule,
        RouterLink,
        NgClass,
        NgFor,
        NgIf,
        FeathericonsModule
    ],
    templateUrl: './sidebar.component.html',    
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    menuItems: SidebarMenuItem[] = [
        // Dashboard overview
        { label: 'Dashboard', icon: 'bar-chart-2', route: '/pages/ecommerce-page', color: '#5D87FF' },

        // Deal & merchant operations
        { label: 'Deals', icon: 'shopping-cart', route: '/admin/deals-list', color: '#5D87FF' },
        { label: 'Sellers', icon: 'users', route: '/admin/sellers', color: '#F97316' },

        // User management
        { label: 'Users', icon: 'users', route: '/users/users-list', color: '#8B5CF6' },

        // Communication & alerts
        { label: 'Notifications', icon: 'bell', route: '/notifications', color: '#F59E0B' },

        // Personal account area
        { label: 'My Profile', icon: 'user', route: '/my-profile', color: '#22D3EE' },
        { label: 'Account Settings', icon: 'settings', route: '/settings', color: '#5D87FF' },
        { label: 'Change Password', icon: 'lock', route: '/settings/change-password', color: '#F43F5E' },

        // Policies & exit
        { label: 'Privacy Policy', icon: 'file-text', route: '/settings/privacy-policy', color: '#14B8A6' },
        { label: 'Terms & Conditions', icon: 'book-open', route: '/settings/terms-conditions', color: '#A855F7' },
        { label: 'Logout', icon: 'home', route: '/authentication/logout', color: '#FF6B6B' }
    ];

    constructor(
        private toggleService: ToggleService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

}