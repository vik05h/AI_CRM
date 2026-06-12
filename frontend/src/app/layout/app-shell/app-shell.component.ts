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
      <app-sidebar></app-sidebar>
      
      <!-- Main Content Area -->
      <main class="md:ml-64 ml-0 min-h-screen flex flex-col transition-all">
        <!-- Top Header -->
        <header class="h-20 bg-[#F7F7F5] border-b border-[#E7E7E4] flex items-center px-8 sticky top-0 z-10">
          <div class="flex-1">
            <h2 class="text-[18px] font-semibold text-[#1c1b1b]">{{ pageTitle }}</h2>
          </div>
          <div class="flex gap-3">
            <button class="w-10 h-10 rounded-full bg-white border border-[#E7E7E4] flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 p-8 overflow-x-hidden" id="main-content">
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
      
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        return;
      }
      gsap.fromTo('#main-content', 
        { x: 20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    });
  }
}
