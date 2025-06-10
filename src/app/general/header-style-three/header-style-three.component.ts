import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ThemeCustomizerService } from '../../../../services/theme-customizer/theme-customizer.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
    selector: 'app-header-style-three',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule, RouterModule, RouterLink],
    templateUrl: './header-style-three.component.html',
    styleUrls: ['./header-style-three.component.scss']
})
export class HeaderStyleThreeComponent implements OnInit {

    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    isToggled = false;

    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {}

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    classApplied2 = false;
    toggleClass2() {
        this.classApplied2 = !this.classApplied2;
    }

    classApplied3 = false;
    toggleClass3() {
        this.classApplied3 = !this.classApplied3;
    }

}