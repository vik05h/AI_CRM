import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../services/crm.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-[1280px] mx-auto py-8 px-4 md:px-8 font-inter text-[#1c1b1b]">
      <header class="mb-12">
        <h1 class="text-h1 mb-2">Analytics</h1>
        <p class="text-body-lg text-[#6b6b6b]">Track campaign delivery and performance.</p>
      </header>

      @if (crm.loading() && !crm.campaigns().length) {
        <div class="animate-pulse flex space-x-4">
          <div class="w-8 h-8 rounded-full bg-[#e7e7e4]"></div>
          <p class="text-[#6b6b6b]">Loading analytics...</p>
        </div>
      } @else {
        <div class="space-y-8">
          @for (campaign of crm.campaigns(); track campaign.id) {
            <div class="card-elevated p-6 md:p-8">
              <div class="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <div>
                  <h3 class="text-h3 mb-2">{{ campaign.name }}</h3>
                  <p class="text-body-md text-[#6b6b6b]">
                    Goal: {{ campaign.goal }} • Channel: {{ campaign.channel }}
                  </p>
                </div>
                <div class="mt-4 md:mt-0">
                  <span [ngClass]="{
                    'bg-[#e8f5e9] text-[#2e7d32]': campaign.status === 'completed',
                    'bg-[#fff3e0] text-[#ef6c00]': campaign.status === 'sending',
                    'bg-[#f3f2ef] text-[#1c1b1b]': campaign.status === 'approved' || campaign.status === 'draft'
                  }" class="text-label-caps px-3 py-1 rounded-full">
                    {{ campaign.status }}
                  </span>
                </div>
              </div>

              <!-- Funnel / Stats -->
              @if (campaign.status === 'completed' || campaign.status === 'sending') {
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="panel-recessed p-4">
                    <p class="text-label-caps text-[#6b6b6b] mb-1">Delivered</p>
                    <p class="text-[24px] font-semibold">{{ campaign.sent_count }}</p>
                  </div>
                  <div class="panel-recessed p-4">
                    <p class="text-label-caps text-[#6b6b6b] mb-1">Converted</p>
                    <p class="text-[24px] font-semibold">{{ campaign.converted_count }}</p>
                  </div>
                  <div class="panel-recessed p-4">
                    <p class="text-label-caps text-[#6b6b6b] mb-1">Conversion Rate</p>
                    <p class="text-[24px] font-semibold">
                      {{ campaign.sent_count > 0 ? ((campaign.converted_count / campaign.sent_count) * 100).toFixed(1) : 0 }}%
                    </p>
                  </div>
                </div>
              }
            </div>
          } @empty {
            <div class="text-center py-12 border border-[#e7e7e4] border-dashed rounded-[24px]">
              <p class="text-[#6b6b6b]">No campaigns available for analytics.</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  crm = inject(CrmService);

  ngOnInit() {
    this.crm.startPollingCampaigns();
  }

  ngOnDestroy() {
    this.crm.stopPollingCampaigns();
  }
}
