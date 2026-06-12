import { Component, OnInit, OnDestroy, inject, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../services/crm.service';
import gsap from 'gsap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  crm = inject(CrmService);
  @ViewChildren('kpiCard') kpiCards!: QueryList<ElementRef>;

  ngOnInit() {
    this.crm.loadCustomers(0, 5);
    this.crm.loadOrders(0, 5);
    this.crm.loadCampaigns();    // ← initial fetch immediately
    this.crm.loadAnalytics();
    this.crm.startPollingCampaigns();
  }

  ngAfterViewInit() {
    // We need to wait for signals to resolve the view if loading, but since analytics 
    // might be null initially, we should watch it or just animate what's there.
    // For simplicity, let's animate the cards once they are in the DOM
    setTimeout(() => {
      if (this.kpiCards.length > 0) {
        gsap.from(this.kpiCards.map(c => c.nativeElement), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    }, 100);
  }

  ngOnDestroy() {
    this.crm.stopPollingCampaigns();
  }
}
