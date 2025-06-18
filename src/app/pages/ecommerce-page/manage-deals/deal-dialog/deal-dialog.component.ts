import { Component, OnInit, Inject, OnDestroy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

import jsonDoc from './doc';
import { Brand, Category, DealDataItem, DealType, Merchant, PostDealItem } from '@app/services/deals.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DealsStoreService } from '@app/services/store/deals-store.service';

@Component({
    selector: 'app-deal-dialog',
    standalone:true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule,
          MatDatepickerModule, MatFormFieldModule, MatSelectModule, MatDialogModule,
        MatAutocompleteModule, MatProgressBarModule, MatProgressSpinnerModule,
        MatNativeDateModule, MatCheckboxModule,
        MatIconModule, MatButtonModule, MatInputModule],
    templateUrl: './deal-dialog.component.html',
    styleUrls: ['./deal-dialog.component.scss']
})
export class DealDialogComponent implements OnInit, OnDestroy {

  editordoc = jsonDoc;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];


  public dealFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  actionInProgress$!: Observable<any>;
  title = 'Share New Deal';
  buttonTitle = 'POST A DEAL';
  countries = [
    { viewValue: 'INDIA', value: 'india' },
    { viewValue: 'USA', value: 'usa' }
  ];

  discountTypes = [
    { viewValue: '%', value: '%' },
    { viewValue: '$', value: '$' },
    { viewValue: '₹', value: '₹' }
  ];

  highlightColors = [
    { viewValue: 'green', value: '#009639' },
    { viewValue: 'red', value: '#CC0C39' },
    { viewValue: 'orange', value: '#ff6400' },
    { viewValue: 'yellow', value: '#fbf5d6' },
    { viewValue: 'blue', value: '#189ad3' },
    { viewValue: 'dark-blue', value: '#131921' },
    { viewValue: 'dark-gray', value: '#3d3c3a' }
    
  ];
  
  dealTypes: Array<DealType> = [];
  categories: Array<Category> = [];
  filteredCategories: Array<Category> = [];
  brands: Array<Brand> = [];
  filteredBrands: Array<Brand> = [];
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
  private dealsStoreService: DealsStoreService = inject(DealsStoreService);

  constructor(public dialogRef: MatDialogRef<DealDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: UntypedFormBuilder) { 
                // this.actionInProgress$ = this.dealsFacade.actionInProgress$;
              
                // this.subs.push(this.dealsFacade.brands$.subscribe((brands: Array<Brand>) => {
                //   this.brands = [...brands.filter(bd => bd.code !== 'All')];
                //   this.filteredBrands = [...brands.filter(bd => bd.code !== 'All')]
                // }));
                // this.subs.push(this.dealsFacade.merchants$.subscribe((merchants: Array<Merchant>) => {
                //   this.merchants = [...merchants];
                //   this.filteredMerchants = [...merchants];
                // }));
                // this.subs.push(this.dealsFacade.categories$.subscribe((cats: Array<Category>) => {
                //   this.categories = [...cats.filter(ca => ca.code !== 'All')];
                //   this.filteredCategories = [...cats.filter(ca => ca.code !== 'All')];
                // }));
                this.dealTypes = this.dealsStoreService.getDealTypes()();
                this.categories = this.dealsStoreService.getCategories()();
                this.filteredCategories = this.dealsStoreService.getCategories()();
                this.brands = this.dealsStoreService.getBrands()();
                this.filteredBrands = this.dealsStoreService.getBrands()();
                 this.merchants = this.dealsStoreService.getMerchants()();
                this.filteredMerchants = this.dealsStoreService.getMerchants()();


                // this.subs.push(this.dealsFacade.dealTypes$.subscribe((dTypes: Array<DealType>) => {
                //   this.dealTypes = [...dTypes.filter(dt => dt.code !== 'ALL')];
                // }));

               
              }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());  
    this.editor.destroy();  
  }
  ngOnInit(): void {   

    this.dealFormGroup = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      dealUrl: new FormControl('', Validators.required),
      startDate: new FormControl(new Date().toString()),
      endDate: new FormControl(new Date().toString()),
      highlight: new FormControl(''),
      highlightColor: new FormControl(''),
      originalPrice: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      currentPrice: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      discount: new FormControl(null, [Validators.required, Validators.min(0)]),
      discountType: new FormControl(null, [Validators.required]),
      active: new FormControl(false),
      approved: new FormControl(false),
      country: new FormControl('', Validators.required),
      city: new FormControl(''),
      pinCode: new FormControl(''),
      merchant: new FormControl(''),
      type: new FormControl('', [Validators.required]),
      category: new FormControl('', Validators.required),
      brand: new FormControl(''),
      expired: new FormControl(false)
    }); 
    this.editor = new Editor();
    // this.subs.push(this.dealFormGroup.get("merchant").valueChanges.subscribe(x => {
    //    this.filteredMerchants = [...this.merchantFilter(x)];
    // }))

    // this.subs.push(this.dealFormGroup.get("brand").valueChanges.subscribe(x => {
    //   this.filteredBrands = [...this.brandFilter(x)];
    // }))

  const merchantControl = this.dealFormGroup.get('merchant');
  if (merchantControl) {
    this.subs.push(
      merchantControl.valueChanges.subscribe(value => {
        this.filteredMerchants = [...this.merchantFilter(value)];
      })
    );
  }

  const categoryControl = this.dealFormGroup.get('category');
  if (categoryControl) {
    this.subs.push(
      categoryControl.valueChanges.subscribe(value => {
        this.filteredCategories = [...this.categoriesFilter(value)];
      })
    );
  }

  const brandsControl = this.dealFormGroup.get('brand');
  if (brandsControl) {
    this.subs.push(
      brandsControl.valueChanges.subscribe(value => {
        this.filteredBrands = [...this.brandFilter(value)];
      })
    );
  }


    // this.subs.push(this.dealFormGroup.get("dealUrl").valueChanges.pipe(debounceTime(1000)).subscribe(res => {
    //   this.getDealActionInProgress = true;
    // }));
    if(this.data.deal && this.data.deal.id){
      this.title = 'Edit Deal';
      this.buttonTitle = 'UPDATE DEAL';
      
      this.dealFormGroup.controls['title'].setValue(this.data.deal.title);
      this.dealFormGroup.controls['description'].setValue(this.data.deal.description);
      this.dealFormGroup.controls['imageUrl'].setValue(this.data.deal.imageUrl);
      this.dealFormGroup.controls['dealUrl'].setValue(this.data.deal.dealUrl);
      this.dealFormGroup.controls['startDate'].setValue(new Date(this.data.deal.startDate));
      this.dealFormGroup.controls['endDate'].setValue(new Date(this.data.deal.endDate));
      this.dealFormGroup.controls['highlight'].setValue(this.data.deal.highlight);
      this.dealFormGroup.controls['highlightColor'].setValue(this.data.deal.highlightColor);
      this.dealFormGroup.controls['originalPrice'].setValue(this.data.deal.originalPrice);
      this.dealFormGroup.controls['currentPrice'].setValue(this.data.deal.currentPrice);
      this.dealFormGroup.controls['discount'].setValue(this.data.deal.discount);
      this.dealFormGroup.controls['discountType'].setValue(this.data.deal.discountType);
      this.dealFormGroup.controls['active'].setValue(this.data.deal.active);
      this.dealFormGroup.controls['approved'].setValue(this.data.deal.approved);
      this.dealFormGroup.controls['country'].setValue(this.data.deal.country);
      this.dealFormGroup.controls['city'].setValue(this.data.deal.city);
      this.dealFormGroup.controls['pinCode'].setValue(this.data.deal.pinCode);
      this.dealFormGroup.controls['merchant'].setValue(
        this.data.deal.merchant
      );
      this.dealFormGroup.controls['category'].setValue(this.data.deal.category);
      this.dealFormGroup.controls['type'].setValue(this.data.deal.tags?this.data.deal.tags.split(','):[]);
      this.dealFormGroup.controls['brand'].setValue(this.data.deal.brand);
      this.dealFormGroup.controls['expired'].setValue(this.data.deal.expired);
    }else{
      this.title = 'New Deal';
    };
  }

  submitForm($event: any){
    $event.stopPropagation();

    console.log(this.dealFormGroup.value);
    if(this.dealFormGroup.valid){

      let newDeal: DealDataItem = new DealDataItem();
      newDeal.id = this.data.deal.id?this.data.deal.id:undefined;
      newDeal.title = this.dealFormGroup.controls['title'].value;
      newDeal.description = this.dealFormGroup.controls['description'].value;
      debugger;
      newDeal.imageUrl = this.dealFormGroup.controls['imageUrl'].value;
      newDeal.dealUrl = this.dealFormGroup.controls['dealUrl'].value;
      newDeal.postedBy = 'Admin';
      // newDeal.postedBy = this.authFacde.getUserName();
      newDeal.postedDate = new Date().toDateString();
      let sDate = new Date(this.dealFormGroup.controls['startDate'].value.toDateString());
      newDeal.startDate = (sDate.getMonth() + 1).toString().padStart(2, "0") + "/" + sDate.getDate().toString().padStart(2, "0") + "/" + sDate.getFullYear();
      let eDate = new Date(this.dealFormGroup.controls['endDate'].value.toDateString());
      newDeal.endDate = (eDate.getMonth() + 1).toString().padStart(2, "0") + "/" + eDate.getDate().toString().padStart(2, "0") + "/" + eDate.getFullYear();;
      newDeal.highlight = this.dealFormGroup.controls['highlight'].value;
      newDeal.highlightColor = this.dealFormGroup.controls['highlightColor'].value;
      newDeal.originalPrice = this.dealFormGroup.controls['originalPrice'].value;
      newDeal.currentPrice = this.dealFormGroup.controls['currentPrice'].value;
      newDeal.discount = this.dealFormGroup.controls['discount'].value;
      newDeal.discountType = this.dealFormGroup.controls['discountType'].value;
      newDeal.active = this.dealFormGroup.controls['active'].value;
      newDeal.approved = this.dealFormGroup.controls['approved'].value;
      newDeal.country = this.dealFormGroup.controls['country'].value;
      newDeal.city = this.dealFormGroup.controls['city'].value;
      newDeal.pinCode = this.dealFormGroup.controls['pinCode'].value;
      newDeal.merchant = this.dealFormGroup.controls['merchant'].value;
      newDeal.brand = this.dealFormGroup.controls['brand'].value;
      newDeal.expired = this.dealFormGroup.controls['expired'].value;
      newDeal.category = this.dealFormGroup.controls['category'].value;
      newDeal.tags = this.dealFormGroup.controls['type'].value?this.dealFormGroup.controls['type'].value.join(','):'';
            // + ',' +  this.dealFormGroup.controls['category'].value;

      this.dialogRef.close(newDeal);
    }
  }

  inputChangeHandler($event: any){
    // this.filteredMerchants = this.merchants.filter(m => m.title.indexOf($event.value));
  

  }


  merchantFilter(value: string): Merchant[] {
    let filterValue = value.toLowerCase();

    return this.merchants.filter(m => m.title.toLowerCase().includes(filterValue));
  }

  brandFilter(value: string): Brand[] {
    let filterValue = value.toLowerCase();

    return this.brands.filter(b => b.title.toLowerCase().includes(filterValue));
  }

  categoriesFilter(value: string): Category[] {
    let filterValue = value.toLowerCase();

    return this.categories.filter(c => c.title.toLowerCase().includes(filterValue));
  }

  public compareFunction(o1: any, o2: any) {
    return (o1.name == o2.name && o1.code == o2.code);
  }

   
}
