import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NanoBananaBootComponent
 *
 * Professional, clean cloud infrastructure status component
 * adhering to the Engineered Night & Dark Glassmorphism design system.
 */
@Component({
  selector: 'app-nano-banana-boot',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'block w-full',
    'role': 'status',
    '[attr.aria-live]': '"polite"',
  },
  template: `
    <div class="card-elevated relative overflow-hidden rounded-[24px] p-6 md:p-8 backdrop-blur-2xl border border-white/10 shadow-2xl">
      
      <!-- Subtle Ambient Lighting -->
      <div class="absolute -top-32 left-1/3 w-80 h-32 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full"></div>
      
      <div class="flex flex-col lg:flex-row items-center gap-8 relative z-10">
        
        <!-- Clean Vector Server Rack Illustration -->
        <div class="w-full max-w-[340px] md:max-w-[400px] shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/40 p-2">
          <img 
            src="/nano-banana-booting.svg" 
            alt="Cloud Infrastructure Initializing"
            class="w-full h-auto block select-none"
            loading="eager"
          />
        </div>

        <!-- Infrastructure Status & Diagnostics -->
        <div class="flex-1 flex flex-col justify-center text-center lg:text-left">
          
          <!-- Status Pill -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-label-caps self-center lg:self-start mb-3 bg-white/5 border border-white/10 text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#86efac] animate-pulse"></span>
            {{ badgeText() }}
          </div>

          <h3 class="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white mb-2">
            {{ titleText() }}
          </h3>

          <p class="text-body-md text-gray-400 mb-6 max-w-xl">
            {{ descriptionText() }}
          </p>

          <!-- Status Bar -->
          <div class="panel-recessed p-4 rounded-xl mb-6 text-xs md:text-sm text-gray-400 space-y-2 border border-white/5">
            <div class="flex items-center justify-between">
              <span class="text-gray-300 font-medium flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#86efac]"></span>
                Render Free Instance Spin-Up
              </span>
              <span class="font-mono text-xs text-gray-400">{{ elapsedSeconds() }}s elapsed</span>
            </div>
            
            <p class="text-[12px] text-gray-500 leading-normal text-left">
              Render instances spin down after inactivity. Waking the container typically takes 30–50s.
            </p>

            @if (errorMessage()) {
              <div class="mt-2 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/10 text-left font-mono text-[11px] leading-relaxed break-all">
                Notice: {{ errorMessage() }}
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button 
              type="button"
              (click)="onRetryClick()"
              class="btn-primary flex items-center gap-2 text-sm font-semibold">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Status
            </button>
            
            <a 
              href="https://crm-backend-15tu.onrender.com/analytics/summary" 
              target="_blank" 
              rel="noopener noreferrer"
              class="btn-secondary flex items-center gap-1.5 text-sm font-medium">
              <span>Test API Link</span>
              <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>

        </div>

      </div>

    </div>
  `
})
export class NanoBananaBootComponent {
  isBooting = input<boolean>(true);
  statusMessage = input<string>('Initializing Cloud Cluster...');
  errorMessage = input<string | null>(null);
  elapsedSeconds = input<number>(0);

  retry = output<void>();

  badgeText = computed(() => {
    return 'Cloud Infrastructure';
  });

  titleText = computed(() => {
    return 'Connecting to CRM Backend';
  });

  descriptionText = computed(() => {
    return 'Establishing secure connection to the FastAPI worker nodes and PostgreSQL database on Render.';
  });

  onRetryClick() {
    this.retry.emit();
  }
}
