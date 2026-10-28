import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { Home } from '../features/home/home';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { MembersList } from '../features/members/members-list/members-list';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MembersList },
      { path: 'members/:id', component: MemberDetailed },
      { path: 'lists', component: Lists },
      { path: 'messages', component: Messages },
    ],
  },
  { path: '**', component: Home },
];
