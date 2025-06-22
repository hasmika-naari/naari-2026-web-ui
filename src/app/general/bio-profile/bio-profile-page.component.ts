import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, Signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AppConstantsService } from '@app/services/app-constants.service';
import { AuthService } from '@app/services/auth.service';
import { Account, LoginProfile } from '@app/services/profile.model';
import { ActivationCodeSubmitRequest, BioProfileAddRequest, RegisterRequest } from '@app/services/signup.model';
import { UserStoreService } from '@app/services/store/user-store.service';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { YeaSnackBarService } from '@app/services/utilities/snackbar';
import Validation from '@app/services/utilities/validation';

@Component({
    selector: 'app-register-page',
    imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule,
        NgOptimizedImage],
    templateUrl: './bio-profile-page.component.html',
    styleUrls: ['./bio-profile-page.component.scss']
})
export class BioProfilePageComponent implements OnInit {

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    isBrowser!: boolean;
    bioProfileSubmitted = false;
    private router: Router= inject(Router);
    
    public bioProfileForm: FormGroup = new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      dob: new FormControl(''),
      gender: new FormControl(''),
      imageurl: new FormControl(''),
      phonenumber: new FormControl(''),
      });

    private formBuilder: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);
    private userStore: UserStoreService = inject(UserStoreService);
    private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
    private constantService: AppConstantsService  = inject(AppConstantsService);

    userAccount: Signal<Account> = this.userStore.getUserAccount();
    
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

    ngOnInit(): void {
      this.bioProfileForm = this.formBuilder.group(
          {
            firstname: [
              '',
              [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20),
              ],
            ],
            lastname: [
              '',
              [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20),
              ],
            ],
            dob: ['', [Validators.required]],
            gender: ['-1', [Validators.required]],
            phonenumber: ['', [Validators.required]],
            // imageurl: ['', [Validators.required]],
            validators: [Validation.match('password', 'confirmPassword')],
          }
      );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.bioProfileForm.controls;
      }
   
    
      onSubmit(): void {
        this.bioProfileSubmitted = true;
        //consolie.log('onSubmit - 1');
        if (this.bioProfileForm.invalid) {
          return;
        }
        //consolie.log('onSubmit - 2');

        let bioRequest = new BioProfileAddRequest();
        bioRequest.userName =  'username'; // load from the login account 
        bioRequest.firstName = this.bioProfileForm.value.firstname; 
        bioRequest.lastName = this.bioProfileForm.value.lastname;
        bioRequest.dob = this.bioProfileForm.value.dob;
        bioRequest.gender = this.bioProfileForm.value.gender;
        bioRequest.imageUrl = "assets/img/appicon.svg";

        this.authService.saveBioProfile(bioRequest).subscribe((resp) => {
          //consolie.log('Save Bio Profile' + resp);
          this.snackBarService.openSnackBar('Bio Profile Saved Successful!! ', this.constantService.snackbarType.SUCCESS, 3000);
          this.router.navigate(['/']);
        });

        // let loginProfile : LoginProfile = Object.assign({},this.profile.login);
        // loginProfile.phoneNumber = this.bioProfileForm.value.phonenumber;
        // this.authService.saveLoginProfile(bioRequest).subscribe((resp) => {
        // });
        //consolie.log(JSON.stringify(this.bioProfileForm.value, null, 2));
      }

      onCancel(): void {
        
        this.router.navigate(['/']);
      }

}