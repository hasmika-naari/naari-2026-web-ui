import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-become-partner',
    imports: [CommonModule, NgOptimizedImage],
    templateUrl: './become-partner.component.html',
    styleUrls: ['./become-partner.component.scss']
})
export class BecomePartnerComponent implements OnInit {

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

}