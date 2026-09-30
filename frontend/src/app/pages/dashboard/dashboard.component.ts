import { Component, OnInit, OnDestroy, inject, AfterViewInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import gsap from 'gsap';
import { NumberCounterDirective } from '../../shared/directives/number-counter.directive';
import { TextSplitRevealDirective } from '../../shared/directives/text-split-reveal.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';
import { ScrollHintDirective } from '../../shared/directives/scroll-hint.directive';
import { NanoBananaBootComponent } from '../../shared/components/nano-banana-boot/nano-banana-boot.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NumberCounterDirective, 
    TextSplitRevealDirective, 
    MagneticDirective, 
    ScrollHintDirective,
    NanoBananaBootComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  crm = inject(CrmService);
  @ViewChildren('kpiCard') kpiCards!: QueryList<ElementRef>;

  @ViewChild('campaignsModal') campaignsModal!: ElementRef;
  @ViewChild('campaignsOverlay') campaignsOverlay!: ElementRef;
  @ViewChild('campaignsContent') campaignsContent!: ElementRef;

  @ViewChild('graphModal') graphModal!: ElementRef;
  @ViewChild('graphOverlay') graphOverlay!: ElementRef;
  @ViewChild('graphContent') graphContent!: ElementRef;

  get trends() {
    const summary = this.crm.analyticsSummary();
    if (!summary) return { customers: 0, conversion: 0, orders: 0 };
    
    let conversionTrend = 0;
    const campaigns = this.crm.campaigns().filter(c => c.sent_count > 0);
    
    if (campaigns.length >= 2) {
      const latest = campaigns[0];
      const older = campaigns.slice(1);
      
      const latestRate = (latest.converted_count / latest.sent_count) * 100;
      const olderSent = older.reduce((acc, c) => acc + c.sent_count, 0);
      const olderConv = older.reduce((acc, c) => acc + c.converted_count, 0);
      const olderRate = olderSent > 0 ? (olderConv / olderSent) * 100 : 0;
      
      conversionTrend = Number((latestRate - olderRate).toFixed(1));
    } else if (campaigns.length === 1) {
      const latestRate = (campaigns[0].converted_count / campaigns[0].sent_count) * 100;
      conversionTrend = Number(latestRate.toFixed(1));
    }

    return {
      customers: 0,
      conversion: conversionTrend,
      orders: 0
    };
  }

  get conversionGraphPoints(): { points: string, dots: any[] } {
    const campaigns = this.crm.campaigns().filter(c => c.sent_count > 0).slice(0, 6).reverse(); // up to 6 most recent, reversed to chronological
    if (campaigns.length === 0) return { points: "0,90 100,90", dots: [] };
    
    const rates = campaigns.map(c => (c.converted_count / c.sent_count) * 100);
    const maxRate = Math.max(...rates, 10); // cap minimum max at 10%
    
    const stepX = campaigns.length > 1 ? 100 / (campaigns.length - 1) : 50;
    
    let pointsString = "";
    let dots: any[] = [];

    campaigns.forEach((camp, index) => {
      const x = campaigns.length > 1 ? index * stepX : 50;
      const y = 90 - (rates[index] / maxRate) * 80; 
      
      pointsString += `${x},${y} `;
      
      dots.push({
        x: x,
        y: y,
        rate: rates[index].toFixed(1),
        name: camp.name
      });
    });

    return { points: pointsString.trim(), dots };
  }

  get conversionRate(): number {
    const summary = this.crm.analyticsSummary();
    if (!summary || summary.campaigns_sent === 0) return 0;
    return Number(((summary.campaigns_converted / summary.campaigns_sent) * 100).toFixed(1));
  }

  ngOnInit() {
    this.crm.loadInitialData();
  }

  manualRetry() {
    this.crm.loadInitialData();
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

  openCampaignsModal() {
    gsap.set(this.campaignsModal.nativeElement, { pointerEvents: 'auto' });
    gsap.to(this.campaignsOverlay.nativeElement, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(this.campaignsContent.nativeElement, 
      { scale: 0.95, y: 20, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
    );
  }

  closeCampaignsModal() {
    gsap.set(this.campaignsModal.nativeElement, { pointerEvents: 'none' });
    gsap.to(this.campaignsOverlay.nativeElement, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(this.campaignsContent.nativeElement, { scale: 0.95, y: 10, opacity: 0, duration: 0.3, ease: 'power2.in' });
  }

  openGraphModal() {
    gsap.set(this.graphModal.nativeElement, { pointerEvents: 'auto' });
    gsap.to(this.graphOverlay.nativeElement, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(this.graphContent.nativeElement, 
      { scale: 0.95, y: 20, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
    );
  }

  closeGraphModal() {
    gsap.set(this.graphModal.nativeElement, { pointerEvents: 'none' });
    gsap.to(this.graphOverlay.nativeElement, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(this.graphContent.nativeElement, { scale: 0.95, y: 10, opacity: 0, duration: 0.3, ease: 'power2.in' });
  }
}
