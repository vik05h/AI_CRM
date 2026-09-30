import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Customer, Order, Segment, SegmentPreviewData, Campaign, CampaignDraftResponse, CampaignCreate, AnalyticsSummary } from '../models/api.model';
import { catchError, finalize } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  // State
  private _customers = signal<Customer[]>([]);
  private _orders = signal<Order[]>([]);
  private _segments = signal<Segment[]>([]);
  private _campaigns = signal<Campaign[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _analyticsSummary = signal<AnalyticsSummary | null>(null);
  
  // Backend Boot / Health State
  private _backendStatus = signal<'checking' | 'booting' | 'online' | 'error'>('checking');
  private _bootElapsedSeconds = signal<number>(0);
  private _bootError = signal<string | null>(null);
  
  private pollingSub: Subscription | null = null;
  private bootTimerSub: Subscription | null = null;
  private healthPollSub: Subscription | null = null;

  // Computed Selectors
  readonly customers = computed(() => this._customers());
  readonly orders = computed(() => this._orders());
  readonly segments = computed(() => this._segments());
  readonly campaigns = computed(() => this._campaigns());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly analyticsSummary = computed(() => this._analyticsSummary());
  readonly backendStatus = computed(() => this._backendStatus());
  readonly bootElapsedSeconds = computed(() => this._bootElapsedSeconds());
  readonly bootError = computed(() => this._bootError());

  /**
   * Loads initial dashboard and business data directly
   */
  loadInitialData() {
    this._loading.set(true);
    this.loadAnalytics();
    this.loadCustomers(0, 5);
    this.loadOrders(0, 5);
    this.loadCampaigns();
    this.startPollingCampaigns();
  }

  /**
   * Health check with auto-recovery for Render cold starts
   */
  checkBackendHealth(autoLoadData: boolean = true) {
    this.http.get<AnalyticsSummary>(`${this.apiUrl}/analytics/summary`).subscribe({
      next: (data) => {
        this._analyticsSummary.set(data);
        this._backendStatus.set('online');
        this._bootError.set(null);
        this._loading.set(false);
        this.stopBootTimer();
        if (autoLoadData) {
          this.loadInitialData();
        }
      },
      error: (err) => {
        // Cold start or network connection wait
        if (err.status === 0 || err.status >= 500) {
          this._backendStatus.set('booting');
          this.startBootTimer();
          this._bootError.set('Render free instance is spinning up. Waking container...');
          this.scheduleNextHealthCheck();
        }
      }
    });
  }

  private startBootTimer() {
    if (!this.bootTimerSub) {
      this.bootTimerSub = interval(1000).subscribe(() => {
        this._bootElapsedSeconds.update(s => s + 1);
      });
    }
  }

  private stopBootTimer() {
    if (this.bootTimerSub) {
      this.bootTimerSub.unsubscribe();
      this.bootTimerSub = null;
    }
  }

  private scheduleNextHealthCheck() {
    if (this.healthPollSub) {
      this.healthPollSub.unsubscribe();
    }
    // Poll every 4 seconds until the service is active
    this.healthPollSub = interval(4000).subscribe(() => {
      this.http.get<AnalyticsSummary>(`${this.apiUrl}/analytics/summary`).subscribe({
        next: (data) => {
          this._analyticsSummary.set(data);
          this._backendStatus.set('online');
          this._bootError.set(null);
          this._loading.set(false);
          this.stopBootTimer();
          if (this.healthPollSub) {
            this.healthPollSub.unsubscribe();
            this.healthPollSub = null;
          }
          this.loadInitialData();
        },
        error: () => {
          // Still waiting for spin-up
        }
      });
    });
  }

  /**
   * Loads analytics summary from the API
   */
  loadAnalytics() {
    this.http.get<AnalyticsSummary>(`${this.apiUrl}/analytics/summary`)
      .subscribe({
        next: (data) => {
          this._analyticsSummary.set(data);
          this._backendStatus.set('online');
          this._bootError.set(null);
          this._loading.set(false);
          this.stopBootTimer();
        },
        error: (err) => {
          console.error('Failed to load analytics summary', err);
          if (err.status === 0 || err.status >= 500) {
            this._backendStatus.set('booting');
            this.startBootTimer();
            this.scheduleNextHealthCheck();
          }
        }
      });
  }

  /**
   * Loads customers from the API
   */
  loadCustomers(skip: number = 0, limit: number = 100) {
    this.http.get<Customer[]>(`${this.apiUrl}/customers?skip=${skip}&limit=${limit}`)
      .subscribe({
        next: (data) => {
          this._customers.set(data);
          this._loading.set(false);
          this._backendStatus.set('online');
        },
        error: (err) => {
          console.error('Failed to load customers', err);
          if (err.status === 0 || err.status >= 500) {
            this._backendStatus.set('booting');
            this.startBootTimer();
            this.scheduleNextHealthCheck();
          } else {
            this._error.set('Failed to load customers.');
          }
          this._loading.set(false);
        }
      });
  }

  /**
   * Loads orders from the API
   */
  loadOrders(skip: number = 0, limit: number = 100) {
    this.http.get<Order[]>(`${this.apiUrl}/orders?skip=${skip}&limit=${limit}`)
      .subscribe({
        next: (data) => {
          this._orders.set(data);
          this._loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load orders', err);
        }
      });
  }

  /**
   * Loads discovered segments
   */
  loadSegments() {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<Segment[]>(`${this.apiUrl}/segments`)
      .subscribe({
        next: (data) => {
          this._segments.set(data);
          this._loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load segments', err);
          this._error.set('Failed to load segments.');
          this._loading.set(false);
        }
      });
  }

  /**
   * Discovers a new segment via AI Mock Service
   */
  discoverSegment(criteria: string) {
    this._loading.set(true);
    this._error.set(null);

    this.http.post<Segment>(`${this.apiUrl}/ai/segment`, { criteria })
      .subscribe({
        next: (newSegment) => {
          this._segments.update(segments => [newSegment, ...segments]);
          this._loading.set(false);
        },
        error: (err) => {
          console.error('Failed to discover segment', err);
          this._error.set('Failed to discover segment.');
          this._loading.set(false);
        }
      });
  }

  /**
   * Previews a segment by running its SQL
   */
  previewSegment(segmentId: string) {
    return this.http.get<SegmentPreviewData>(`${environment.apiUrl}/segments/${segmentId}/preview`);
  }

  loadCampaigns(skip: number = 0, limit: number = 100) {
    this.http.get<Campaign[]>(`${this.apiUrl}/campaigns?skip=${skip}&limit=${limit}`).pipe(
      catchError(err => {
        throw err;
      }),
      finalize(() => this._loading.set(false))
    ).subscribe({
      next: (data) => this._campaigns.set(data),
      error: () => {}
    });
  }

  draftCampaign(segmentId: string, goal: string) {
    return this.http.post<CampaignDraftResponse>(`${this.apiUrl}/ai/draft_campaign`, {
      segment_id: segmentId,
      goal: goal
    });
  }

  createCampaign(campaign: CampaignCreate) {
    return this.http.post<Campaign>(`${this.apiUrl}/campaigns`, campaign);
  }

  deleteSegment(id: string) {
    this.http.delete(`${this.apiUrl}/segments/${id}`).subscribe({
      next: () => {
        this._segments.update(segments => segments.filter(s => s.id !== id));
      },
      error: (err) => console.error('Failed to delete segment', err)
    });
  }

  deleteCampaign(id: string) {
    this.http.delete(`${this.apiUrl}/campaigns/${id}`).subscribe({
      next: () => {
        this._campaigns.update(campaigns => campaigns.filter(c => c.id !== id));
      },
      error: (err) => console.error('Failed to delete campaign', err)
    });
  }
  
  startPollingCampaigns() {
    if (!this.pollingSub) {
      // Poll every 5 seconds
      this.pollingSub = interval(5000).subscribe(() => {
        this.loadCampaigns();
        this.loadAnalytics();
      });
    }
  }
  
  stopPollingCampaigns() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = null;
    }
    if (this.healthPollSub) {
      this.healthPollSub.unsubscribe();
      this.healthPollSub = null;
    }
    this.stopBootTimer();
  }
}
