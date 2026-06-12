import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { filter, map, mergeMap } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-bg-primary">
      
      <!-- Top Navigation Bar -->
      <header class="h-20 bg-white/40 backdrop-blur-2xl border-b border-white/50 sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <!-- Brand -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div class="font-bold text-xl tracking-tighter text-[#111111]">NEXUS AI</div>
        </div>

        <!-- Desktop Links -->
        <nav class="hidden md:flex items-center gap-1 relative">
          <!-- The GSAP animated sliding pill -->
          <div id="nav-slider-pill" class="absolute bottom-0 left-0 h-full bg-black/5 rounded-lg pointer-events-none opacity-0"></div>
          
          <a routerLink="/dashboard" routerLinkActive="active-link text-[#111111] font-semibold" class="px-4 py-2 rounded-lg text-[#6B6B6B] font-medium transition-colors hover:text-[#111111] flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </a>
          <a routerLink="/customers" routerLinkActive="active-link text-[#111111] font-semibold" class="px-4 py-2 rounded-lg text-[#6B6B6B] font-medium transition-colors hover:text-[#111111] flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Customers
          </a>
          <a routerLink="/segments" routerLinkActive="active-link text-[#111111] font-semibold" class="px-4 py-2 rounded-lg text-[#6B6B6B] font-medium transition-colors hover:text-[#111111] flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Segments
          </a>
          <a routerLink="/campaigns" routerLinkActive="active-link text-[#111111] font-semibold" class="px-4 py-2 rounded-lg text-[#6B6B6B] font-medium transition-colors hover:text-[#111111] flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Campaigns
          </a>
          <a routerLink="/analytics" routerLinkActive="active-link text-[#111111] font-semibold" class="px-4 py-2 rounded-lg text-[#6B6B6B] font-medium transition-colors hover:text-[#111111] flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Analytics
          </a>
        </nav>

        <!-- Right Side: User & Mobile Toggle -->
        <div class="flex items-center gap-4">
          <button class="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors shadow-sm hidden md:flex">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          
          <button (click)="sidebarOpen = !sidebarOpen" class="md:hidden text-[#111111] p-2 hover:bg-black/5 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </header>

      <!-- Mobile Sidebar (Reusing the existing sidebar component logic) -->
      <app-sidebar [isOpen]="sidebarOpen" (closeSidebar)="sidebarOpen = false"></app-sidebar>
      
      <!-- Main Content Area -->
      <main class="min-h-[calc(100vh-80px)] flex flex-col transition-all">
        <!-- Page Content -->
        <div class="flex-1 p-4 md:p-8 overflow-x-hidden container-max w-full" id="main-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AppShellComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  
  pageTitle = 'Dashboard';
  sidebarOpen = false;
  private isFirstLoad = true;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.pageTitle = data['title'] || '';
      
      // Animate the navbar slider pill
      setTimeout(() => {
        const activeLink = document.querySelector('.active-link') as HTMLElement;
        const pill = document.querySelector('#nav-slider-pill') as HTMLElement;
        if (activeLink && pill) {
          gsap.to(pill, {
            x: activeLink.offsetLeft,
            width: activeLink.offsetWidth,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.5)'
          });
        }
      }, 50);

      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        return;
      }
      
      // Page Transition Slider Animation
      gsap.fromTo('#main-content', 
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    });
  }
}
