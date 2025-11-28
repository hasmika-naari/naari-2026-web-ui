import { Component, OnInit, inject, PLATFORM_ID, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DealDataItem } from '@app/services/deals.model';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { AppUtilService } from '@app/services/app.util.service';

@Component({
  selector: 'app-featured-deals-carousel',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CarouselModule
  ],
  templateUrl: './featured-deals-carousel.component.html',
  styleUrls: ['./featured-deals-carousel.component.scss']
})
export class FeaturedDealsCarouselComponent implements OnInit, OnChanges {
  @Input() country: string = 'usa';
  @Input() isMobile: boolean = false;
  @Input() isTablet: boolean = false;
  @Input() isDesktop: boolean = true;
  @Input() allDeals: DealDataItem[] = [];

  featuredDeals: DealDataItem[] = [];
  private platformId: object = inject(PLATFORM_ID);
  private dealsStoreService: DealsStoreService = inject(DealsStoreService);
  private appService: AppUtilService = inject(AppUtilService);

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    navSpeed: 600,
    navText: [
      '<i class="bx bx-chevron-left"></i>',
      '<i class="bx bx-chevron-right"></i>'
    ],
    responsive: {
      0: {
        items: 2.5,
        margin: 8
      },
      576: {
        items: 3.5,
        margin: 10
      },
      768: {
        items: 5,
        margin: 12
      },
      992: {
        items: 7,
        margin: 12
      },
      1200: {
        items: 10,
        margin: 12
      }
    }
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFeaturedDeals();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allDeals'] && !changes['allDeals'].firstChange && isPlatformBrowser(this.platformId)) {
      this.loadFeaturedDeals();
    }
  }

  loadFeaturedDeals(): void {
    if (this.allDeals && this.allDeals.length > 0) {
      // Get high discount deals (over 25%) and shuffle them
      const highDiscountDeals = this.allDeals
        .filter(deal => {
          const discountValue = typeof deal.discount === 'string' ? parseFloat(deal.discount) : deal.discount;
          return discountValue && discountValue >= 25;
        })
        .map(deal => ({ ...deal, isPremium: true })); // Mark as premium

      // Shuffle the array to get random deals
      const shuffled = this.shuffleArray([...highDiscountDeals]);
      
      // Take first 15 deals
      this.featuredDeals = shuffled.slice(0, 15);
    }
  }

  // Fisher-Yates shuffle algorithm
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  addToWishlist(deal: DealDataItem): void {
    this.dealsStoreService.toggleWishlistStatus(deal);
  }

  shareOnWhatsApp($event: Event, deal: DealDataItem): void {
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(deal);
  }
}
