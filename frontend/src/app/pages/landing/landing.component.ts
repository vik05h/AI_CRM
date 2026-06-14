import { Component, ChangeDetectionStrategy, afterNextRender, ElementRef, viewChild, OnDestroy, NgZone, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthService } from '../../services/auth.service';
import { Tilt3DDirective } from '../../shared/directives/tilt-3d.directive';
import { SpotlightDirective } from '../../shared/directives/spotlight.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  imports: [Tilt3DDirective, SpotlightDirective, MagneticDirective]
})
export class LandingComponent implements OnDestroy {
  private ctx!: gsap.Context;
  private authService = inject(AuthService);

  screenshots = [
    '/image.png',
    '/image-1.png',
    '/image-2.png',
    '/image-3.png',
    '/image-4.png',
    '/image-5.png'
  ];

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {
    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        this.ctx = gsap.context(() => {
          this.initAnimations();
        }, this.elementRef.nativeElement);
      });
    });
  }

  async login() {
    await this.authService.loginWithGoogle();
  }

  ngOnDestroy() {
    if (this.ctx) {
      this.ctx.revert();
    }
  }

  private initAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Nav fade in
    tl.from('nav', {
      y: -20,
      opacity: 0,
      duration: 0.8,
    });

    // Hero items staggered entrance
    const heroItems = this.elementRef.nativeElement.querySelectorAll('.hero-item');
    tl.from(heroItems, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15
    }, "-=0.4");

    // Stack Animation
    const stackCards = gsap.utils.toArray('.stack-card') as HTMLElement[];
    if (stackCards.length > 0) {
      const totalCards = stackCards.length;

      // Initial positioning
      stackCards.forEach((card, i) => {
        gsap.set(card, {
          scale: 1 - i * 0.05,
          y: i * 30,
          opacity: 1 - i * 0.15,
          transformOrigin: "top center",
          zIndex: totalCards - i
        });
      });

      let currentIndex = 0;

      const nextCard = () => {
        const currentCard = stackCards[currentIndex];

        // Ensure animating card stays on top
        gsap.set(currentCard, { zIndex: totalCards + 1 });

        // Fly up and fade out
        gsap.to(currentCard, {
          y: -100,
          opacity: 0,
          scale: 1.05,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            // Send to back of stack
            gsap.set(currentCard, {
              y: (totalCards - 1) * 30,
              scale: 1 - (totalCards - 1) * 0.05,
              opacity: 1 - (totalCards - 1) * 0.15,
              zIndex: 1
            });
          }
        });

        // Move remaining cards up the stack
        for (let i = 1; i < totalCards; i++) {
          const index = (currentIndex + i) % totalCards;
          const card = stackCards[index];
          const newPos = i - 1;

          gsap.to(card, {
            y: newPos * 30,
            scale: 1 - newPos * 0.05,
            opacity: 1 - newPos * 0.15,
            duration: 0.8,
            ease: 'power3.inOut',
            zIndex: totalCards - newPos
          });
        }

        currentIndex = (currentIndex + 1) % totalCards;
        gsap.delayedCall(3, nextCard);
      };

      gsap.delayedCall(3, nextCard);
    }

    // Subtle pulse for the abstract glow
    const heroGlow = this.elementRef.nativeElement.querySelector('.absolute.inset-0.scale-110');
    if (heroGlow) {
      gsap.to(heroGlow, {
        scale: 1.05,
        opacity: 0.5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // ScrollTrigger for Features Section
    const featureHeaders = this.elementRef.nativeElement.querySelectorAll('.feature-header');
    const featureCards = this.elementRef.nativeElement.querySelectorAll('.feature-card');

    if (featureHeaders.length > 0) {
      gsap.fromTo(featureHeaders,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.panel-recessed',
            start: 'top 80%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }

    if (featureCards.length > 0) {
      const cardsContainer = this.elementRef.nativeElement.querySelector('.grid');
      gsap.fromTo(featureCards,
        { y: 100, opacity: 0, scale: 0.85 },
        {
          scrollTrigger: {
            trigger: cardsContainer || '.panel-recessed',
            start: 'top 80%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          clearProps: 'transform' // Clear transform so CSS hover works after animation
        }
      );
    }

    // ScrollTrigger for Stats Section
    const statItems = this.elementRef.nativeElement.querySelectorAll('.stat-item');
    if (statItems.length > 0) {
      gsap.fromTo(statItems,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.border-y', // Trigger is the stats section container
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        }
      );
    }
  }
}

