import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HeaderStyleComponent } from '../naari-home/header/header.component';
import { BlackFridayFooterComponent } from './black-friday-footer/black-friday-footer.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import merchantsData from '../../assets/data/black-friday-merchants.json';

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

@Component({
  selector: 'app-black-friday-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule, HeaderStyleComponent, BlackFridayFooterComponent],
  templateUrl: './black-friday-landing.component.html',
  styleUrls: ['./black-friday-landing.component.scss']
})
export class BlackFridayLandingComponent implements OnInit {
  merchants: Merchant[] = [];
  featuredMerchants: Merchant[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  browser: boolean = false;
  isMobile: boolean = false;
  pCatsLocal: any[] = [];

  // Hero slider configuration
  heroSlides: HeroSlide[] = [
    {
      type: 'countdown',
      title: 'BLACK FRIDAY 2025',
      subtitle: 'The Biggest Shopping Event of the Year'
    },
    {
      type: 'ad',
      title: 'Electronics Blowout',
      subtitle: 'Save Up to 70% on TVs, Laptops & More',
      description: 'Unbeatable deals on the latest tech from top brands',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
      buttonText: 'Shop Electronics',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      type: 'ad',
      title: 'Fashion Frenzy',
      subtitle: 'Designer Brands at 50% OFF',
      description: 'Upgrade your wardrobe with premium fashion deals',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop',
      buttonText: 'Shop Fashion',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      type: 'ad',
      title: 'Home & Living Sale',
      subtitle: 'Transform Your Space for Less',
      description: 'Furniture, decor, and appliances at incredible prices',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop',
      buttonText: 'Shop Home Goods',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      type: 'ad',
      title: 'Beauty Bonanza',
      subtitle: 'Luxe Beauty Up to 40% OFF',
      description: 'Treat yourself to premium skincare and makeup',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop',
      buttonText: 'Shop Beauty',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

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
    this.loadMerchants();
    this.startCountdown();
  }

  loadMerchants(): void {
    this.merchants = merchantsData as Merchant[];
    this.featuredMerchants = this.merchants.filter(m => m.featured);
    
    // Extract unique categories
    const uniqueCategories = new Set(this.merchants.map(m => m.category));
    this.categories = ['All', ...Array.from(uniqueCategories)];
  }

  startCountdown(): void {
    if (!this.browser) return;

    // Set Black Friday date (last Friday of November 2025)
    const blackFriday = new Date('2025-11-28T00:00:00');

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

  scrollToMerchants(): void {
    if (this.browser) {
      const element = document.getElementById('merchants-section');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
