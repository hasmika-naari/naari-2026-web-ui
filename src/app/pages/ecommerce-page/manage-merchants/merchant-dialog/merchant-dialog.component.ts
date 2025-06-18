import { Component, OnInit, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import { DealsStoreFacade } from '@app/core/store/deals/deals-store.facade';
import { Brand, Category, DealDataItem, DealType, Merchant, PostDealItem, SocialLinks } from '@app/core/store/deals/deals.model';
import { MatSelectChange } from '@angular/material/select';
import { HttpHeaders } from '@angular/common/http';
import { AppConstantsService } from '@app/core/providers/constants';
import { UploadService } from '@app/shared/module/file-upload/upload.service';

const TOKEN_HEADER_KEY = 'Authorization';


@Component({
  selector: 'app-merchant-dialog',
  templateUrl: './merchant-dialog.component.html',
  styleUrls: ['./merchant-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantDialogComponent implements OnInit, OnDestroy {
  public merchantFormGroup: UntypedFormGroup;
  actionInProgress$: Observable<any>;
  title = 'Merchant';
  buttonTitle = 'ADD MERCHANT';
  countries = [
    { viewValue: 'INDIA', value: 'india' },
    { viewValue: 'USA', value: 'usa' },
    { viewValue: 'USA & India', value: 'india-usa' }
  ];
  file : File
  fileName : string = ''
 
  dealTypes: Array<DealType> = [];
  categories: Array<Category> = [];
  filteredCategories: Array<Category> = [];
  brands: Array<Brand> = [];
  filteredBrands: Array<Brand> = [];
  merchants: Array<Merchant> = []
  filteredMerchants:  Array<Merchant> = []
  
  subs: Array<Subscription> = [];
  getDealActionInProgress: boolean = false;
  cities: Array<any> = [];
  public headers : HttpHeaders = new HttpHeaders();
  profileUploadUrl = '';
  imageUrl:string = ''
  merchantImage : any
  deletedSocialLinks : Array<SocialLinks> = []

  IndiaCities : Array<any> = [
    { viewValue: 'All States', value: 'all' }, 
    { viewValue: 'Mumbai', value: 'mumbai' }, 
    { viewValue: 'Hyderbad', value: 'hyderbad' }, 
    { viewValue: 'Delhi', value: 'delhi' }, 
    { viewValue: 'Banglore', value: 'banglore' }, 
    { viewValue: 'Chennai', value: 'chennai' }, 
    { viewValue: 'Kolkata', value: 'kolkata' }, 
    { viewValue: 'Noida', value: 'noida' }
  ];
  USACities : Array<any> = 
    [
      { viewValue: 'All States', value: 'all' },
      { viewValue: 'New York', value: 'newyork' },
      { viewValue: 'Washington DC', value: 'washingtondc' },
      { viewValue: 'New Jersey', value: 'newjersey' },
      { viewValue: 'Atlanta', value: 'Atlanta' },
      { viewValue: 'Texas', value: 'texas' }
    ];

  types : Array<any> = [
    { viewValue: 'Boutique Online', value: 'BOUTIQUE_ONLINE' },
    { viewValue: 'Boutique InStore', value: 'BOUTIQUE_INSTORE' },
    { viewValue: 'Boutique Online & InStore', value: 'BOUTIQUE_INSTORE_ONLINE' },
    { viewValue: 'Online Only' , value: 'ONLINE_ONLY' },
    { viewValue: 'Online & In Store', value: 'ONLINE_STORE' },
    { viewValue: 'In Store', value: 'STORE_ONLY' },
    { viewValue: 'Beauty Parlour', value: 'BEAUTY_PARLOUR' },
    { viewValue: 'Jewellery', value: 'JEWELLERY' }
    ];

  socialTypes : Array<any>  = [
    { viewValue: 'Face Book', value: 'FACEBOOK' },
    { viewValue: 'Whats APP', value: 'WHATSAPP' },
    { viewValue: 'Instagram', value: 'INSTAGRAM' },
    { viewValue: 'Telegram', value: 'TELEGRAM' },
    { viewValue: 'Twitter', value: 'TWITTER' }
  ];
  
  constructor(public dialogRef: MatDialogRef<MerchantDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dealsFacade: DealsStoreFacade,
              public appConstants: AppConstantsService,
              private uploadService : UploadService,
              public fb: UntypedFormBuilder) { 
                this.actionInProgress$ = this.dealsFacade.actionInProgress$;
               
              }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());    
  }

  
  get socialLinks() {
    return this.merchantFormGroup.get('socialLinks') as FormArray;
  }

  set socialLinks(social) {
    this.merchantFormGroup['socialLinks'].value = social;
  }
  
  
  ngOnInit(): void {   

    this.merchantFormGroup = this.fb.group({
      title : [null, Validators.required],
      subTitle: [null],
      address: [null],
      imageUrl: [null], 
      type: [null, Validators.required],
      country: [null, Validators.required],
      city: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern('[- +()0-9]+') ]],
      location: [null, Validators.required],
      siteUrl: [null, Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$')],
      status: [null, Validators.required ],
      socialLinks: this.fb.array([  ]),
    }); 

    this.merchantFormGroup.controls['city'].disable();

    if(this.data.merchant && this.data.merchant.id){
      this.title = 'Edit Merchant';
      this.buttonTitle = 'UPDATE MERCHANT';
      
      this.merchantFormGroup.controls['title'].setValue(this.data.merchant.title);
      this.merchantFormGroup.controls['subTitle'].setValue(this.data.merchant.subTitle);
      this.merchantFormGroup.controls['address'].setValue(this.data.merchant.address);
      this.merchantFormGroup.controls['imageUrl'].setValue(this.data.merchant.imageUrl);
      this.merchantFormGroup.controls['location'].setValue(this.data.merchant.location);
      this.merchantFormGroup.controls['siteUrl'].setValue(this.data.merchant.siteUrl);
      this.merchantFormGroup.controls['type'].setValue(this.data.merchant.type);
      this.merchantFormGroup.controls['country'].setValue(this.data.merchant.country);
      if(this.data.merchant.imageUrl){
        this.imageUrl = 'https://naarideals.s3.amazonaws.com/merchant/' + this.data.merchant.id + '/' + this.data.merchant.imageUrl;
      }
      if(this.data.merchant.country == "india"){
        this.cities = [...this.IndiaCities];
      }
      else{
        this.cities = [...this.USACities];
      }
      this.merchantFormGroup.controls['city'].setValue(this.data.merchant.city);
      this.merchantFormGroup.controls['city'].enable();
      this.merchantFormGroup.controls['phone'].setValue(this.data.merchant.phone);
      this.merchantFormGroup.controls['status'].setValue(this.data.merchant.status === 'active'?true:false);
      if(this.data.merchant.socialLinks && this.data.merchant.socialLinks.length){
        const links = this.data.merchant.socialLinks as Array<SocialLinks>;
        const addSocial = this.merchantFormGroup.get('socialLinks') as FormArray;
            // url:  [e.url, [Validators.required, Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$')]],
        links.forEach((e)=>{
          addSocial.push(this.fb.group({
            type:  [e.type, Validators.required],
            url:  [e.url, Validators.required],
            status :  [e.status, Validators.required],
            title : [e.title],
            merchantId : [e.merchantId],
            id: e.id,
            action : ['UPDATE']
          }))
        })
      }
      this.merchantImage = 'https://naarideals.s3.amazonaws.com/merchant/' + this.data.merchant.id + '/' + this.data.merchant.imageUrl;
      // fetch(imgUrl)
      // .then(response => response.blob())
      // .then(blob => {
      //   this.merchantImage = blob
      // });
      
    }else{
      this.title = 'New Merchant';
    };
    this.headers = new HttpHeaders();
    let token: string = window.localStorage.getItem('nd-authToken');
    let tokenSplit = token.split('\\');
    let tempToken = token.replace("\\", "").replace("\\", "");
    let currentToken = tempToken.replace("\"", "").replace("\"", "");
    let cToken = this.appConstants.JWT_TOKEN;
    let bearer = "Bearer ";
    this.headers = this.headers.append(TOKEN_HEADER_KEY, bearer + cToken);
    this.profileUploadUrl = this.appConstants.BASE_AWS_API_URL +  '/api/aws-s3upload?path=merchant';
  }

  submitForm($event){
    $event.stopPropagation();

    console.log(this.merchantFormGroup.value);
    if(this.merchantFormGroup.valid){

      let merchant : Merchant = new Merchant();
      if(this.data.merchant && this.data.merchant.id){
        merchant.id = this.data.merchant.id;
      }
      merchant.code = "";
      merchant.address = this.merchantFormGroup.controls['address'].value;
      merchant.city = this.merchantFormGroup.controls['city'].value;
      merchant.country = this.merchantFormGroup.controls['country'].value;
      merchant.imageUrl = this.merchantFormGroup.controls['imageUrl'].value;
      merchant.location = this.merchantFormGroup.controls['location'].value;
      merchant.phone = this.merchantFormGroup.controls['phone'].value;
      merchant.siteUrl = this.merchantFormGroup.controls['siteUrl'].value;
      let soLinks:Array<any> = this.socialLinks.value;
        soLinks.forEach(sl => {
          sl.merchantId = this.data.merchant.id;
        })
        
      merchant.socialLinks =[...soLinks, ...this.deletedSocialLinks];
      merchant.status = this.merchantFormGroup.controls['status'].value?'active':'in-active';
      merchant.subTitle = this.merchantFormGroup.controls['subTitle'].value;
      merchant.title = this.merchantFormGroup.controls['title'].value;
      merchant.type = this.merchantFormGroup.controls['type'].value;
      debugger;
      // this.dealsFacade.createMerchant(merchant, this.fileName, this.file);
      const response = {
        merchant : merchant,
        fileName : this.fileName,
        file : this.file
      }

      this.dialogRef.close(response);
    }
  }

  inputChangeHandler($event){
    // this.filteredMerchants = this.merchants.filter(m => m.title.indexOf($event.value));

  }

  onCountrySelected(event: MatSelectChange) {
    this.merchantFormGroup.controls['city'].enable();
    // this.merchantFormGroup.controls['city'].setValue("");
    if(event.value == "india"){
      this.cities = [...this.IndiaCities];
    }
    else{
      this.cities = [...this.USACities];
    }
  }

  addSocialLink() {
    const addSocial = this.merchantFormGroup.get('socialLinks') as FormArray;
    addSocial.push(this.fb.group({
      type:  [null, Validators.required],
      url:  [null, [Validators.required]],
      // url:  [null, [Validators.required, Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$')]],
      status :  [null, Validators.required],
      title : '',
      merchantId : '',
      action : ['CREATE']
    }))
  }

  deleteSocialLink($event, i){
    const deletedLink : SocialLinks = this.socialLinks.at(i).value;
    if(deletedLink.id){
      deletedLink.action = 'DELETE';
      this.deletedSocialLinks = [...this.deletedSocialLinks, deletedLink];
    }
    this.socialLinks.removeAt(i);
  }

  isFormInValid(){
    let isSocialLinksValid = false;
    let soLinks: Array<any> = this.socialLinks.value;
    if(soLinks && soLinks.length){
      soLinks.forEach(sl => {
        if(sl.type){
          isSocialLinksValid = true;
        }
      })
    }
    return this.merchantFormGroup.invalid || isSocialLinksValid;
  }

  onUploadHandler($event){
    this.removeFile();
    this.file = $event.file;
    this.fileName = $event.fileName;
    this.merchantFormGroup.controls['imageUrl'].setValue(this.fileName);
    // Assuming the image file is stored in a variable named 'file'
    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      this.merchantImage = reader.result;
      // Do something with the blob
    };
  }

  removeFile(){
    if(this.data.merchant.id){
      const key = 'merchant/' + this.data.merchant.id + '/' + this.merchantFormGroup.controls['imageUrl'].value;
      this.uploadService.deleteFile(key);
    }
      this.fileName = "";
      this.file = null;
      this.merchantFormGroup.controls['imageUrl'].setValue("");
  }




}
