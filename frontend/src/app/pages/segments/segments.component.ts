import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Segment, SegmentPreviewData } from '../../models/api.model';
import gsap from 'gsap';
import { TextSplitRevealDirective } from '../../shared/directives/text-split-reveal.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

@Component({
  selector: 'app-segments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TextSplitRevealDirective, MagneticDirective],
  templateUrl: './segments.component.html'
})
export class SegmentsComponent implements OnInit {
  crm = inject(CrmService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  prompt: string = '';
  
  previewingSegmentId: string | null = null;
  previewLoading: boolean = false;
  previewData: Record<string, SegmentPreviewData> = {};

  @ViewChild('confirmModal') confirmModal!: ElementRef;
  @ViewChild('confirmModalOverlay') confirmModalOverlay!: ElementRef;
  @ViewChild('modalContent') modalContent!: ElementRef;
  segmentToDelete: string | null = null;

  columns = 3;

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) this.columns = 3; // lg
    else if (window.innerWidth >= 768) this.columns = 2; // md
    else this.columns = 1; // sm
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const textLines = document.querySelectorAll('app-segments .textflow-line');
      if (textLines.length > 0) {
        gsap.fromTo(textLines, 
          { y: '100%' }, 
          { y: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.1 }
        );
      }
    }, 100);
  }

  ngOnInit() {
    this.onResize();
    this.crm.loadSegments();
  }

  onDiscover() {
    if (!this.prompt.trim()) return;
    this.crm.discoverSegment(this.prompt);
    this.prompt = '';
  }

  /**
   * Navigate to the Campaign Builder with the selected segment pre-filled.
   * Uses query params so CampaignsComponent can read and prefill the dropdown.
   */
  createCampaignFor(segment: Segment) {
    this.router.navigate(['/campaigns'], { queryParams: { segmentId: segment.id } });
  }

  isRowExpanded(index: number): boolean {
    if (!this.previewingSegmentId) return false;
    const segments = this.crm.segments();
    const expandedIndex = segments.findIndex(s => s.id === this.previewingSegmentId);
    if (expandedIndex === -1) return false;
    
    const rowStart = Math.floor(expandedIndex / this.columns) * this.columns;
    const rowEnd = rowStart + this.columns - 1;
    
    return expandedIndex >= rowStart && expandedIndex <= rowEnd && index >= rowStart && index <= rowEnd;
  }

  getPreviewSegment(): Segment | undefined {
    return this.crm.segments().find(s => s.id === this.previewingSegmentId);
  }

  togglePreview(segment: Segment) {
    if (this.previewingSegmentId === segment.id) {
      this.closePreview();
      return;
    }

    const previousId = this.previewingSegmentId;
    this.previewingSegmentId = segment.id;
    
    if (!this.previewData[segment.id]) {
      this.previewLoading = true;
      this.crm.previewSegment(segment.id).subscribe({
        next: (data) => {
          this.previewData[segment.id] = data;
          this.previewLoading = false;
          this.cdr.detectChanges();
          this.animatePreviewOpen(previousId !== null);
        },
        error: (err) => {
          console.error(err);
          this.previewLoading = false;
        }
      });
    } else {
      this.cdr.detectChanges();
      this.animatePreviewOpen(previousId !== null);
    }
  }

  animatePreviewOpen(wasAlreadyOpen: boolean) {
    if (wasAlreadyOpen) {
      gsap.fromTo('#full-width-preview', { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      gsap.fromTo('#full-width-preview', 
        { height: 0, opacity: 0 }, 
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
    
    const segId = this.previewingSegmentId;
    if (segId && this.previewData[segId]?.customers?.length) {
       gsap.fromTo('.preview-customer-card', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.3, delay: 0.1 });
    }
  }

  closePreview() {
    gsap.to('#full-width-preview', { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
      this.previewingSegmentId = null;
      this.cdr.detectChanges();
    }});
  }

  createCampaignFromPreview() {
    if (this.previewingSegmentId) {
      const seg = this.crm.segments().find(s => s.id === this.previewingSegmentId);
      if (seg) this.createCampaignFor(seg);
    }
  }

  requestDelete(segmentId: string) {
    this.segmentToDelete = segmentId;
    gsap.set(this.confirmModal.nativeElement, { pointerEvents: 'auto' });
    
    // Animate overlay (blur + bg) smoothly
    gsap.to(this.confirmModalOverlay.nativeElement, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    
    // Animate modal content with a slight delay
    gsap.fromTo(this.modalContent.nativeElement, 
      { scale: 0.95, y: 20, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.05 }
    );
  }
  
  cancelDelete() {
    gsap.set(this.confirmModal.nativeElement, { pointerEvents: 'none' });
    gsap.to(this.confirmModalOverlay.nativeElement, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(this.modalContent.nativeElement, { scale: 0.95, y: 10, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
      this.segmentToDelete = null;
    }});
  }
  
  confirmDelete() {
    if (this.segmentToDelete) {
      this.crm.deleteSegment(this.segmentToDelete);
    }
    this.cancelDelete();
  }
}
