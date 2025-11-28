import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { BlackFridayHeaderComponent } from './black-friday-header/black-friday-header.component';
import { BlackFridayFooterComponent } from './black-friday-footer/black-friday-footer.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import merchantsData from '../../assets/data/black-friday-merchants.json';
import configData from '../../assets/data/black-friday-config.json';

interface Merchant {
  id: number;
  name: string;
  logo: string;
  discount: string;
  category: string;
  deal: string;
  verified: boolean;
  featured: boolean;
  url?: string;
  adScans?: string[];
  assignedBackground?: string;
}

interface HeroSlide {
  type: 'countdown' | 'ad';
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  gradient?: string;
}

interface BlackFridayConfig {
  countdownDate: string;
  pageTitle: string;
  pageSubtitle: string;
  sections: {
    adScans: { title: string; subtitle: string; icon: string };
    featured: { title: string; icon: string };
    allDeals: { title: string; icon: string };
  };
  heroSlides: HeroSlide[];
  backgroundImages: string[];
}

@Component({
  selector: 'app-black-friday-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule, BlackFridayHeaderComponent, BlackFridayFooterComponent],
  templateUrl: './black-friday-landing.component.html',
  styleUrls: ['./black-friday-landing.component.scss']
})
export class BlackFridayLandingComponent implements OnInit, OnDestroy {
  merchants: Merchant[] = [];
  featuredMerchants: Merchant[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  browser: boolean = false;
  isMobile: boolean = false;
  isMobileNavSticky: boolean = false;
  pCatsLocal: any[] = [];
  config: BlackFridayConfig = configData as BlackFridayConfig;
  private scrollListener?: () => void;

  // Hero slider configuration (loaded from JSON)
  heroSlides: HeroSlide[] = [];

  // Section titles (loaded from JSON)
  adScansSection = { title: '', subtitle: '', icon: '' };
  featuredSection = { title: '', icon: '' };
  allDealsSection = { title: '', icon: '' };

  heroSliderOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navSpeed: 700,
    nav: true,
    navText: ['<i class="bx bx-chevron-left"></i>', '<i class="bx bx-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    }
  };

  // Countdown timer
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public deviceService: DeviceDetectorService
  ) {
    this.browser = isPlatformBrowser(this.platformId);
    if (this.browser) {
      this.isMobile = this.deviceService.isMobile();
    }
  }

  ngOnInit(): void {
    this.loadConfig();
    this.loadMerchants();
    this.startCountdown();
    
    if (this.browser && this.isMobile) {
      this.setupMobileNavScroll();
    }
  }

  loadConfig(): void {
    // Load hero slides from config
    this.heroSlides = this.config.heroSlides;
    
    // Load section configurations
    this.adScansSection = this.config.sections.adScans;
    this.featuredSection = this.config.sections.featured;
    this.allDealsSection = this.config.sections.allDeals;
  }

  loadMerchants(): void {
    this.merchants = merchantsData as Merchant[];
    
    // Assign backgrounds from config
    const defaultImages = this.config.backgroundImages;
    
    this.merchants.forEach((merchant, index) => {
      merchant.assignedBackground = defaultImages[index % defaultImages.length];
    });
    
    this.featuredMerchants = this.merchants.filter(m => m.featured);
    
    // Extract unique categories
    const uniqueCategories = new Set(this.merchants.map(m => m.category));
    this.categories = ['All', ...Array.from(uniqueCategories)];
  }

  startCountdown(): void {
    if (!this.browser) return;

    // Use countdown date from config
    const blackFriday = new Date(this.config.countdownDate);

    setInterval(() => {
      const now = new Date().getTime();
      const distance = blackFriday.getTime() - now;

      if (distance > 0) {
        this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }
    }, 1000);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  getFilteredMerchants(): Merchant[] {
    if (this.selectedCategory === 'All') {
      return this.merchants;
    }
    return this.merchants.filter(m => m.category === this.selectedCategory);
  }

  getMerchantsWithAdScans(): Merchant[] {
    return this.merchants.filter(m => m.adScans && m.adScans.length > 0);
  }

  getCardBackground(merchant: Merchant): string {
    // Use the assigned background image
    return `url('${merchant.assignedBackground}')`;
  }

  scrollToMerchants(): void {
    if (this.browser) {
      const element = document.getElementById('merchants-section');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToSection(sectionId: string): void {
    if (this.browser) {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupMobileNavScroll(): void {
    if (!this.browser) return;
    
    this.scrollListener = () => {
      const heroSection = document.querySelector('.bf-hero-slider') as HTMLElement;
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Make mobile nav sticky when user scrolls past the hero section
        this.isMobileNavSticky = scrollPosition > heroBottom - 100;
      }
    };
    
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy(): void {
    if (this.browser && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
