import { Directive, ElementRef, HostListener, NgZone, OnInit, OnDestroy, Input } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective implements OnInit, OnDestroy {
  @Input() magneticPull = 0.3; // Strength of the pull

  private xTo!: gsap.QuickToFunc;
  private yTo!: gsap.QuickToFunc;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.xTo = gsap.quickTo(this.el.nativeElement, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
      this.yTo = gsap.quickTo(this.el.nativeElement, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) * this.magneticPull;
      const y = (e.clientY - centerY) * this.magneticPull;

      this.xTo(x);
      this.yTo(y);
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
