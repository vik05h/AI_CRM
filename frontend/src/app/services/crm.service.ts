import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Customer, Order, Segment, SegmentPreviewData } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private http = inject(HttpClient);
  
  // State
  private customersState = signal<Customer[]>([]);
  private ordersState = signal<Order[]>([]);
  private segmentsState = signal<Segment[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Computed Selectors
  readonly customers = computed(() => this.customersState());
  readonly orders = computed(() => this.ordersState());
  readonly segments = computed(() => this.segmentsState());
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

  /**
   * Loads discovered segments
   */
  loadSegments() {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    this.http.get<Segment[]>(`${environment.apiUrl}/segments`)
      .subscribe({
        next: (data) => {
          this.segmentsState.set(data);
          this.loadingState.set(false);
        },
        error: (err) => {
          console.error('Failed to load segments', err);
          this.errorState.set('Failed to load segments.');
          this.loadingState.set(false);
        }
      });
  }

  /**
   * Discovers a new segment via AI Mock Service
   */
  discoverSegment(criteria: string) {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.http.post<Segment>(`${environment.apiUrl}/ai/segment`, { criteria })
      .subscribe({
        next: (newSegment) => {
          // Add the newly discovered segment to the state
          this.segmentsState.update(segments => [newSegment, ...segments]);
          this.loadingState.set(false);
        },
        error: (err) => {
          console.error('Failed to discover segment', err);
          this.errorState.set('Failed to discover segment.');
          this.loadingState.set(false);
        }
      });
  }

  /**
   * Previews a segment by running its SQL
   */
  previewSegment(segmentId: string) {
    return this.http.get<SegmentPreviewData>(`${environment.apiUrl}/segments/${segmentId}/preview`);
  }
}
