import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DealsStoreFacade } from '@app/core/store/deals/deals-store.facade';
import { Brand, Category, DealDataItem, DealType } from '@app/core/store/deals/deals.model';

@Component({
  selector: 'app-merchant-details',
  templateUrl: './merchant-details.component.html',
  styleUrls: ['./merchant-details.component.scss']
})
export class MerchantDetailsComponent implements OnInit {
  public dealFormGroup: UntypedFormGroup;
  actionInProgress$: Observable<any>;
  title = 'New Deal';

  countries = [
    { viewValue: 'IN', value: 'IN' },
    { viewValue: 'US', value: 'US' }
  ];

  discountTypes = [
    { viewValue: '%', value: '%' },
    { viewValue: '$', value: '$' },
    { viewValue: '₹', value: '₹' }
  ];
  
  dealTypes$: Observable<Array<DealType>>;
  selectedDeal: DealDataItem;
  categories$: Observable<Array<Category>>;
  brands$: Observable<Array<Brand>>;
  subs:Array<Subscription> = new Array<Subscription>();

  constructor(
            
              public dealsFacade: DealsStoreFacade,
              public fb: UntypedFormBuilder) { 
                this.actionInProgress$ = this.dealsFacade.actionInProgress$;
                this.dealTypes$ = this.dealsFacade.dealTypes$;
                this.categories$ = this.dealsFacade.categories$;
                this.brands$ = this.dealsFacade.brands$;
                this.subs.push(this.dealsFacade.selectedDeal$.subscribe(sd => {
                  this.selectedDeal = sd;
                }));

              }

  ngOnInit(): void {   
    this.dealFormGroup = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      dealUrl: new FormControl('', Validators.required),
      startDate: new FormControl(new Date().toString(), Validators.required),
      endDate: new FormControl(new Date().toString(), Validators.required),
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
      merchant: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      brand: new FormControl(''),
      expired: new FormControl(false)
    }); 

    if(this.selectedDeal && this.selectedDeal.id){
      this.title = 'Edit Deal';

      this.dealFormGroup.controls['title'].setValue(this.selectedDeal.title);
      this.dealFormGroup.controls['description'].setValue(this.selectedDeal.description);
      this.dealFormGroup.controls['imageUrl'].setValue(this.selectedDeal.imageUrl);
      this.dealFormGroup.controls['dealUrl'].setValue(this.selectedDeal.dealUrl);
      this.dealFormGroup.controls['startDate'].setValue(new Date(this.selectedDeal.startDate));
      this.dealFormGroup.controls['endDate'].setValue(new Date(this.selectedDeal.endDate));
      this.dealFormGroup.controls['originalPrice'].setValue(this.selectedDeal.originalPrice);
      this.dealFormGroup.controls['currentPrice'].setValue(this.selectedDeal.currentPrice);
      this.dealFormGroup.controls['discount'].setValue(this.selectedDeal.discount);
      this.dealFormGroup.controls['discountType'].setValue(this.selectedDeal.discountType);
      this.dealFormGroup.controls['active'].setValue(this.selectedDeal.active);
      this.dealFormGroup.controls['approved'].setValue(this.selectedDeal.approved);
      this.dealFormGroup.controls['country'].setValue(this.selectedDeal.country);
      this.dealFormGroup.controls['city'].setValue(this.selectedDeal.city);
      this.dealFormGroup.controls['pinCode'].setValue(this.selectedDeal.pinCode);
      this.dealFormGroup.controls['merchant'].setValue(
        this.selectedDeal.merchant
      );
      this.dealFormGroup.controls['category'].setValue(this.selectedDeal.category);
      this.dealFormGroup.controls['type'].setValue(this.selectedDeal.tags);
      this.dealFormGroup.controls['brand'].setValue(this.selectedDeal.brand);
      this.dealFormGroup.controls['expired'].setValue(this.selectedDeal.expired);
    }else{
      this.title = 'New Deal';
    };
  }

  submitForm($event){
    $event.stopPropagation();

    //consolie.log(this.dealFormGroup.value);
    if(this.dealFormGroup.valid){

      let newDeal: DealDataItem = new DealDataItem();
      newDeal.id = undefined;
      newDeal.title = this.dealFormGroup.controls['title'].value;
      newDeal.description = this.dealFormGroup.controls['description'].value;
      newDeal.imageUrl = this.dealFormGroup.controls['imageUrl'].value;
      newDeal.dealUrl = this.dealFormGroup.controls['dealUrl'].value;
      newDeal.postedBy = 'Admin';
      // newDeal.postedBy = this.authFacde.getUserName();
      newDeal.postedDate = new Date().toDateString();
      newDeal.startDate = this.dealFormGroup.controls['startDate'].value.toDateString();;
      newDeal.endDate = this.dealFormGroup.controls['endDate'].value.toDateString();;
      newDeal.originalPrice = this.dealFormGroup.controls['originalPrice'].value;
      newDeal.currentPrice = this.dealFormGroup.controls['currentPrice'].value;
      newDeal.discount = this.dealFormGroup.controls['discount'].value;
      newDeal.discountType = this.dealFormGroup.controls['discountType'].value;
      newDeal.active = this.dealFormGroup.controls['active'].value ? "activated" : "not-activated";
      newDeal.approved = this.dealFormGroup.controls['approved'].value;
      newDeal.country = this.dealFormGroup.controls['country'].value;
      newDeal.city = this.dealFormGroup.controls['city'].value;
      newDeal.pinCode = this.dealFormGroup.controls['pinCode'].value;
      newDeal.merchant = this.dealFormGroup.controls['merchant'].value;
      newDeal.brand = this.dealFormGroup.controls['brand'].value;
      newDeal.expired = this.dealFormGroup.controls['expired'].value;
      
      newDeal.tags = this.dealFormGroup.controls['type'].value + ',' + 
                      this.dealFormGroup.controls['category'].value;

    }
  }

  public compareFunction(o1: any, o2: any) {
    return (o1.name == o2.name && o1.code == o2.code);
  }

}
