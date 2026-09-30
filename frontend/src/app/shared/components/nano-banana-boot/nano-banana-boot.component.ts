import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NanoBananaBootComponent
 *
 * Displays a lightweight, animated Nano Banana SVG illustration
 * showing the backend booting / spinning up state on Render.
 * Follows modern Angular standalone & signals guidelines.
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
    <div class="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0b0f19]/90 to-[#111827]/90 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.12)]">
      
      <!-- Top Glow Accent -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full"></div>
      
      <div class="flex flex-col lg:flex-row items-center gap-8 relative z-10">
        
        <!-- Animated Nano Banana SVG Graphic -->
        <div class="w-full max-w-[360px] md:max-w-[420px] shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#090d16]/80 p-2">
          <img 
            src="/nano-banana-booting.svg" 
            alt="Nano Banana powering up the backend server"
            class="w-full h-auto block select-none"
            loading="eager"
          />
        </div>

        <!-- Boot Status Details & Action -->
        <div class="flex-1 flex flex-col justify-center text-center lg:text-left">
          
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider self-center lg:self-start mb-3 border"
               [class.bg-cyan-950]="!errorMessage()"
               [class.text-cyan-300]="!errorMessage()"
               [class.border-cyan-500]="!errorMessage()"
               [class.bg-amber-950]="!!errorMessage()"
               [class.text-amber-300]="!!errorMessage()"
               [class.border-amber-500]="!!errorMessage()">
            <span class="w-2 h-2 rounded-full animate-ping"
                  [class.bg-cyan-400]="!errorMessage()"
                  [class.bg-amber-400]="!!errorMessage()"></span>
            {{ badgeText() }}
          </div>

          <h3 class="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            {{ titleText() }}
          </h3>

          <p class="text-sm md:text-base text-gray-300 mb-4 max-w-xl">
            {{ descriptionText() }}
          </p>

          <!-- Render Spin-up Notice & Tips -->
          <div class="panel-recessed p-4 rounded-xl mb-6 text-xs md:text-sm text-gray-400 space-y-2 border border-white/5">
            <div class="flex items-center gap-2 text-cyan-300 font-medium">
              <svg class="w-4 h-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Elapsed: {{ elapsedSeconds() }}s (Render free instances typically wake up in ~50s)</span>
            </div>
            
            @if (errorMessage()) {
              <div class="mt-2 text-amber-200 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/50 text-left font-mono text-[11px] leading-relaxed break-all">
                ⚠️ {{ errorMessage() }}
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button 
              type="button"
              (click)="onRetryClick()"
              class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Check Backend Status
            </button>
            
            <a 
              href="https://crm-backend-15tu.onrender.com/health" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-1.5">
              <span>Inspect /health Endpoint</span>
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
  statusMessage = input<string>('Booting Render backend container...');
  errorMessage = input<string | null>(null);
  elapsedSeconds = input<number>(0);

  retry = output<void>();

  badgeText = computed(() => {
    if (this.errorMessage()) return 'Booting with Diagnostic Notice';
    return 'Nano Banana Server Boot';
  });

  titleText = computed(() => {
    if (this.errorMessage()) return 'Waking Up Backend & Connecting Database';
    return 'Waking Up Your Render Backend';
  });

  descriptionText = computed(() => {
    if (this.errorMessage()) {
      return 'The backend service is initializing. If your Render or Supabase database was asleep, Nano Banana is reconnecting the power lines now.';
    }
    return 'Render free tier instances sleep after inactivity. Nano Banana is currently powering on the server and warming up database connections.';
  });

  onRetryClick() {
    this.retry.emit();
  }
}
