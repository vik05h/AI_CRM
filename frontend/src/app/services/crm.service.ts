import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Customer, Order } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private http = inject(HttpClient);
  
  // State
  private customersState = signal<Customer[]>([]);
  private ordersState = signal<Order[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Computed Selectors
  readonly customers = computed(() => this.customersState());
  readonly orders = computed(() => this.ordersState());
  readonly loading = computed(() => this.loadingState());
  readonly error = computed(() => this.errorState());

  /**
   * Loads customers from the API
   */
  loadCustomers(skip: number = 0, limit: number = 100) {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    this.http.get<Customer[]>(`${environment.apiUrl}/customers?skip=${skip}&limit=${limit}`)
      .subscribe({
        next: (data) => {
          this.customersState.set(data);
          this.loadingState.set(false);
        },
        error: (err) => {
          console.error('Failed to load customers', err);
          this.errorState.set('Failed to load customers.');
          this.loadingState.set(false);
        }
      });
  }

  /**
   * Loads orders from the API
   */
  loadOrders(skip: number = 0, limit: number = 100) {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    this.http.get<Order[]>(`${environment.apiUrl}/orders?skip=${skip}&limit=${limit}`)
      .subscribe({
        next: (data) => {
          this.ordersState.set(data);
          this.loadingState.set(false);
        },
        error: (err) => {
          console.error('Failed to load orders', err);
          this.errorState.set('Failed to load orders.');
          this.loadingState.set(false);
        }
      });
  }
}
