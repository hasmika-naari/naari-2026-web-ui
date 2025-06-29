// ssr-ready.directive.ts
import {
  Directive,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[ngSsrReady]'
})
export class NgSsrReadyDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Add class to body after view init
      this.renderer.addClass(document.body, 'ng-ssr-ready');

       this.renderer.addClass(document.body, 'ng-ssr-ready');

        // Optional delay to allow smooth CSS transitions
        setTimeout(() => {
        this.renderer.addClass(document.body, 'loading-complete');
        }, 100); // adjust timing as needed
    }
  }
}
