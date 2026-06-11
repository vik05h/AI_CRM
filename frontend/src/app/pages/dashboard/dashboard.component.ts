import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../services/crm.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  crm = inject(CrmService);

  ngOnInit() {
    this.crm.loadCustomers(0, 5);
    this.crm.loadOrders(0, 5);
  }
}
