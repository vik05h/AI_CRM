import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { CampaignCreate, CampaignDraftResponse } from '../../models/api.model';
import gsap from 'gsap';
import { TextSplitRevealDirective } from '../../shared/directives/text-split-reveal.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, TextSplitRevealDirective, MagneticDirective],
  templateUrl: './campaigns.component.html'
})
export class CampaignsComponent implements OnInit {
  crm = inject(CrmService);
  cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);
  
  @ViewChild('step1Container') step1Container!: ElementRef;
  @ViewChild('step2Container') step2Container!: ElementRef;
  @ViewChild('campaignNameInput') campaignNameInput!: ElementRef;
  @ViewChild('campaignNameLabel') campaignNameLabel!: ElementRef;
  @ViewChild('confirmModal') confirmModal!: ElementRef;
  @ViewChild('confirmModalOverlay') confirmModalOverlay!: ElementRef;
  @ViewChild('modalContent') modalContent!: ElementRef;

  step: number = 1;
  drafting: boolean = false;
  creating: boolean = false;
  successToast: string | null = null;
  
  private typingAnim: gsap.core.Tween | null = null;
  private labelAnim: gsap.core.Tween | null = null;

  // Form State
  campaignName: string = '';
  selectedSegmentId: string = '';
  goal: string = '';
  
  // Step 2 State
  draftSubject: string | null = null;
  draftBody: string = '';
  selectedChannel: string = 'Email';
  channels: string[] = ['Email', 'SMS', 'WhatsApp', 'RCS'];

  campaignToDelete: string | null = null;

  ngOnInit() {
    this.crm.loadSegments();
    this.crm.loadCampaigns();
    
    // Pre-select segment if provided in URL
    this.route.queryParams.subscribe(params => {
      if (params['segmentId']) {
        this.selectedSegmentId = params['segmentId'];
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const textLines = document.querySelectorAll('app-campaigns .textflow-line');
      if (textLines.length > 0) {
        gsap.fromTo(textLines, 
          { y: '100%' }, 
          { y: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.1 }
        );
      }
    }, 100);
  }

  get selectedSegmentName(): string {
    const segment = this.crm.segments().find(s => s.id === this.selectedSegmentId);
    return segment ? segment.name : '';
  }

  onTyping() {
    if (this.typingAnim) this.typingAnim.kill();
    if (this.labelAnim) this.labelAnim.kill();
    
    this.typingAnim = gsap.fromTo(this.campaignNameInput.nativeElement,
      { borderColor: 'rgba(255, 255, 255, 0.8)', scale: 1.01 },
      { borderColor: 'rgba(255, 255, 255, 0.4)', scale: 1, duration: 0.4, ease: 'power2.out' }
    );
    
    this.labelAnim = gsap.fromTo(this.campaignNameLabel.nativeElement,
      { color: '#ffffff', textShadow: '0 0 8px rgba(255,255,255,0.8)', x: 2 },
      { color: '#9ca3af', textShadow: 'none', x: 0, duration: 0.6, ease: 'power2.out' }
    );
  }

  goToStep2() {
    if (!this.campaignName || !this.selectedSegmentId || !this.goal) return;
    
    this.drafting = true;
    this.crm.draftCampaign(this.selectedSegmentId, this.goal).subscribe({
      next: (draft: CampaignDraftResponse) => {
        this.draftSubject = draft.subject_line;
        this.draftBody = draft.message_body;
        this.drafting = false;
        
        // GSAP Slide & Fade out Step 1
        gsap.to(this.step1Container.nativeElement, {
          x: -50, opacity: 0, duration: 0.3, ease: 'power2.in',
          onComplete: () => {
            this.step = 2;
            this.cdr.detectChanges();
            // Slide & fade in Step 2
            gsap.from(this.step2Container.nativeElement, {
              x: 50, opacity: 0, duration: 0.3, ease: 'power2.out'
            });
          }
        });
      },
      error: (err: any) => {
        console.error(err);
        this.drafting = false;
      }
    });
  }
  
  backToStep1() {
    gsap.to(this.step2Container.nativeElement, {
      x: 50, opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        this.step = 1;
        this.cdr.detectChanges();
        gsap.from(this.step1Container.nativeElement, {
          x: -50, opacity: 0, duration: 0.3, ease: 'power2.out'
        });
      }
    });
  }

  approveAndLaunch() {
    this.creating = true;
    const payload: CampaignCreate = {
      name: this.campaignName,
      segment_id: this.selectedSegmentId,
      goal: this.goal,
      channel: this.selectedChannel,
      subject_line: this.draftSubject,
      message_body: this.draftBody
    };
    
    this.crm.createCampaign(payload).subscribe({
      next: () => {
        this.creating = false;
        this.showToast('Campaign queued for delivery');
        this.crm.loadCampaigns(); // refresh list
        
        // Reset to Step 1
        this.campaignName = '';
        this.selectedSegmentId = '';
        this.goal = '';
        this.draftSubject = null;
        this.draftBody = '';
        this.step = 1;
        this.cdr.detectChanges();
        
        // Ensure Step 1 is visible
        gsap.set(this.step1Container.nativeElement, { x: 0, opacity: 1 });
      },
      error: (err: any) => {
        this.creating = false;
        console.error(err);
      }
    });
  }
  
  requestDelete(campaignId: string) {
    this.campaignToDelete = campaignId;
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
      this.campaignToDelete = null;
    }});
  }
  
  confirmDelete() {
    if (this.campaignToDelete) {
      this.crm.deleteCampaign(this.campaignToDelete);
    }
    this.cancelDelete();
  }

  showToast(msg: string) {
    this.successToast = msg;
    // hide toast after 3s
    setTimeout(() => {
      this.successToast = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}
