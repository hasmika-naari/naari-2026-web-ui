import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RegisterRequest } from '@app/services/auth.models';
import { AuthService } from '@app/services/auth.service';
import { ActivationCodeSubmitRequest } from '@app/services/signup.model';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import Validation from '@app/services/utilities/validation';

@Component({
    selector: 'app-register-page',
    imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule,
        NgOptimizedImage],
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    isBrowser!: boolean;
    registrationSubmitted = false;
    activationSubmitted = false;
    showActivationForm = false;
    private router: Router= inject(Router);
    
    public registerForm: FormGroup = new FormGroup({
        fullname: new FormControl(''),
        username: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
        acceptTerms: new FormControl(false),
      });

    public activationForm: FormGroup = new FormGroup({
        username: new FormControl(''),
        code: new FormControl(''),
    });
      
    private formBuilder: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);

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
        this.registerForm = this.formBuilder.group(
            {
              username: [
                '',
                [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(20),
                ],
              ],
              email: ['', [Validators.required, Validators.email]],
              password: [
                '',
                [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(40),
                ],
              ],
              confirmPassword: ['', Validators.required],
            //   acceptTerms: [false, Validators.requiredTrue],
            },
            {
              // validators: [Validation.match('password', 'confirmPassword')],
            }
          );
          this.activationForm = this.formBuilder.group(
            {
              username: [
                '',
                [
                  Validators.required,
                ],
              ],
              code: [
                '',
                [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(6),
                ],
              ],
            }
          );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.registerForm.controls;
      }
      get af(): { [key: string]: AbstractControl } {
        return this.activationForm.controls;
      }
    
      onSubmit(): void {
        this.registrationSubmitted = true;
        //consolie.log('onSubmit - 1');
        if (this.registerForm.invalid) {
          return;
        }
        //consolie.log('onSubmit - 2');

        let registerRequest = new RegisterRequest();
        registerRequest.login = this.registerForm.value.username; 
        registerRequest.email = this.registerForm.value.email; 
        registerRequest.password = this.registerForm.value.password;
        registerRequest.langKey = "en";
        this.authService.signUp(registerRequest).subscribe((resp) => {
            this.activationForm.controls['username'].setValue(this.registerForm.value.username);
            this.activationForm.controls['username'].disable();

            this.showActivationForm = true;
        }, (error) => {

        });
        //consolie.log('onSubmit - 3');
    
        //consolie.log(JSON.stringify(this.registerForm.value.username, null, 2));
      }

      onActivationSubmit(){
        this.activationSubmitted = true;
        let activationCodeSubmitReqest: ActivationCodeSubmitRequest = new ActivationCodeSubmitRequest();
        activationCodeSubmitReqest.activationCode = this.activationForm.controls['code'].value; 
        activationCodeSubmitReqest.username = this.activationForm.controls['username'].value; 

        this.authService.submitActivationCode(activationCodeSubmitReqest).subscribe((resp) => {
                this.router.navigate(['/login']); 
           
        }, (error) => {
            
        });
      }
    
      onReset(): void {
        this.registrationSubmitted = false;
        this.registerForm.reset();
      }

}