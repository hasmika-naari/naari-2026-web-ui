import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';

import jsonDoc from './doc';
import { AmazonDealDataRequestItem, Category, DealType, Merchant, PostDealItem } from '@app/services/deals.model';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-amazon-deal-dialog',
    imports: [CommonModule, MatSelectModule, MatDatepickerModule, MatAutocompleteModule, MatProgressBarModule, ReactiveFormsModule],
    templateUrl: './amazon-deal-dialog.component.html',
    styleUrls: ['./amazon-deal-dialog.component.scss']
})
export class AmazonDealDialogComponent implements OnInit, OnDestroy {

  public amazonDealFormGroup!: UntypedFormGroup;
  actionInProgress$!: Observable<any>;
  title = 'Load Amazon Deals';
  buttonTitle = 'Load Deals';

  countries = [
    { viewValue: 'USA', value: 'usa' },
    { viewValue: 'INDIA', value: 'india' }
  ];

  marketPlaces = [
    { viewValue: 'AMAZON-USA', value: 'www.amazon.com' },
    { viewValue: 'AMAZON-IN', value: 'www.amazon.in' }
  ];

  partnerTags = [
    { viewValue: 'NaariDeals-USA', value: 'naarideals00-20' },
    { viewValue: 'Naarideals-IN', value: 'naarideals00-21' }
  ];

  searchIndex = [
    { viewValue: 'All Departments', value: 'All' },
    { viewValue: 'Prime Video', value: 'AmazonVideo' },
    { viewValue: 'Clothing & Accessories', value: 'Apparel' },
    { viewValue: 'Appliances', value: 'Appliances' },
    { viewValue: 'Arts, Crafts & Sewing', value: 'ArtsAndCrafts' },
    { viewValue: 'Automotive Parts & Accessories', value: 'Automotive' },
    { viewValue: 'Baby', value: 'Baby' },
    { viewValue: 'Beauty & Personal Care', value: 'Beauty' },
    { viewValue: 'Books', value: 'Books' },
    { viewValue: 'Classical', value: 'Classical' },
    { viewValue: 'Collectibles & Fine Art', value: 'Collectibles' },
    { viewValue: 'Computers', value: 'Computers' },
    { viewValue: 'Digital Music', value: 'DigitalMusic' },
    { viewValue: 'Digital Educational Resources', value: 'DigitalEducationalResources' },
    { viewValue: 'Electronics', value: 'Electronics' },
    { viewValue: 'Everything Else', value: 'EverythingElse' },
    { viewValue: 'Clothing, Shoes & Jewelry', value: 'Fashion' },
    { viewValue: 'Clothing, Shoes & Jewelry Baby', value: 'FashionBaby' },
    { viewValue: 'Clothing, Shoes & Jewelry Girls', value: 'FashionGirls' },
    { viewValue: 'Clothing, Shoes & Jewelry Women', value: 'FashionWomen' },
    { viewValue: 'Garden & Outdoor', value: 'GardenAndOutdoor' },
    { viewValue: 'Gift Cards', value: 'GiftCards' },
    { viewValue: 'Grocery & Gourmet Food', value: 'GroceryAndGourmetFood' },
    { viewValue: 'Handmade', value: 'Handmade' },
    { viewValue: 'Health, Household & Baby Care', value: 'HealthPersonalCare' },
    { viewValue: 'Home & Kitchen', value: 'HomeAndKitchen' },
    { viewValue: 'Industrial & Scientific', value: 'Industrial' },
    { viewValue: 'Jewelry', value: 'Jewelry' },
    { viewValue: 'Kindle Store', value: 'KindleStore' },
    { viewValue: 'Home & Business Services', value: 'LocalServices' },
    { viewValue: 'Luggage & Travel Gear', value: 'Luggage' },
    { viewValue: 'Luxury Beauty', value: 'LuxuryBeauty' },
    { viewValue: 'Magazine Subscriptions', value: 'Magazines' },
    { viewValue: 'Cell Phones & Accessories', value: 'MobileAndAccessories' },
    { viewValue: 'Apps & Games', value: 'MobileApps' },
    { viewValue: 'Movies & TV', value: 'MoviesAndTV' },
    { viewValue: 'CDs & Vinyl', value: 'Music' },
    { viewValue: 'Musical Instruments', value: 'MusicalInstruments' },
    { viewValue: 'Office Products', value: 'OfficeProducts' },
    { viewValue: 'Camera & Photo', value: 'Photo' },
    { viewValue: 'Shoes', value: 'Shoes' },
    { viewValue: 'Software', value: 'Software' },
    { viewValue: 'Sports & Outdoors', value: 'SportsAndOutdoors' },
    { viewValue: 'Tools & Home Improvement', value: 'ToolsAndHomeImprovement' },
    { viewValue: 'Toys & Games', value: 'ToysAndGames' },
    { viewValue: 'VHS', value: 'VHS' },
    { viewValue: 'Video Games', value: 'VideoGames' },
    { viewValue: 'Watches', value: 'Watches' }
  ];
  
  dealTypes: Array<DealType> = [];
  categories: Array<Category> = [];
  filteredCategories: Array<Category> = [];
  merchants: Array<Merchant> = []
  filteredMerchants:  Array<Merchant> = []
  
  subs: Array<Subscription> = [];
  getDealActionInProgress: boolean = false;
  postDealItems: Array<PostDealItem> = [
    {
      title: 'Deal URL',
      valid: 1
    },
    {
      title: 'Deal Title',
      valid: 1
    },
    {
      title: 'Description',
      valid: 0
    },
    {
      title: 'Deal Type',
      valid: 0
    },
    {
      title: 'Deal Category',
      valid: 0
    },
    {
      title: 'Image URL',
      valid: 0
    },
    {
      title: 'Country',
      valid: 0
    },
    {
      title: 'Current Price',
      valid: 0
    },
    {
      title: 'Original Price',
      valid: 0
    },
    {
      title: 'Discount',
      valid: 0
    },
    {
      title: 'Discount Type',
      valid: 0
    },
    {
      title: 'Stores',
      valid: 0
    },
   
  
  ];

  constructor(public dialogRef: MatDialogRef<AmazonDealDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: UntypedFormBuilder) { 
                // this.actionInProgress$ = this.dealsFacade.actionInProgress$;
              
                // this.subs.push(this.dealsFacade.merchants$.subscribe((merchants: Array<Merchant>) => {
                //   this.merchants = [...merchants];
                //   this.filteredMerchants = [...merchants];
                // }));
                // this.subs.push(this.dealsFacade.categories$.subscribe((cats: Array<Category>) => {
                //   this.categories = [...cats.filter(ca => ca.code !== 'All')];
                //   this.filteredCategories = [...cats.filter(ca => ca.code !== 'All')];
                // }));
            
                // this.subs.push(this.dealsFacade.dealTypes$.subscribe((dTypes: Array<DealType>) => {
                //   this.dealTypes = [...dTypes.filter(dt => dt.code !== 'ALL')];
                // }));

               
              }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());  
  }
  ngOnInit(): void {   

    this.amazonDealFormGroup = this.fb.group({
      keywords: new FormControl('', Validators.required),
      searchIndex: new FormControl('', Validators.required),
      minSavingPercent: new FormControl(null, [Validators.required, Validators.min(0)]),
      maxPrice: new FormControl(''),
      partnerTag: new FormControl('', Validators.required),
      marketplace: new FormControl('', Validators.required),
      validDays: new FormControl('', Validators.required),
      type: new FormControl('', [Validators.required]),
      category: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      numPages: new FormControl('', Validators.required)
    }); 

    // this.subs.push(this.amazonDealFormGroup.get("category").valueChanges.subscribe(x => {
    //   this.filteredCategories = [...this.categoriesFilter(x)];
    // } ))
 
  }

  submitForm($event: any){
    $event.stopPropagation();

    //consolie.log(this.amazonDealFormGroup.value);
    if(this.amazonDealFormGroup.valid){

      let amazonAPIRequest: AmazonDealDataRequestItem = new AmazonDealDataRequestItem();
      amazonAPIRequest.keywords = this.amazonDealFormGroup.controls['keywords'].value;
      amazonAPIRequest.searchIndex = this.amazonDealFormGroup.controls['searchIndex'].value;
      amazonAPIRequest.minSavingPercent = this.amazonDealFormGroup.controls['minSavingPercent'].value;
      amazonAPIRequest.maxPrice = this.amazonDealFormGroup.controls['maxPrice'].value;
      amazonAPIRequest.validDays = this.amazonDealFormGroup.controls['validDays'].value;
      amazonAPIRequest.tags = this.amazonDealFormGroup.controls['type'].value?this.amazonDealFormGroup.controls['type'].value.join(','):'';
      amazonAPIRequest.category = this.amazonDealFormGroup.controls['category'].value;
      amazonAPIRequest.country = this.amazonDealFormGroup.controls['country'].value;
      amazonAPIRequest.partnerTag = this.amazonDealFormGroup.controls['partnerTag'].value;
      amazonAPIRequest.marketplace = this.amazonDealFormGroup.controls['marketplace'].value;
      amazonAPIRequest.numPages = this.amazonDealFormGroup.controls['numPages'].value;

      let sDate = new Date(this.amazonDealFormGroup.controls['startDate'].value);
      amazonAPIRequest.startDate = (sDate.getMonth() + 1).toString().padStart(2, "0") + "/" + sDate.getDate().toString().padStart(2, "0") + "/" + sDate.getFullYear();
      //  = 
      this.dialogRef.close(amazonAPIRequest);
    }
  }

  categoriesFilter(value: string): Category[] {
    let filterValue = value.toLowerCase();

    return this.categories.filter(c => c.title.toLowerCase().includes(filterValue));
  }

  inputChangeHandler($event: any){
    // this.filteredMerchants = this.merchants.filter(m => m.title.indexOf($event.value));

  }

   
}
