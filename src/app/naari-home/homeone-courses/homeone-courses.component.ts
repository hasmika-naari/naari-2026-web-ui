import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, afterNextRender } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category, DealType, PCategory } from '@app/services/deals.model';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatButtonModule } from '@angular/material/button';


export interface ClothingItem {
  title: string;
  imageUrl: string;
}

@Component({
    selector: 'app-homeone-courses',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, RouterModule,
        CarouselModule, MatButtonModule],
    templateUrl: './homeone-courses.component.html',
    styleUrls: ['./homeone-courses.component.scss']
})
export class HomeoneCoursesComponent implements OnInit, OnChanges {

    isToggled = false;
    @Input() categories: Array<Category> = new Array<Category>();
    @Input() isMobile: boolean = false;
    isBrowser!: boolean;

    clothing: PCategory =  new PCategory();
    footwear: PCategory =  new PCategory();
    jewelry: PCategory =  new PCategory();
    accessories: PCategory =  new PCategory();
    beauty: PCategory =  new PCategory();
    home: PCategory =  new PCategory();
    other: PCategory = new PCategory();


 items = [
  { title: 'Shirts', imageUrl: 'assets/images/shirts.jpg', size: 'large' },
  { title: 'Jeans', imageUrl: 'assets/images/jeans.jpg', size: 'medium' },
  { title: 'Pants', imageUrl: 'assets/images/pants.jpg', size: 'medium' },
  { title: 'Blouses', imageUrl: 'assets/images/blouses.jpg', size: 'large' },
  { title: 'T-Shirts', imageUrl: 'assets/images/tshirts.jpg', size: 'medium' },
  { title: 'Leggings', imageUrl: 'assets/images/leggings.jpg', size: 'small' },
  { title: 'Joggers', imageUrl: 'assets/images/joggers.jpg', size: 'medium' },
];
    
    constructor(
        public themeService: ThemeCustomizerService,
        private elementRef: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.themeService.isToggled$.subscribe((isToggled: any) => {
            this.isToggled = isToggled;
        });
        afterNextRender(() => {
            if(isPlatformBrowser(this.platformId)){
             
            }
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['categories']){
          this.categories.forEach(c => {
            if(c.parent === 'Clothing'){
              this.clothing.parent = 'Clothing';
              this.clothing.categories.push(c)
            }else if(c.parent === 'Footwear'){
              this.footwear.parent = 'Footwear';
              this.footwear.categories.push(c)
            }else if (c.parent === 'Jewelry'){
              this.jewelry.parent = 'Jewelry';
              this.jewelry.categories.push(c)
            }else if(c.parent === 'Accesories'){
              this.accessories.parent = 'Accesories';
              this.accessories.categories.push(c)
            }else if (c.parent === 'Beauty'){
              this.beauty.parent = 'Beauty';
              this.beauty.categories.push(c)
            } else if (c.parent === 'Home'){
              this.home.parent = 'Home';
              this.home.categories.push(c)
            }else{
              this.clothing.parent = 'Other';
              this.clothing.categories.push(c)
            }
          })
      }
    }

    ngOnInit(): void {}

    // for tab click event
    currentTab = 'tab2';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    ngAfterViewInit(): void {
       
      }

      public getBanner(index: any){
        return this.categories[index];
      }
    
      public getBgImage(index: any){
        let bgImage = {
          'background-image': index != null && this.categories[index] ? "url(" + this.categories[index].imageUrl + ")" : "url(https://via.placeholder.com/600x400/ff0000/fff/)"
        };
        return bgImage;
      } 

}