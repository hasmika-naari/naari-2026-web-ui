import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ThemeCustomizerService } from '../../../../services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-homethree-courses',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule],
    templateUrl: './homethree-courses.component.html',
    styleUrls: ['./homethree-courses.component.scss']
})
export class HomethreeCoursesComponent implements OnInit {

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

    // for tab click event
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

}