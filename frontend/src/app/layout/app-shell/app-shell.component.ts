import { Component, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { filter, map, mergeMap } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-transparent">
      
      <!-- Top Navigation Bar -->
      <header class="h-20 bg-black/40 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <!-- Brand -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <!-- Central user silhouette (CRM) -->
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <!-- Sparkle icons (AI) -->
              <path d="M19 2l0.5 1.5L21 4l-1.5 0.5L19 6l-0.5-1.5L17 4l1.5-0.5z" fill="currentColor" stroke="none" />
              <path d="M21 9l0.3 0.9L22.2 10l-0.9 0.3L21 11.2l-0.3-0.9L19.8 10l0.9-0.3z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div class="font-bold text-xl tracking-tighter text-white">AI CRM</div>
        </div>

        <!-- Desktop Links -->
        <nav class="hidden md:flex items-center gap-1 relative">
          <!-- The GSAP animated sliding pill -->
          <div id="nav-slider-pill" class="absolute bottom-0 left-0 h-full bg-white/5 rounded-lg pointer-events-none opacity-0"></div>
          
          <a routerLink="/dashboard" routerLinkActive="active-link text-white font-semibold" class="px-4 py-2 rounded-lg text-gray-400 font-medium transition-colors hover:text-white flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </a>
          <a routerLink="/customers" routerLinkActive="active-link text-white font-semibold" class="px-4 py-2 rounded-lg text-gray-400 font-medium transition-colors hover:text-white flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Customers
          </a>
          <a routerLink="/segments" routerLinkActive="active-link text-white font-semibold" class="px-4 py-2 rounded-lg text-gray-400 font-medium transition-colors hover:text-white flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Segments
          </a>
          <a routerLink="/campaigns" routerLinkActive="active-link text-white font-semibold" class="px-4 py-2 rounded-lg text-gray-400 font-medium transition-colors hover:text-white flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Campaigns
          </a>
          <a routerLink="/analytics" routerLinkActive="active-link text-white font-semibold" class="px-4 py-2 rounded-lg text-gray-400 font-medium transition-colors hover:text-white flex items-center gap-2 z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Analytics
          </a>
        </nav>

        <!-- Right Side: User & Mobile Toggle -->
        <div class="flex items-center gap-4">
          
          @if (auth.currentUser()) {
            <div class="relative">
              <button (click)="showUserMenu = !showUserMenu" class="flex items-center gap-2 focus:outline-none rounded-full ring-2 ring-transparent hover:ring-white/20 transition-all">
                @if (auth.currentUser()?.photoURL) {
                  <img [src]="auth.currentUser()?.photoURL" alt="User Avatar" class="w-9 h-9 rounded-full object-cover">
                } @else {
                  <div class="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {{ auth.currentUser()?.displayName?.charAt(0) || 'U' }}
                  </div>
                }
              </button>
              
              @if (showUserMenu) {
                <div class="absolute right-0 mt-2 w-48 card-elevated rounded-xl shadow-2xl py-1 z-50 overflow-hidden transform origin-top-right transition-all">
                  <div class="px-4 py-3 border-b border-white/10">
                    <p class="text-sm font-semibold text-white truncate">{{ auth.currentUser()?.displayName || 'User' }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ auth.currentUser()?.email }}</p>
                  </div>
                  <button (click)="auth.logout(); showUserMenu = false" class="w-full text-left px-4 py-2 text-sm text-[#ffdad6] hover:bg-white/5 transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#ba1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Log out
                  </button>
                </div>
              }
            </div>
          }

          <button (click)="sidebarOpen = !sidebarOpen" class="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
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
export class AppShellComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private ngZone = inject(NgZone);
  auth = inject(AuthService);
  
  pageTitle = 'Dashboard';
  sidebarOpen = false;
  showUserMenu = false;
  private isFirstLoad = true;
  private mouseMoveListener: (e: MouseEvent) => void;

  constructor() {
    this.mouseMoveListener = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // Calculate subtle inverse shifts from the base percentages (15%, 85%)
      const x1 = 15 + (x * -5);
      const y1 = 50 + (y * -5);
      
      const x2 = 85 + (x * 5);
      const y2 = 30 + (y * 5);

      document.documentElement.style.setProperty('--bg-x1', `${x1}%`);
      document.documentElement.style.setProperty('--bg-y1', `${y1}%`);
      document.documentElement.style.setProperty('--bg-x2', `${x2}%`);
      document.documentElement.style.setProperty('--bg-y2', `${y2}%`);
    };
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.mouseMoveListener);
    });
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
        { x: 100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', clearProps: 'all' }
      );
    });
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.mouseMoveListener);
  }
}
