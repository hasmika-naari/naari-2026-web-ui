import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-black-friday-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './black-friday-footer.component.html',
  styleUrls: ['./black-friday-footer.component.scss']
})
export class BlackFridayFooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { icon: 'bxl-facebook', url: 'https://facebook.com', name: 'Facebook' },
    { icon: 'bxl-twitter', url: 'https://twitter.com', name: 'Twitter' },
    { icon: 'bxl-instagram', url: 'https://instagram.com', name: 'Instagram' },
    { icon: 'bxl-pinterest', url: 'https://pinterest.com', name: 'Pinterest' }
  ];

  quickLinks = [
    { label: 'All Deals', route: '/deals' },
    { label: 'Electronics', route: '/deals?category=Electronics' },
    { label: 'Fashion', route: '/deals?category=Fashion' },
    { label: 'Home & Garden', route: '/deals?category=Home' },
    { label: 'Beauty', route: '/deals?category=Beauty' }
  ];

  helpLinks = [
    { label: 'About Us', route: '/bio-profile' },
    { label: 'Contact', route: '/contact-us' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Terms & Conditions', route: '/terms' }
  ];
}
