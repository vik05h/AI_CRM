import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../services/crm.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  crm = inject(CrmService);

  ngOnInit() {
    this.crm.loadCustomers(0, 100);
  }
}
