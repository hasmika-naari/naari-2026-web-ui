import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AppConstantsService } from '@app/services/app-constants.service';
import { LoginRequest, PasswordRequest, PasswordResetRequest } from '@app/services/auth.models';
import { AuthService } from '@app/services/auth.service';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { YeaSnackBarService } from '@app/services/utilities/snackbar';
import { Subscription, catchError, map } from 'rxjs';
import * as _ from 'lodash';
import { Account, BioProfile, PasswordResetFinishRqst, PasswordResetRqst } from '@app/services/profile.model';
import { LocalStorageService } from '@app/services/local-storage.service';
import { UserStoreService } from '@app/services/store/user-store.service';
import Validation from '@app/services/utilities/validation';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-reset-password',
    imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule,
        NgOptimizedImage],
    templateUrl: './reset-password-page.component.html',
    styleUrls: ['./reset-password-page.component.scss']
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    isBrowser!: boolean;
   
    resetPasswordFormSubmitted = false;
    isActionInProgress = false;

    username:string = '';

    resetKey: string = '';
    public resetPasswordForm: FormGroup = new FormGroup({
      password1: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    });

    subs: Array<Subscription> = [];
    private authService: AuthService = inject(AuthService);
    private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
    private constantService: AppConstantsService  = inject(AppConstantsService);
    private localStorageService: LocalStorageService  = inject(LocalStorageService);
    private router: Router= inject(Router);
    private route: ActivatedRoute =  inject(ActivatedRoute);
    private userStore: UserStoreService = inject(UserStoreService);
    private platformId: object =  inject(PLATFORM_ID);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);

    // private readonly userStore = inject(SignalStore<UserState>);

    // readonly account = this.userStore.select(x => x.account);
    // readonly token = this.userStore.select(x => x.token);

    constructor(
        public themeService: ThemeCustomizerService,
        private formBuilder: FormBuilder
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {

        this.subs.push(this.route.params.subscribe(params => { 
          this.resetKey = params['key'];
        })); 

        if(isPlatformBrowser(this.platformId)){
          this.isBrowser = true;
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

        this.resetPasswordForm = this.formBuilder.group(
          {
            password1: [
              '',
              [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(40)
              ]
            ],
            password2: ['', Validators.required]
          },
          {
            validators: [Validation.match('password1', 'password2')]
          }
        );

    }

      get fpwf(): { [key: string]: AbstractControl } {
        return this.resetPasswordForm.controls;
      }

      ngOnDestroy(): void {
          this.subs.forEach(s => s.unsubscribe());
      }

      resetPasswordSubmit($event: any){
        debugger;
        this.resetPasswordFormSubmitted = true;

        if (this.resetPasswordForm.invalid) {
          return;
        }
        let resetRqst: PasswordResetFinishRqst = new PasswordResetFinishRqst();
        resetRqst.key = this.resetKey;
        resetRqst.newPassword = this.resetPasswordForm.value.password1;

        this.authService.finishResetPassword(resetRqst).subscribe(
           (resetFinishResponse) =>
            {
              //consolie.log('resetResponse  == ' + resetFinishResponse);
              this.snackBarService.openSnackBar('Updated Password Successful!!', this.constantService.snackbarType.SUCCESS, 2500);
              this.router.navigateByUrl('/login');
            });
      }

    
      onReset(): void {
        this.resetPasswordFormSubmitted = false;
        this.resetPasswordForm.reset();
      }

}