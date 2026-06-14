import { Directive, ElementRef, Input, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appNumberCounter]',
  standalone: true
})
export class NumberCounterDirective implements OnChanges {
  @Input() appNumberCounter!: number | string;
  @Input() prefix = '';
  @Input() suffix = '';
  
  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appNumberCounter'] && changes['appNumberCounter'].currentValue !== undefined) {
      const targetVal = typeof this.appNumberCounter === 'string' ? parseFloat(this.appNumberCounter.replace(/,/g, '')) : this.appNumberCounter;
      const startVal = changes['appNumberCounter'].previousValue ? parseFloat(String(changes['appNumberCounter'].previousValue).replace(/,/g, '')) : 0;
      
      if (isNaN(targetVal)) return;

      const obj = { val: startVal };
      this.ngZone.runOutsideAngular(() => {
        gsap.to(obj, {
          val: targetVal,
          duration: 1.5,
          ease: 'power3.out',
          onUpdate: () => {
            this.el.nativeElement.innerText = `${this.prefix}${Math.floor(obj.val).toLocaleString()}${this.suffix}`;
          }
        });
      });
    }
  }
}
