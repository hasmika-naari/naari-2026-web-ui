import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { DealsService } from '@app/services/deals.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxScrollTopModule } from 'ngx-scrolltop';

@Component({
  selector: 'app-work-ifence-footer',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NgxScrollTopModule, RouterModule, 
    RouterLink,],
  templateUrl: './footer-wifence.component.html',
  styleUrls: ['./footer-wifence.component.scss']
})
export class FooterWorkifenceComponent implements OnInit {

  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  private dealsService: DealsService= inject(DealsService);
  private platformId: object =  inject(PLATFORM_ID);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);

  constructor() { }

  ngOnInit(): void {

   if((this.platformId)){
      // this.loadFetcheddata();
      this.browser = true;
      // setTimeout(() => {
      //   this.isActionInProgress = false;
      // }, 10);
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
      // let userName:string = this._localStorageService.getItem("userName");
      // let passWord:string = this._localStorageService.getItem("passWord");
      // 
      // console.log('UserName: ' + userName);
      // console.log('passWord: ' + passWord);
      // this.appUtilService.loginWithCredentials(userName, passWord, '/user/dashboard');
    }
  }

}
