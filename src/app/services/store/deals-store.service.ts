import { Injectable, Signal, computed, signal } from '@angular/core';
import { DealsState } from './deals-store.model';
import {
  Brand,
  Category,
  DealDataItem,
  DealSorting,
  DealType,
  Merchant,
  PCategory
} from '../deals.model';
import _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class DealsStoreService {
  private readonly state = signal<DealsState>({
    dealTypes: [],
    selectedDealType: new DealType(),
    selectedCategory: new Category(),
    categories: [],
    pCategories: [],
    brands: [],
    merchants: [],
    dailyDeals: [],
    filteredDailyDeals: [],
    deals: [],
    allDeals: [],
    filteredAllDeals: [],
    dealListDeals: [],
    selectedDeal: new DealDataItem(),
    selectedHomeFilter: '',
    selectedHomeSorting: new DealSorting(),
    relatedDeals: []
  });

  // ---------------------------------------------
  // Getter methods (public computed signals)
  // ---------------------------------------------

  getDealTypes(): Signal<Array<DealType>> {
    return computed(() => this.state().dealTypes);
  }

  getSelectedDealType(): Signal<DealType> {
    return computed(() => this.state().selectedDealType);
  }

  getSelectedCategory(): Signal<Category> {
    return computed(() => this.state().selectedCategory);
  }

  getCategories(): Signal<Array<Category>> {
    return computed(() => this.state().categories);
  }

  getPcCategories(): Signal<PCategory[]> {
    return computed(() => this.state().pCategories);
  }

  getBrands(): Signal<Array<Brand>> {
    return computed(() => this.state().brands);
  }

  getMerchants(): Signal<Array<Merchant>> {
    return computed(() => this.state().merchants);
  }

  getAllDailyDeals(): Signal<Array<DealDataItem>> {
    return computed(() => this.state().dailyDeals);
  }

  getAllFilteredDailyDeals(): Signal<Array<DealDataItem>> {
    return computed(() => this.state().filteredDailyDeals);
  }

  getSelectedDeal(): Signal<DealDataItem> {
    return computed(() => this.state().selectedDeal);
  }

  getRelatedDeals(): Signal<Array<DealDataItem>> {
    return computed(() => this.state().relatedDeals);
  }

  getDeals(): Signal<Array<DealDataItem>> {
    return computed(() => this.state().deals);
  }

  getFilteredAllDeals(): Signal<Array<DealDataItem>> {
    return computed(() => this.state().filteredAllDeals);
  }

   getDealListDelas(): Signal<Array<DealDataItem>> {
    return computed(() => this.state().dealListDeals);
  }

  // ---------------------------------------------
  // Update methods
  // ---------------------------------------------

  updateDealTypes(dealTypes: Array<DealType>) {
    this._patch({ dealTypes });
  }

  updateSelectedDealType(dealType: DealType) {
    this._patch({ selectedDealType: dealType });
  }

  updateSelectedCategory(category: Category) {
    this._patch({ selectedCategory: category });
  }

  updateCategories(categories: Array<Category>) {
    const sizeOptions = ['large', 'medium', 'small'];
    const uCategories = categories.map(category => ({
      ...category,
      size: sizeOptions[Math.floor(Math.random() * sizeOptions.length)]
    }));

    const pCategories: PCategory[] = _.map(
      _.groupBy(uCategories, 'parent'),
      (catGroup, parent) => {
        const pCat = new PCategory();
        pCat.parent = parent;
        pCat.categories = catGroup;
        return pCat;
      }
    );

    this._patch({
      categories: uCategories,
      pCategories
    });
  }

  updateBrands(brands: Array<Brand>) {
    this._patch({ brands });
  }

  updateMerchants(merchants: Array<Merchant>) {
    this._patch({ merchants });
  }

  updateDailyDeals(deals: Array<DealDataItem>) {
    this._patch({
      dailyDeals: [...deals],
      filteredDailyDeals: [...deals]
    });
  }

  updateSelectedDeal(deal: DealDataItem) {
    this._patch({ selectedDeal: deal });
  }

  updateRelatedDeals(deals: Array<DealDataItem>) {
    this._patch({ relatedDeals: [...deals] });
  }

  updateAllDeals(deals: Array<DealDataItem>, status: any, category: string, title: string) {
    const filtered = this._filterDeals(deals, status, category, title);
    this._patch({
      allDeals: [...deals],
      filteredAllDeals: [...filtered]
    });
  }

  filterAllDeals(status: any, category: string, title: string) {
    const filtered = this._filterDeals(this.state().allDeals, status, category, title);
    this._patch({ filteredAllDeals: [...filtered] });
  }

  sortDeals(sorting: DealSorting) {
    const sorted = this._sortDeals(this.state().deals, sorting);
    this._patch({
      deals: [...sorted],
      filteredAllDeals: [...sorted]
    });
  }

  sortDailyDeals(sorting: DealSorting) {
    const sorted = this._sortDeals(this.state().dailyDeals, sorting);
    this._patch({
      dailyDeals: [...sorted],
      filteredDailyDeals: [...sorted]
    });
  }

  sortDealsListDeals(sorting: DealSorting) {
    const sorted = this._sortDeals(this.state().dealListDeals, sorting);
    this._patch({
      dealListDeals: [...sorted]
    });
  }

  updateDealsListDeals(deals: Array<DealDataItem>) {
    this._patch({
      dealListDeals: [...deals]
    });
  }

  // ---------------------------------------------
  // Internal helpers
  // ---------------------------------------------

  private _patch(patch: Partial<DealsState>) {
    this.state.update(state => ({ ...state, ...patch }));
  }

  private _filterDeals(
    deals: Array<DealDataItem>,
    status: any,
    category: string,
    title: string
  ): Array<DealDataItem> {
    const toBoolean = (value: any): boolean =>
      value === true || value === 'true';

    return _.orderBy(
      deals.filter(deal => {
        const statusMatch = +status === -1 || deal.approved === toBoolean(status);
        const categoryMatch = category === 'All' || deal.category === category;
        const titleMatch = !title || deal.title.toLowerCase().includes(title.toLowerCase());
        return statusMatch && categoryMatch && titleMatch;
      }),
      d => +d.discount,
      ['desc']
    );
  }

  private _sortDeals(deals: Array<DealDataItem>, sorting: DealSorting): Array<DealDataItem> {
    if (sorting?.title === 'Lowest Discount First') {
      return _.orderBy(deals, d => +d.discount, ['asc']);
    } else if (sorting?.title === 'Highest Discount First') {
      return _.orderBy(deals, d => +d.discount, ['desc']);
    } else {
      return [...deals];
    }
  }
}
