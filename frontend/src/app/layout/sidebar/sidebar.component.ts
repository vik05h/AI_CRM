import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 h-screen bg-[#F3F2EF] border-r border-[#E7E7E4] flex-col fixed left-0 top-0 hidden md:flex z-50">
      <!-- Brand -->
      <div class="h-20 flex items-center px-8 border-b border-[#E7E7E4]">
        <div class="font-bold text-xl tracking-tighter text-[#111111]">AI CRM</div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-8 px-4 flex flex-col gap-2">
        <div class="text-label-caps text-[#6B6B6B] px-4 mb-2">Menu</div>
        
        <a routerLink="/dashboard" routerLinkActive="!bg-[#FCFCFB] !text-[#111111] shadow-sm border border-[#E7E7E4]" class="flex items-center px-4 py-3 rounded-lg text-[#6B6B6B] font-medium transition-all duration-200 hover:bg-white/60 hover:text-[#111111] border border-transparent">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Overview
        </a>

        <a routerLink="/customers" routerLinkActive="!bg-[#FCFCFB] !text-[#111111] shadow-sm border border-[#E7E7E4]" class="flex items-center px-4 py-3 rounded-lg text-[#6B6B6B] font-medium transition-all duration-200 hover:bg-white/60 hover:text-[#111111] border border-transparent">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Customers
        </a>
        
        <a routerLink="/segments" routerLinkActive="!bg-[#FCFCFB] !text-[#111111] shadow-sm border border-[#E7E7E4]" class="flex items-center px-4 py-3 rounded-lg text-[#6B6B6B] font-medium transition-all duration-200 hover:bg-white/60 hover:text-[#111111] border border-transparent">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Segments
        </a>
        
        <a routerLink="/campaigns" routerLinkActive="!bg-[#FCFCFB] !text-[#111111] shadow-sm border border-[#E7E7E4]" class="flex items-center px-4 py-3 rounded-lg text-[#6B6B6B] font-medium transition-all duration-200 hover:bg-white/60 hover:text-[#111111] border border-transparent">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          Campaigns
        </a>

        <a routerLink="/analytics" routerLinkActive="!bg-[#FCFCFB] !text-[#111111] shadow-sm border border-[#E7E7E4]" class="flex items-center px-4 py-3 rounded-lg text-[#6B6B6B] font-medium transition-all duration-200 hover:bg-white/60 hover:text-[#111111] border border-transparent">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Analytics
        </a>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-[#E7E7E4]">
        @if (auth.currentUser(); as user) {
          <div class="flex items-center px-4 py-3 rounded-lg hover:bg-white/50 transition-colors mb-2">
            @if (user.photoURL) {
              <img [src]="user.photoURL" class="w-8 h-8 rounded-full mr-3" alt="Profile">
            } @else {
              <div class="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold mr-3">
                {{ user.displayName?.charAt(0) || user.email?.charAt(0) | uppercase }}
              </div>
            }
            <div class="flex-1 overflow-hidden">
              <div class="text-sm font-semibold text-[#111111] truncate">{{ user.displayName || 'Marketer' }}</div>
              <div class="text-xs text-[#6B6B6B] truncate">{{ user.email }}</div>
            </div>
          </div>
          <button (click)="auth.logout()" class="w-full text-left px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors rounded-lg hover:bg-white/60 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Log out
          </button>
        }
      </div>
    </aside>
  `
})
export class SidebarComponent {
  public auth = inject(AuthService);
}
