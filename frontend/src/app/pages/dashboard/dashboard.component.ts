import { Component, OnInit, OnDestroy, inject, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import gsap from 'gsap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    setTimeout(() => {
      // Textflow header animation
      const textLines = document.querySelectorAll('app-dashboard .textflow-line');
      if (textLines.length > 0) {
        gsap.fromTo(textLines, 
          { y: '100%' }, 
          { y: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.1 }
        );
      }

      // KPI Cards animation
      if (this.kpiCards.length > 0) {
        gsap.fromTo(this.kpiCards.map(c => c.nativeElement), 
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'all'
          }
        );
      }
    }, 100);
  }

  ngOnDestroy() {
    this.crm.stopPollingCampaigns();
  }
}
