import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AppConstantsService } from '@app/services/app-constants.service';
import { LoginRequest, PasswordRequest, PasswordResetRequest } from '@app/services/auth.models';
import { AuthService } from '@app/services/auth.service';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { YeaSnackBarService } from '@app/services/utilities/snackbar';
import { Subscription, catchError, map } from 'rxjs';
import * as _ from 'lodash';
import { Account, BioProfile, PasswordResetRqst } from '@app/services/profile.model';
import { LocalStorageService } from '@app/services/local-storage.service';
import { UserStoreService } from '@app/services/store/user-store.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-login-page',
    imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule, MatButtonModule,
        NgOptimizedImage, MatProgressBarModule],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    isBrowser!: boolean;
   
    submitted = false;
    forgotPasswordFormSubmitted = false;
    actionInProgress = false;

    username:string = '';
    password:string = '';
    public loginForm: FormGroup = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    public forgotPasswordForm: FormGroup = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });

    public changePasswordForm: FormGroup = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      password1: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    });

    isForgotPassword:boolean = false;

  
    subs!: Array<Subscription>;
    private authService: AuthService = inject(AuthService);
    private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
    private constantService: AppConstantsService  = inject(AppConstantsService);
    private localStorageService: LocalStorageService  = inject(LocalStorageService);
    private router: Router= inject(Router);
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
        this.loginForm = this.formBuilder.group(
            {
              username: [
                '',
                [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(20),
                ],
              ],
              password: [
                '',
                [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(40),
                ],
              ],
            }
          );
          this.forgotPasswordForm = this.formBuilder.group(
            {
              username: [
                '',
                [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(20),
                ],
              ],
              email: ['', [Validators.required, Validators.email]]
            }
          );

          // this.forgotPasswordForm = this.formBuilder.group(
          //   {
          //     currentPassword: ['', Validators.required],
          //     password: [
          //       '',
          //       [
          //         Validators.required,
          //         Validators.minLength(6),
          //         Validators.maxLength(40)
          //       ]
          //     ],
          //     confirmPassword: ['', Validators.required]
          //   },
          //   {
          //     validators: [Validation.match('password', 'confirmPassword')]
          //   }
          // );

    }

    get f(): { [key: string]: AbstractControl } {
        return this.loginForm.controls;
      }

      get fpwf(): { [key: string]: AbstractControl } {
        return this.forgotPasswordForm.controls;
      }

      onSubmit(): void {
        this.submitted = true;
        // const state = this.account();
        // const tokenState = this.token();

        if (this.loginForm.invalid) {
          return;
        }
        let loginRequest = new LoginRequest();
        loginRequest.username =  this.loginForm.value.username;
        loginRequest.password = this.loginForm.value.password;
        ;
        //consolie.log('signInPre Start');
        this.authService.signInPre(loginRequest).subscribe(
           (loginResponse) =>
            {
              //consolie.log('loginResponse Response  == ' + loginResponse.status);
              if(loginResponse.status === null){
                this.snackBarService.openSnackBar('You are not registered yet', this.constantService.snackbarType.ERROR, 2500);
              }else if(_.includes(loginResponse.status,'not-activated')){
              //consolie.log(' Response 1 == ' + loginResponse.status);
              this.snackBarService.openSnackBar('Your Account not Activated Please activate', this.constantService.snackbarType.ERROR, 2500);
              this.router.navigateByUrl('/login/activate');
              }else{
                //consolie.log(' Response 2  == ' + loginResponse.status);
                this.authService.signIn(loginRequest).subscribe(
                   (loginResponse) =>
                    {
                      this.localStorageService.setItem('authToken', loginResponse.id_token);
                      this.userStore.updateToken(loginResponse.id_token);
                      // this.userStore.setKey('token',loginResponse.id_token);

                      this.authService.getAccountProfile().subscribe(
                        (account) =>
                        {
                          ;
                          //consolie.log('account: ' + account.id);
                          this.userStore.updateAccount(account);
                          this.authService.getBioProfile(account.login).subscribe(
                            (bioProfile: BioProfile) => {
                                if(!bioProfile.id){
                                  this.snackBarService.openSnackBar('Your Account not Activated Please activate', this.constantService.snackbarType.ERROR, 2500);
                                  this.router.navigate(['/bio-profile']);
                                }
                                else{
                                  this.router.navigate(['/admin/dashboard']);
                                }
                                // bioProfile: 
                                // {...bioProfile, imageUrl: bioProfile?.imageUrl?this.constantService.BASE_AWS_S3_API_URL + bioProfile?.imageUrl:'' }}),
                              })
                          }
                      );

                    });
              }
            });
        // //consolie.log(JSON.stringify(this.loginForm.value, null, 2));
      }

      forgotPasswordSubmit($event: any){
        debugger;
        this.forgotPasswordFormSubmitted = true;
        if (this.forgotPasswordForm.invalid) {
          return;
        }
        this.actionInProgress = true;

        let resetRqst: PasswordResetRqst = new PasswordResetRqst();
        resetRqst.email = this.forgotPasswordForm.value.email;
        resetRqst.language = 'en';
        resetRqst.username = this.forgotPasswordForm.value.username;

        this.authService.initiateResetPassword(resetRqst).subscribe(
           (resetResponse) =>
            {
              //consolie.log('resetResponse  == ' + resetResponse);
              this.actionInProgress = false;

              this.snackBarService.openSnackBar('Please check your email for reset link!!', this.constantService.snackbarType.SUCCESS, 2500);
              this.router.navigateByUrl('/');
            });
      }

      
      forgotPassword($event: any){
        this.isForgotPassword = true;
      }

      switchToLogin($event: any){
        this.isForgotPassword = false;
      }
    
      onReset(): void {
        this.submitted = false;
        this.loginForm.reset();
      }

}