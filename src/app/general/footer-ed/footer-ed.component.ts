import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID , Inject} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouterModule } from '@angular/router';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { MatExpansionModule } from "@angular/material/expansion"
import { LocalStorageService } from '@app/services/local-storage.service';
declare function TrustLogo(t: any, e: any, L: any): any; 

@Component({
    selector: 'app-footer-ed',
    imports: [CommonModule, RouterModule, NgxScrollTopModule, MatExpansionModule],
    templateUrl: './footer-ed.component.html',
    styleUrls: ['./footer-ed.component.scss']
})
export class FooterEdComponent implements OnInit {
  country = '';
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  isBrowser!: boolean;
  isShowContent = false;
  mobileAppUrl = '/assets/img/naari_iphone13pink_portrait.png';
  getItOnUrl = '/assets/img/getiton.jpg';
  constructor(private _localStorageService: LocalStorageService, public deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    // this.country = this._localStorageService.getItem('naariCountry');
		// if(this.country){
    //         this.country = this.country.replace(/\"/g, " ");
    //         this.country = this.country.replace(/\s+/g, '');
    //         this.country = this.country.replace(/\\/g, '');
		// }
    this.isBrowser = isPlatformBrowser(platformId); 
    if(this.isBrowser){
      if(this.deviceService.isDesktop()){
        this.isDesktop = true;
        this.isMobile = false;
        this.isTablet = false;
      }else if(this.deviceService.isMobile()){
        this.isMobile = true;
        this.isDesktop = false;
        this.isTablet = false;
      }else if(this.deviceService.isTablet()){
        this.isTablet = true;
        this.isMobile = false;
        this.isDesktop = false;
      }
    //   setTimeout(() => {
    //     this.isShowContent = true; 
    //  }, 500);
    } 
   }

  ngOnInit(): void {
  }

  testSslLogo($event: any, test: any, test1:any, test2:any){
    ;
    $event.stopPropagation();
    
    TrustLogo("", "POSDV", "none")
  }
}


