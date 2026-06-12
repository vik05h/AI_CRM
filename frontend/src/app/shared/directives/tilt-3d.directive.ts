import { Directive, ElementRef, HostListener, NgZone, OnInit, OnDestroy, Input } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appTilt3d]',
  standalone: true
})
export class Tilt3DDirective implements OnInit, OnDestroy {
  @Input() tiltStrength = 10; // Max rotation in degrees

  private xTo!: gsap.QuickToFunc;
  private yTo!: gsap.QuickToFunc;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      // Set perspective on parent or self to enable 3D depth
      gsap.set(this.el.nativeElement.parentElement, { perspective: 1200 });
      gsap.set(this.el.nativeElement, { transformStyle: 'preserve-3d' });
      
      this.xTo = gsap.quickTo(this.el.nativeElement, 'rotateY', { duration: 0.8, ease: 'power3.out' });
      this.yTo = gsap.quickTo(this.el.nativeElement, 'rotateX', { duration: 0.8, ease: 'power3.out' });
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate normalized position -1 to 1
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      // Rotate Y is based on X mouse pos, Rotate X is based on Y mouse pos (inverted)
      this.xTo(normalizedX * this.tiltStrength);
      this.yTo(-(normalizedY * this.tiltStrength));
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.ngZone.runOutsideAngular(() => {
      this.xTo(0);
      this.yTo(0);
    });
  }

  ngOnDestroy() {
    gsap.killTweensOf(this.el.nativeElement);
  }
}
