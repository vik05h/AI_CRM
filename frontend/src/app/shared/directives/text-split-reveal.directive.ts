import { Directive, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appTextSplitReveal]',
  standalone: true
})
export class TextSplitRevealDirective implements AfterViewInit {
  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // Ensure the element has content
      const text = this.el.nativeElement.innerText;
      if (!text || text.trim() === '') return;

      this.el.nativeElement.innerHTML = '';
      
      const words = text.split(' ');
      words.forEach((word: string) => {
        // Outer wrapper handles the overflow mask
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        span.style.verticalAlign = 'bottom';
        // Use a non-breaking space for layout, or padding
        span.style.marginRight = '0.25em'; 
        
        // Inner span handles the actual movement
        const innerSpan = document.createElement('span');
        innerSpan.style.display = 'inline-block';
        innerSpan.innerText = word;
        innerSpan.className = 'split-word-inner';
        
        span.appendChild(innerSpan);
        this.el.nativeElement.appendChild(span);
      });

      const inners = this.el.nativeElement.querySelectorAll('.split-word-inner');
      gsap.fromTo(inners, 
        { y: '100%' }, 
        { y: '0%', duration: 0.8, stagger: 0.05, ease: 'power4.out' }
      );
    });
  }
}
