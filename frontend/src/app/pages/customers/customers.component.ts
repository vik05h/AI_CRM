import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../services/crm.service';
import gsap from 'gsap';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit, AfterViewInit {
  crm = inject(CrmService);

  ngOnInit() {
    this.crm.loadCustomers(0, 100);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const textLines = document.querySelectorAll('app-customers .textflow-line');
      if (textLines.length > 0) {
        gsap.fromTo(textLines, 
          { y: '100%' }, 
          { y: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.1 }
        );
      }
    }, 100);
  }
}
