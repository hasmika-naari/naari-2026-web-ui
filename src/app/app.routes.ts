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

export const routes: Routes = [
    { path: '', component: NaariHomePageComponent, data: {reuseComponent: true, breadcrumb: 'Naari Deals - Femine Specials'}},
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