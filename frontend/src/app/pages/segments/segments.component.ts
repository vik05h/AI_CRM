import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmService } from '../../services/crm.service';
import { Segment, SegmentPreviewData } from '../../models/api.model';
import gsap from 'gsap';

@Component({
  selector: 'app-segments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './segments.component.html'
})
export class SegmentsComponent implements OnInit {
  crm = inject(CrmService);
  cdr = inject(ChangeDetectorRef);
  prompt: string = '';
  
  previewingSegmentId: string | null = null;
  previewLoading: boolean = false;
  previewData: Record<string, SegmentPreviewData> = {};

  ngOnInit() {
    this.crm.loadSegments();
  }

  onDiscover() {
    if (!this.prompt.trim()) return;
    this.crm.discoverSegment(this.prompt);
    this.prompt = '';
  }

  togglePreview(segment: Segment) {
    if (this.previewingSegmentId === segment.id) {
      // close it
      gsap.to(`#preview-panel-${segment.id}`, { height: 0, duration: 0.3, ease: 'power2.out', onComplete: () => {
        this.previewingSegmentId = null;
      }});
      return;
    }

    this.previewingSegmentId = segment.id;

    // Fetch if not already fetched
    if (!this.previewData[segment.id]) {
      this.previewLoading = true;
      this.crm.previewSegment(segment.id).subscribe({
        next: (data) => {
          this.previewData[segment.id] = data;
          this.previewLoading = false;
          
          // Force Angular to render the DOM synchronously
          this.cdr.detectChanges();
          
          gsap.to(`#preview-panel-${segment.id}`, { height: 'auto', duration: 0.3, ease: 'power2.out' });
          if (data.customers && data.customers.length > 0) {
            gsap.from(`#preview-panel-${segment.id} .customer-card`, { y: 15, opacity: 0, stagger: 0.04, duration: 0.3, delay: 0.1 });
          }
        },
        error: (err) => {
          console.error(err);
          this.previewLoading = false;
          this.previewingSegmentId = null;
        }
      });
    } else {
      // Just animate in since we already have data
      this.cdr.detectChanges();
      gsap.to(`#preview-panel-${segment.id}`, { height: 'auto', duration: 0.3, ease: 'power2.out' });
      if (this.previewData[segment.id].customers && this.previewData[segment.id].customers.length > 0) {
        gsap.from(`#preview-panel-${segment.id} .customer-card`, { y: 15, opacity: 0, stagger: 0.04, duration: 0.3, delay: 0.1 });
      }
    }
  }
}

