import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="card-elevated p-10 bg-white">
      <h1 class="text-h2 mb-4">Dashboard</h1>
      <p class="text-body-lg text-[#6B6B6B]">Executive overview coming soon.</p>
    </div>
  `
})
export class DashboardComponent {}
