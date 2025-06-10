import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-categories-style-two',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CarouselModule],
  templateUrl: './categories-style-two.component.html',
  styleUrls: ['./categories-style-two.component.scss']
})
export class CategoriesStyleTwoComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    categoriesSlides: OwlOptions = {
		loop: true,
		nav: true,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 2
			},
			768: {
				items: 3
			},
			1200: {
				items: 4
			}
		}
    }

}