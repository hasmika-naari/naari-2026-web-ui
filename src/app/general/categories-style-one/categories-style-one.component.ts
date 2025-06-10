import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-categories-style-one',
  standalone: true,
    imports: [CommonModule, RouterModule, CarouselModule],
  templateUrl: './categories-style-one.component.html',
  styleUrls: ['./categories-style-one.component.scss']
})
export class CategoriesStyleOneComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    categoriesSlides: OwlOptions = {
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 10,
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