import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, Signal, computed } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { DealsService } from '@app/services/deals.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { PCategory, Category } from '@app/services/deals.model';

@Component({
  selector: 'app-work-ifence-footer',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NgxScrollTopModule, RouterModule, 
    RouterLink,],
  templateUrl: './footer-wifence.component.html',
  styleUrls: ['./footer-wifence.component.scss']
})
export class FooterWorkifenceComponent implements OnInit {

  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  // Popular categories shown in footer for quick access
  // Use the canonical popular categories from the store
  pCategories!: Signal<PCategory[]>;
  // flattened list of Category objects derived from pCategories
  footerCategories!: Signal<Category[]>;
  
  // Cached random categories - computed signals so they only update when categories change
  leftChips!: Signal<Category[]>;
  rightChips!: Signal<Category[]>;
  
  // quick links (non-category shortcuts)
  quickLinks = [
    { path: '/deals', title: 'All Deals', icon: 'bx bx-shopping-bag' },
    { path: '/about-us', title: 'About Us', icon: 'bx bx-info-circle' },
    { path: '/contact-us', title: 'Contact Us', icon: 'bx bx-phone' },
    { path: '/faq', title: 'FAQ', icon: 'bx bx-help-circle' }
  ];

  // computed signals for UI that derive directly from store data
  displayWomen!: Signal<Category[]>;
  displayBestDeals!: Signal<Category[]>;
  private dealsService: DealsService= inject(DealsService);
  private platformId: object =  inject(PLATFORM_ID);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  private dealsStoreService: DealsStoreService = inject(DealsStoreService);

  constructor() { }

  ngOnInit(): void {

   if(isPlatformBrowser(this.platformId)){
      // this.loadFetcheddata();
      this.browser = true;
      if(this.deviceService.isDesktop()){
        this.isDesktop = true;
        this.isMobile = false;
        this.isTablet = false;
      }else if(this.deviceService.isMobile()){
        this.isMobile = true;
        this.isDesktop = false;
        this.isTablet = false;
      }else if(this.deviceService.isTablet()){
        this.isTablet = true;
        this.isMobile = false;
        this.isDesktop = false;
      }
    }

    // expose the store's popular categories signal for the template
    this.pCategories = this.dealsStoreService.getPcCategories();

    // compute a flattened list of category entries for footer usage
    this.footerCategories = computed(() => {
      const pcs = this.pCategories ? this.pCategories() : [];
      const flattened = pcs.reduce((acc: Category[], pc: PCategory) => {
        if (pc && pc.categories && pc.categories.length) {
          acc.push(...pc.categories);
        }
        return acc;
      }, [] as Category[]);
      console.log('Footer Categories loaded:', flattened.length, flattened);
      return flattened;
    });

    // Compute random chips for each section - use consistent seeding with offset
    this.leftChips = computed(() => {
      const categories = this.footerCategories() || [];
      if (!categories || categories.length === 0) return [];
      const shuffled = this.shuffleArray([...categories], 1);
      return shuffled.slice(0, 12);
    });

    this.rightChips = computed(() => {
      const categories = this.footerCategories() || [];
      if (!categories || categories.length === 0) return [];
      const shuffled = this.shuffleArray([...categories], 2);
      return shuffled.slice(0, 12);
    });

    // display signals that derive directly from flattened categories
    this.displayWomen = computed(() => {
      const list = this.footerCategories() || [];
      return list.slice(0, 12);
    });

    this.displayBestDeals = computed(() => {
      const list = this.footerCategories() || [];
      return list.slice(0, 9);
    });
  }

  /**
   * Get an appropriate Boxicon for a given category code
   */
  getCategoryIcon(categoryCode: string): string {
    const iconMap: { [key: string]: string } = {
      'fashion': 'bx bx-shopping-bag',
      'beauty': 'bx bx-heart',
      'electronics': 'bx bx-camera',
      'home': 'bx bx-home',
      'toys': 'bx bx-gift',
      'sports': 'bx bx-run',
      'books': 'bx bx-book',
      'music': 'bx bx-music',
      'food': 'bx bx-food-menu',
      'travel': 'bx bx-plane',
      'health': 'bx bx-heart-circle',
      'tech': 'bx bx-chip',
    };
    return iconMap[categoryCode] || 'bx bx-package';
  }

  /**
   * Fisher-Yates shuffle algorithm for random array with optional seed for consistency
   */
  private shuffleArray<T>(array: T[], seed: number = 0): T[] {
    const shuffled = [...array];
    // Use seed to initialize random number generator for consistency
    let random = seed;
    for (let i = shuffled.length - 1; i > 0; i--) {
      random = (random * 9301 + 49297) % 233280;
      const j = Math.floor((random / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

}