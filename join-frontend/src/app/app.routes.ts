import { Routes } from '@angular/router';
import { LogInComponent } from './login/log-in/log-in.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { PrivacyPolicyComponent } from './legal-pages/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-pages/legal-notice/legal-notice.component';
import { LayoutComponent } from './layout/layout.component';  // Importiere die Layout-Komponente
import { AddTaskComponent } from './kanban/add-task/add-task.component';
import { BoardComponent } from './kanban/board/board.component';
import { ContactsComponent } from './kanban/contacts/contacts.component';
import { SummaryComponent } from './kanban/summary/summary.component';
import { HelpPageComponent } from './legal-pages/help-page/help-page.component';

export const routes: Routes = [
    { path: '', component: LogInComponent },
    { path: 'login', component: LogInComponent },
    { path: 'sign-up', component: SignUpComponent },
    {
        path: 'kanban',
        component: LayoutComponent,
        children: [
            { path: 'add-task', component: AddTaskComponent },
            { path: 'board', component: BoardComponent },
            { path: 'contacts', component: ContactsComponent },
            { path: 'summary', component: SummaryComponent },
            { path: 'help-page', component: HelpPageComponent },
            { path: 'privacy-policy', component: PrivacyPolicyComponent },
            { path: 'legal-notice', component: LegalNoticeComponent },
        ]
    }
];
