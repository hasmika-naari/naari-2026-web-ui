import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxScrollTopModule } from 'ngx-scrolltop';
declare function TrustLogo(t: any, e: any, L: any): any; 
@Component({
    selector: 'app-footer',
    imports: [CommonModule, RouterModule, NgxScrollTopModule, MatExpansionModule],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  private platformId: object =  inject(PLATFORM_ID);
  mobileAppUrl = '/assets/img/naari_iphone13pink_portrait.png';
  getItOnUrl = '/assets/img/getiton.jpg';
  constructor() {
    afterNextRender({ write: () => {
        // this.loadFetcheddata();
        if (isPlatformBrowser(this.platformId)) {
            this.browser = true;
        }
    } },)
   }

  ngOnInit(): void {

    if(isPlatformBrowser(this.platformId)){
      this.browser = true;
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
    }
  }

  testSslLogo($event: any, test: any, test1:any, test2:any){
    ;
    $event.stopPropagation();
    
    TrustLogo("", "POSDV", "none")
  }

}
