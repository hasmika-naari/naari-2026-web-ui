import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HeaderStyleComponent } from '../naari-home/header/header.component';
import { BlackFridayFooterComponent } from '../black-friday-landing/black-friday-footer/black-friday-footer.component';
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
  adScans?: string[];
}

@Component({
  selector: 'app-black-friday-ad-scan',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule, HeaderStyleComponent, BlackFridayFooterComponent],
  templateUrl: './black-friday-ad-scan.component.html',
  styleUrls: ['./black-friday-ad-scan.component.scss']
})
export class BlackFridayAdScanComponent implements OnInit {
  merchant: Merchant | null = null;
  browser: boolean = false;
  isMobile: boolean = false;
  pCatsLocal: any[] = [];

  adScanSliderOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="bx bx-chevron-left"></i>', '<i class="bx bx-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 1
      },
      1024: {
        items: 1
      }
    },
    nav: true,
    autoplay: false,
    autoHeight: false,
    center: true
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private deviceService: DeviceDetectorService
  ) {
    this.browser = isPlatformBrowser(this.platformId);
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    const merchantId = Number(this.route.snapshot.paramMap.get('merchantId'));
    this.merchant = merchantsData.find(m => m.id === merchantId) || null;
  }

  scrollToTop(): void {
    if (this.browser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
