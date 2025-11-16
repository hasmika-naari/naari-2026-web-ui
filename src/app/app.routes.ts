import { Routes } from '@angular/router';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { AppsComponent } from './apps/apps.component';
import { ToDoListComponent } from './apps/to-do-list/to-do-list.component';
import { CalendarComponent } from './apps/calendar/calendar.component';
import { ContactsComponent } from './apps/contacts/contacts.component';
import { ChatComponent } from './apps/chat/chat.component';
import { EmailComponent } from './apps/email/email.component';
import { InboxComponent } from './apps/email/inbox/inbox.component';
import { ComposeComponent } from './apps/email/compose/compose.component';
import { ReadComponent } from './apps/email/read/read.component';
import { KanbanBoardComponent } from './apps/kanban-board/kanban-board.component';
import { FileManagerComponent } from './apps/file-manager/file-manager.component';

import { NotFoundComponent } from './common/not-found/not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ConnectionsComponent } from './settings/connections/connections.component';
import { PrivacyPolicyComponent } from './settings/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './settings/terms-conditions/terms-conditions.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NaariHomePageComponent } from './naari-home/naari-home.component';
import { EcommercePageComponent } from './pages/ecommerce-page/ecommerce-page.component';
import { EProductsGridComponent } from './pages/ecommerce-page/e-products-grid/e-products-grid.component';
import { EProductsListComponent } from './pages/ecommerce-page/e-products-list/e-products-list.component';
import { EProductDetailsComponent } from './pages/ecommerce-page/e-product-details/e-product-details.component';
import { ECreateProductComponent } from './pages/ecommerce-page/e-create-product/e-create-product.component';
import { ECartComponent } from './pages/ecommerce-page/e-cart/e-cart.component';
import { ECheckoutComponent } from './pages/ecommerce-page/e-checkout/e-checkout.component';
import { EOrdersListComponent } from './pages/ecommerce-page/e-orders-list/e-orders-list.component';
import { EOrderDetailsComponent } from './pages/ecommerce-page/e-order-details/e-order-details.component';
import { ECustomersListComponent } from './pages/ecommerce-page/e-customers-list/e-customers-list.component';
import { ESellersComponent } from './pages/ecommerce-page/e-sellers/e-sellers.component';
import { ESellerDetailsComponent } from './pages/ecommerce-page/e-seller-details/e-seller-details.component';
import { ManageDealsComponent } from './pages/ecommerce-page/manage-deals/manage-deals.component';
import { EDealsGridComponent } from './pages/ecommerce-page/e-deals-grid/e-deals-grid.component';
import { PostDealComponent } from './pages/ecommerce-page/manage-deals/post-deal/post-deal.component';

export const routes: Routes = [
    { path: '', 
       redirectTo: 'home',
       pathMatch: 'full'  
    },
    { path: 'home', component: NaariHomePageComponent, data: {reuseComponent: true, breadcrumb: 'Naari Deals - Femine Specials'}},
     {
        path: 'deal/:id',
        loadComponent: () => 
            import('./deal-details-page/deal-details-page.component')
                .then(m => m.DealDetailsPageComponent), data: {reuseComponent: true, breadcrumb: 'Deal Details'}
    },
    {
            path: 'deals',
            loadComponent: () => 
                import('./deals-list/deals-list.component')
                    .then(m => m.DealsListComponent), data: {reuseComponent: true, breadcrumb: 'Deals By Category' },
    },
     {
        path: 'sign-in',
        loadComponent: () => 
            import('./pages/authentication/login-page/login-page.component')
                .then(m => m.LoginPageComponent), data: {reuseComponent: true, breadcrumb: 'Sign In' }
    },
      {
        path: 'login',
        loadComponent: () => 
            import('./login-page/login-page.component')
                .then(m => m.LoginPageComponent), data: {reuseComponent: true, breadcrumb: 'Login' },
    },
    {
        path: 'reset-password',
        loadComponent: () => 
            import('./reset-password-page/reset-password-page.component')
                .then(m => m.ResetPasswordPageComponent), data: {reuseComponent: true, breadcrumb: 'Change Password' },
    },
    {
        path: 'register',
        loadComponent: () => 
            import('./pages/authentication/register-page/register-page.component')
                .then(m => m.RegisterPageComponent), data: {reuseComponent: true, breadcrumb: 'Register' },
    },
    {
        path: 'activate',
        loadComponent: () => 
            import('./activate-account-page/activate-account-page.component')
                .then(m => m.ActivateAccountPageComponent), data: {reuseComponent: true, breadcrumb: 'Activate' },
    },
    {
        path: 'bio-profile',
        loadComponent: () => 
            import('./bio-profile/bio-profile-page.component')
                .then(m => m.BioProfilePageComponent), data: {reuseComponent: true, breadcrumb: 'Bio Profile' },
    },
    {
        path: 'boutiques',
        loadComponent: () => 
            import('./boutique-page/boutique-page.component')
                .then(m => m.BoutiquePageComponent), data: {reuseComponent: true, breadcrumb: 'Boutique' },
    },
    {
        path: 'contact-us',
        loadComponent: () => 
            import('./contact-page/contact-page.component')
                .then(m => m.ContactComponent), data: {reuseComponent: true, breadcrumb: 'Contact Us' },
    },
    {
        path: 'faq',
        loadComponent: () => 
            import('./faq-page/faq-page.component')
                .then(m => m.FaqPageComponent), data: {reuseComponent: true, breadcrumb: 'FAQ' },
    },
    {
        path: 'terms',
        loadComponent: () => 
            import('./terms-page/terms-page.component')
                .then(m => m.TermsPageComponent), data: {reuseComponent: true, breadcrumb: 'Terms' },
    },
    {
        path: 'privacy',
        loadComponent: () => 
            import('./privacy-page/privacy-page.component')
                .then(m => m.PrivacyPageComponent), data: {reuseComponent: true, breadcrumb: 'Pricacy' },
    },
    {
        path: 'black-friday',
        loadComponent: () => 
            import('./black-friday-landing/black-friday-landing.component')
                .then(m => m.BlackFridayLandingComponent), data: {reuseComponent: true, breadcrumb: 'Black Friday 2025' },
    },
    {
        path: 'black-friday/:merchantId/ad-scans',
        loadComponent: () => 
            import('./black-friday-ad-scan/black-friday-ad-scan.component')
                .then(m => m.BlackFridayAdScanComponent), data: {reuseComponent: true, breadcrumb: 'Black Friday Ad Scans' },
    },
    {
        path: 'apps',
        component: AppsComponent,
        children: [
            {path: '', component: ToDoListComponent},
            {path: 'calendar', component: CalendarComponent},
            {path: 'contacts', component: ContactsComponent},
            {path: 'chat', component: ChatComponent},
            {
                path: 'email',
                component: EmailComponent,
                children: [
                    {path: '', component: InboxComponent},
                    {path: 'compose', component: ComposeComponent},
                    {path: 'read', component: ReadComponent}
                ]
            },
            {path: 'kanban-board', component: KanbanBoardComponent},
            {path: 'file-manager', component: FileManagerComponent}
        ]
    },
    {path: 'my-profile', component: MyProfileComponent},
    {
        path: 'admin',
        component: EcommercePageComponent,
        children: [
            {path: 'dashboard', component: EProductsGridComponent},
            {path: 'deals-list', component: ManageDealsComponent},
            {path: 'post-deal', component: PostDealComponent},
            {path: 'edit-deal/:id', component: PostDealComponent},
            {path: 'deals-grid', component: EDealsGridComponent},
            {path: 'products-list', component: EProductsListComponent},
            {path: 'product-details', component: EProductDetailsComponent},
            {path: 'create-product', component: ECreateProductComponent},
            {path: 'cart', component: ECartComponent},
            {path: 'checkout', component: ECheckoutComponent},
            {path: 'orders-list', component: EOrdersListComponent},
            {path: 'order-details', component: EOrderDetailsComponent},
            {path: 'customers-list', component: ECustomersListComponent},
            {path: 'sellers', component: ESellersComponent},
            {path: 'seller-details', component: ESellerDetailsComponent}
        ]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        children: [
            {path: '', component: AccountSettingsComponent},
            {path: 'change-password', component: ChangePasswordComponent},
            {path: 'connections', component: ConnectionsComponent},
            {path: 'privacy-policy', component: PrivacyPolicyComponent},
            {path: 'terms-conditions', component: TermsConditionsComponent}
        ]
    },
    // Here add new pages component

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];