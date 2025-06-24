// ✅ Updated `PostDealComponent` with all functions retained
import {
  Component,
  effect,
  inject,
  Inject,
  makeStateKey,
  PLATFORM_ID,
  signal,
  Signal,
  TransferState
} from '@angular/core';
import {
  isPlatformBrowser,
  isPlatformServer,
  NgIf,
  NgFor
} from '@angular/common';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { FeathericonsModule } from '@app/icons/feathericons/feathericons.module';
import { DealsStoreService } from '@app/services/store/deals-store.service';
import { UserStoreService } from '@app/services/store/user-store.service';
import { DealsService } from '@app/services/deals.service';
import {
  CategoryListItem,
  Merchant
} from '@app/services/bee-compete.model';
import {
  Brand,
  Category,
  DealDataItem,
  DealType,
  PCategory,
  PostDealItem
} from '@app/services/deals.model';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-post-deal',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FeathericonsModule,
    NgxEditorModule,
    MatDatepickerModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    FileUploadModule,
    MatSelectModule,
    NgIf
  ],
  providers: [Editor],
  templateUrl: './post-deal.component.html',
  styleUrl: './post-deal.component.scss',
   animations: [
    trigger('formStagger', [
      transition(':enter', [
        query('.stagger-field', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(60, animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class PostDealComponent {
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right']
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

  discountTypes = [
    { viewValue: '%', value: '%' },
    { viewValue: '$', value: '$' },
    { viewValue: '₹', value: '₹' }
  ];

  countries = [
    { viewValue: 'INDIA', value: 'india' },
    { viewValue: 'USA', value: 'usa' }
  ];

  dealFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  selectedDealId = '';
  isActionInProgress = signal(true);
  title = 'Edit Deal';
  buttonTitle = 'UPDATE DEAL';
  selectedDealLocal: DealDataItem = new DealDataItem();
  categoriesLocal: Category[] = [];
  filteredCategoriesLocal: Category[] = [];
  brandsLocal: Brand[] = [];
  filteredBrands: Brand[] = [];
  merchantsLocal: Merchant[] = [];
  filteredMerchants: Merchant[] = [];
  dealTypesLocal: DealType[] = [];
  filteredDealTypesLocal: DealType[] = [];
  getDealActionInProgress: boolean = false;
  isBrowser = false;

  router: Router = inject(Router);
  platformId = inject(PLATFORM_ID);
  transferState = inject(TransferState);
  route = inject(ActivatedRoute);
  fb = inject(UntypedFormBuilder);
  dealsService = inject(DealsService);
  dealsStoreService = inject(DealsStoreService);
  userStore = inject(UserStoreService);

  pCategories: Signal<PCategory[]> = this.dealsStoreService.getPcCategories();
  categories: Signal<Category[]> = this.dealsStoreService.getCategories();
  dealTypes: Signal<DealType[]> = this.dealsStoreService.getDealTypes();
  brands: Signal<Brand[]> = this.dealsStoreService.getBrands();
  merchants: Signal<Merchant[]> = this.dealsStoreService.getMerchants();
  selectedDeal: Signal<DealDataItem> = this.dealsStoreService.getSelectedDeal();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.editor = new Editor();
    }

    this.buildForm();

    if (isPlatformServer(this.platformId)) {
      this.dealsStoreService.updateCategories(this.transferState.get(makeStateKey('categoriesTable'), []));
      this.dealsStoreService.updateDealTypes(this.transferState.get(makeStateKey('dealTypesTable'), []));
      this.dealsStoreService.updateBrands(this.transferState.get(makeStateKey('brandsTable'), []));
      this.dealsStoreService.updateMerchants(this.transferState.get(makeStateKey('merchantsTable'), []));
    }

    this.route.params.subscribe(params => {
      this.selectedDealId = params['id'];
      if (this.selectedDealId) {
        this.isActionInProgress.set(true);
        this.dealsService.getDealDetailsById(this.selectedDealId).subscribe({
          next: (deal) => {
            this.dealsStoreService.updateSelectedDeal(deal[0]);
            this.selectedDealLocal = deal[0];
            this.updateDataIntoForm();
            this.isActionInProgress.set(false);
          },
          error: () => {
            this.isActionInProgress.set(false);
          }
        });
      } else {
        this.isActionInProgress.set(false);
      }
    });

    effect(() => {
      const allCategories = this.categories();
      const allDealTypes = this.dealTypes();
      const allBrands = this.brands();
      const allMerchants = this.merchants();
      console.log('Post Deal: Effect : DealTypes ' + allDealTypes);
      if (allCategories.length && allDealTypes.length && allBrands.length && allMerchants.length) {
        this.categoriesLocal = allCategories;
        this.filteredCategoriesLocal = [...allCategories];

        this.dealTypesLocal = allDealTypes;
        this.filteredDealTypesLocal = [...allDealTypes];

        this.brandsLocal = allBrands;
        this.filteredBrands = [...allBrands];

        this.merchantsLocal = allMerchants;
        this.filteredMerchants = [...allMerchants];
      }
    });
  }

  buildForm() {
    this.dealFormGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      dealUrl: ['', Validators.required],
      startDate: [new Date()],
      endDate: [new Date()],
      highlight: [''],
      highlightColor: [''],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      currentPrice: [null, [Validators.required, Validators.min(0)]],
      discount: [null, [Validators.required, Validators.min(0)]],
      discountType: [null, [Validators.required]],
      active: [false],
      approved: [false],
      country: ['', Validators.required],
      city: [''],
      pinCode: [''],
      merchant: [''],
      type: ['', Validators.required],
      category: ['', Validators.required],
      brand: [''],
      expired: [false]
    });
  }

  updateDataIntoForm(): void {
    const d = this.selectedDealLocal;
    if (!d) return;
    if (d.id) {
      this.title = 'Edit Deal';
      this.buttonTitle = 'Update Deal';
    }
    this.dealFormGroup.patchValue({
      title: d.title,
      description: d.description,
      imageUrl: d.imageUrl,
      dealUrl: d.dealUrl,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      highlight: d.highlight,
      highlightColor: d.highlightColor,
      originalPrice: d.originalPrice,
      currentPrice: d.currentPrice,
      discount: d.discount,
      discountType: d.discountType,
      active: d.active,
      approved: d.approved,
      country: d.country,
      city: d.city,
      pinCode: d.pinCode,
      merchant: d.merchant,
      brand: d.brand,
      expired: d.expired,
      category: d.category,
      type: d.tags?.split(',') || []
    });
  }

  submitForm(event: any): void {
    event.preventDefault();
    if (this.dealFormGroup.invalid) return;
    this.isActionInProgress.set(true);
    const form = this.dealFormGroup.value;
    const deal = new DealDataItem();
    Object.assign(deal, form);
    deal.tags = (form.type || []).join(',');
    deal.id = this.selectedDealLocal.id;
    deal.postedDate = new Date().toDateString();
    deal.postedBy = 'Admin';
    const sDate = new Date(form.startDate);
    deal.startDate = `${sDate.getMonth() + 1}`.padStart(2, '0') + '/' + `${sDate.getDate()}`.padStart(2, '0') + '/' + sDate.getFullYear();
    const eDate = new Date(form.endDate);
    deal.endDate = `${eDate.getMonth() + 1}`.padStart(2, '0') + '/' + `${eDate.getDate()}`.padStart(2, '0') + '/' + eDate.getFullYear();
    this.dealFormGroup.disable();
    const action$ = deal.id ? this.dealsService.updateDeal(deal) : this.dealsService.postDeal(deal);
    action$.subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/deals-list');
      },
      error: () => {
        this.dealFormGroup.enable();
        this.isActionInProgress.set(false);
      },
      complete: () => {
        this.isActionInProgress.set(false);
      }
    });
  }

  inputChangeHandler($event: any) {}

  closePostDeal($event: any) {
    this.router.navigateByUrl('/admin/deals-list');
  }

  merchantFilter(value: string): Merchant[] {
    return this.merchantsLocal.filter(m => m.title.toLowerCase().includes(value.toLowerCase()));
  }

  brandFilter(value: string): Brand[] {
    return this.brandsLocal.filter(b => b.title.toLowerCase().includes(value.toLowerCase()));
  }

  categoriesFilter(value: string): Category[] {
    return this.categoriesLocal.filter(c => c.title.toLowerCase().includes(value.toLowerCase()));
  }

  compareFunction(o1: any, o2: any) {
    return o1?.name === o2?.name && o1?.code === o2?.code;
  }

  // ... rest unchanged
}
