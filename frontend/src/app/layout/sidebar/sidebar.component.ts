import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 h-screen bg-[#F3F2EF] border-r border-[#E7E7E4] flex flex-col fixed left-0 top-0">
      <!-- Brand -->
      <div class="h-20 flex items-center px-8 border-b border-[#E7E7E4]">
        <div class="font-bold text-xl tracking-tighter text-[#111111]">AURALIS</div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-8 px-4 flex flex-col gap-2">
        <div class="text-label-caps text-[#6B6B6B] px-4 mb-2">Menu</div>
        
        <a routerLink="/dashboard" routerLinkActive="!bg-[#FCFCFB] !text-[#111111] shadow-sm border border-[#E7E7E4]" class="flex items-center px-4 py-3 rounded-lg text-[#6B6B6B] font-medium transition-all duration-200 hover:bg-white/60 hover:text-[#111111] border border-transparent">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Overview
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

      <!-- User Profile (Mock) -->
      <div class="p-4 border-t border-[#E7E7E4]">
        <div class="flex items-center px-4 py-3 rounded-lg hover:bg-white/50 cursor-pointer transition-colors">
          <div class="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold mr-3">
            M
          </div>
          <div class="flex-1 overflow-hidden">
            <div class="text-sm font-semibold text-[#111111] truncate">Marketer</div>
            <div class="text-xs text-[#6B6B6B] truncate">marketer&#64;xeno.com</div>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {}
