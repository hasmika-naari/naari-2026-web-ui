// ✅ Updated `PostDealComponent` with all functions retained
import {
  Component,
  effect,
  inject,
  Inject,
  makeStateKey,
  OnDestroy,
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
  DealDataItemRequest,
  DealType,
  PCategory,
  PostDealItem
} from '@app/services/deals.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
import { Subscription } from 'rxjs';
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
export class PostDealComponent implements OnDestroy {
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
  title = 'Add Deal';
  buttonTitle = 'ADD DEAL';
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
  private subscriptions: Subscription[] = [];

  router: Router = inject(Router);
  platformId = inject(PLATFORM_ID);
  transferState = inject(TransferState);
  route = inject(ActivatedRoute);
  location = inject(Location);
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
  this.setupCategoryAutocomplete();

    // Load data from store or API
    this.loadDropdownData();

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

        const currentCategoryValue = this.dealFormGroup.get('category')?.value ?? '';
        this.applyCategoryFilter(currentCategoryValue);
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
      this.buttonTitle = 'UPDATE DEAL';
    } else {
      this.title = 'Add Deal';
      this.buttonTitle = 'ADD DEAL';
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

    // Create the deal object in the correct format for the API
    const dealData: DealDataItemRequest = {
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      dealUrl: form.dealUrl,
      startDate: form.startDate,
      endDate: form.endDate,
      highlight: form.highlight,
      highlightColor: form.highlightColor,
      originalPrice: form.originalPrice?.toString() || '',
      currentPrice: form.currentPrice?.toString() || '',
      discount: form.discount?.toString() || '',
      discountType: form.discountType,
      active: form.active?.toString() || '',
      approved: form.approved,
      country: form.country,
      city: form.city || '',
      pinCode: form.pinCode || '',
      merchant: form.merchant,
      tags: (form.type || []).join(','),
      category: form.category,
      brand: form.brand,
      expired: form.expired,
      postedDate: new Date().toDateString(),
      postedBy: 'Admin'
    };

    // Format dates properly
    if (form.startDate) {
      const sDate = new Date(form.startDate);
      dealData.startDate = `${sDate.getMonth() + 1}`.padStart(2, '0') + '/' + `${sDate.getDate()}`.padStart(2, '0') + '/' + sDate.getFullYear();
    }

    if (form.endDate) {
      const eDate = new Date(form.endDate);
      dealData.endDate = `${eDate.getMonth() + 1}`.padStart(2, '0') + '/' + `${eDate.getDate()}`.padStart(2, '0') + '/' + eDate.getFullYear();
    }

    this.dealFormGroup.disable();

    if (this.selectedDealId) {
      // For updates, convert to DealDataItem format
      const updateDeal = new DealDataItem();
      Object.assign(updateDeal, dealData);
      updateDeal.id = this.selectedDealId;
      updateDeal.tags = dealData.tags;

      this.dealsService.updateDeal(updateDeal).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/deals-list');
        },
        error: (error) => {
          console.error('Error updating deal:', error);
          this.dealFormGroup.enable();
          this.isActionInProgress.set(false);
        },
        complete: () => {
          this.isActionInProgress.set(false);
        }
      });
    } else {
      // For new deals, use postDeal
      this.dealsService.postDeal(dealData).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/deals-list');
        },
        error: (error) => {
          console.error('Error creating deal:', error);
          this.dealFormGroup.enable();
          this.isActionInProgress.set(false);
        },
        complete: () => {
          this.isActionInProgress.set(false);
        }
      });
    }
  }

  inputChangeHandler(event: any) {}

  onCategoryInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) {
      this.filteredCategoriesLocal = [...this.categoriesLocal];
    } else {
      this.filteredCategoriesLocal = this.categoriesLocal.filter(cat =>
        cat.title.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  onBrandInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) {
      this.filteredBrands = [...this.brandsLocal];
    } else {
      this.filteredBrands = this.brandsLocal.filter(brand =>
        brand.title.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  onMerchantInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) {
      this.filteredMerchants = [...this.merchantsLocal];
    } else {
      this.filteredMerchants = this.merchantsLocal.filter(merchant =>
        merchant.title.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  closePostDeal($event: any) {
    this.location.back();
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

  private setupCategoryAutocomplete(): void {
    const categoryControl = this.dealFormGroup.get('category');
    if (!categoryControl) {
      return;
    }

    const sub = categoryControl.valueChanges.subscribe(value => {
      this.applyCategoryFilter((value ?? '').toString());
    });

    this.subscriptions.push(sub);
    this.applyCategoryFilter(categoryControl.value ?? '');
  }

  private applyCategoryFilter(value: string): void {
    const search = (value || '').toLowerCase();
    if (!search) {
      this.filteredCategoriesLocal = [...this.categoriesLocal];
      return;
    }

    this.filteredCategoriesLocal = this.categoriesLocal.filter(cat =>
      cat.title?.toLowerCase().includes(search) || cat.code?.toLowerCase().includes(search)
    );
  }

  loadDropdownData() {
    // Check if data is already in store
    const currentCategories = this.categories();
    const currentDealTypes = this.dealTypes();
    const currentBrands = this.brands();
    const currentMerchants = this.merchants();

    // Load data from API if not available in store
    if (!currentCategories.length) {
      this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe({
        next: (categories) => {
          this.dealsStoreService.updateCategories(categories);
        },
        error: (error) => console.error('Error loading categories:', error)
      });
    }

    if (!currentDealTypes.length) {
      this.dealsService.getDealTypes('usa', this.platformId).subscribe({
        next: (dealTypes) => {
          this.dealsStoreService.updateDealTypes(dealTypes);
        },
        error: (error) => console.error('Error loading deal types:', error)
      });
    }

    if (!currentBrands.length) {
      this.dealsService.getBrands('usa').subscribe({
        next: (brands) => {
          this.dealsStoreService.updateBrands(brands);
        },
        error: (error) => console.error('Error loading brands:', error)
      });
    }

    if (!currentMerchants.length) {
      this.dealsService.getMerchants('usa').subscribe({
        next: (merchants) => {
          this.dealsStoreService.updateMerchants(merchants);
        },
        error: (error) => console.error('Error loading merchants:', error)
      });
    }
  }

  // Helper methods for modern UI
  getDealTypeIcon(typeCode: string): string {
    const iconMap: { [key: string]: string } = {
      'black-friday': 'local_offer',
      'cyber-monday': 'shopping_cart',
      'flash-sale': 'flash_on',
      'clearance': 'clear_all',
      'seasonal': 'event',
      'limited-time': 'timer',
      'bundle': 'inventory_2',
      'free-shipping': 'local_shipping',
      'default': 'label'
    };
    return iconMap[typeCode] || iconMap['default'];
  }

  getCountryFlag(country: string): string {
    const flagMap: { [key: string]: string } = {
      'usa': '🇺🇸',
      'india': '🇮🇳',
      'uk': '🇬🇧',
      'canada': '🇨🇦',
      'australia': '🇦🇺'
    };
    return flagMap[country] || '🏳️';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
