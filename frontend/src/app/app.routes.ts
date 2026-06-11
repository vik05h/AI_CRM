import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SegmentsComponent } from './pages/segments/segments.component';
import { CampaignsComponent } from './pages/campaigns/campaigns.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'segments', component: SegmentsComponent },
      { path: 'campaigns', component: CampaignsComponent },
      { path: 'analytics', component: AnalyticsComponent }
    ]
  }
];
