import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ActivationCodeSubmitRequest, RegisterRequest } from '@app/services/signup.model';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-activate-account-page',
    imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule,
        NgOptimizedImage],
    templateUrl: './activate-account-page.component.html',
    styleUrls: ['./activate-account-page.component.scss']
})
export class ActivateAccountPageComponent implements OnInit {

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    isBrowser!: boolean;
    activationSubmitted = false;
    showActivationForm = false;
    private router: Router= inject(Router);
    private route: ActivatedRoute =  inject(ActivatedRoute);
  
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
      const userName = this.route.snapshot.queryParams['userName'];
      const activationCode = this.route.snapshot.queryParams['activationCode'];
          this.activationForm = this.formBuilder.group(
            {
              username: [
                userName,
                [
                  Validators.required,
                ],
              ],
              code: [
                activationCode,
                [
                  Validators.required,
                ],
              ],
            }
          );
    }

      get af(): { [key: string]: AbstractControl } {
        return this.activationForm.controls;
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
   

}