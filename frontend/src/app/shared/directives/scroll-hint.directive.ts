import { Directive, ElementRef, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appScrollHint]',
  standalone: true
})
export class ScrollHintDirective implements AfterViewInit, OnDestroy {
  private timeoutId: any;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // Wait for layout to render completely
      this.timeoutId = setTimeout(() => {
        const el = this.el.nativeElement;
        
        // Only trigger the animation hint if the element actually overflows its container horizontally
        if (el.scrollWidth > el.clientWidth) {
          const proxy = { x: 0 };
          gsap.to(proxy, {
            x: 60,
            duration: 0.6,
            ease: "power2.inOut",
            delay: 0.8,
            yoyo: true,
            repeat: 1,
            onUpdate: () => {
              el.scrollLeft = proxy.x;
            }
          });
        }
      }, 500); 
    });
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
