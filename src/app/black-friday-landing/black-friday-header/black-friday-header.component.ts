import { Component, Input, HostListener, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-black-friday-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './black-friday-header.component.html',
  styleUrls: ['./black-friday-header.component.scss']
})
export class BlackFridayHeaderComponent implements OnInit {
  @Input() isMobile: boolean = false;
  @Input() menuList: any[] = [];
  
  isSticky: boolean = false;
  isDesktop: boolean = true;
  isTablet: boolean = false;
  isBrowser: boolean = false;
  sidebarVisible: boolean = false;
  appsDrawerVisible: boolean = false;
  
  @HostListener('window:scroll', [])
  checkScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollPosition >= 50) {
        if (!this.isSticky) {
          this.isSticky = true;
          this.cdr.detectChanges();
        }
      } else {
        if (this.isSticky) {
          this.isSticky = false;
          this.cdr.detectChanges();
        }
      }
    }
  }
  
  categories = [
    { code: 'electronics', title: 'Electronics', subTitle: 'Tech Deals' },
    { code: 'fashion', title: 'Fashion', subTitle: 'Clothing & Accessories' },
    { code: 'home', title: 'Home & Garden', subTitle: 'Home Essentials' },
    { code: 'beauty', title: 'Beauty', subTitle: 'Cosmetics & Care' },
    { code: 'toys', title: 'Toys & Games', subTitle: 'Kids & Family' }
  ];
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private deviceService: DeviceDetectorService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.detectDevice();
    }
  }
  
  private detectDevice(): void {
    if (this.deviceService.isDesktop()) {
      this.isDesktop = true;
      this.isMobile = false;
      this.isTablet = false;
    } else if (this.deviceService.isMobile()) {
      this.isMobile = true;
      this.isDesktop = false;
      this.isTablet = false;
    } else if (this.deviceService.isTablet()) {
      this.isTablet = true;
      this.isMobile = false;
      this.isDesktop = false;
    }
  }
  
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  toggleAppsDrawer(): void {
    this.appsDrawerVisible = !this.appsDrawerVisible;
  }
  
  scrollToSection(sectionId: string): void {
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
      this.sidebarVisible = false;
    }
  }
}
