import { Injectable, Signal, computed, signal } from "@angular/core";
import { UserState } from "./user-store";
import { Account } from "../profile.model";
import { DealsState } from "./deals-store.model";
import { Brand, Category, DealDataItem, DealSorting, DealType, Merchant, PCategory } from "../deals.model";
import _ from "lodash";




@Injectable({
    providedIn: 'root',
  })
  export class DealsStoreService {
    state = signal<DealsState>({ 
        dealTypes: new  Array<DealType>(), 
        selectedDealType: new DealType(), 
        selectedCategory: new Category(), 
        categories: new  Array<Category>(), 
        pCategories: new Array<PCategory>(),
        brands: new Array<Brand>(),
        merchants: new Array<Merchant>(),
        dailyDeals: new Array<DealDataItem>(),
        filteredDailyDeals: new Array<DealDataItem>(),
        deals: new Array<DealDataItem>(),
        allDeals: new Array<DealDataItem>(),
        filteredAllDeals: new Array<DealDataItem>(),
        selectedHomeFilter: '',
        selectedHomeSorting: new DealSorting(),
        selectedDeal: new DealDataItem(),
        relatedDeals: new Array<DealDataItem>()
       });

    sortDeals(sorting: DealSorting) {
        this.state.update((state) => {
          let deals: Array<DealDataItem> = [];

          if (sorting?.title === 'Lowest Discount First') {
            deals = _.orderBy(state.deals, d => +d.discount, ['asc']);
          } else if (sorting?.title === 'Highest Discount First') {
            deals = _.orderBy(state.deals, d => +d.discount, ['desc']);
          } else {
            deals = [...state.deals];
          }

          return {
            ...state,
            deals: [...deals],
            filteredAllDeals: [...deals]
          };
        });
    }    

    sortDailyDeals(sorting: DealSorting) {
      this.state.update((state) => {
        let dailyDeals: Array<DealDataItem> = [];

        if (sorting?.title === 'Lowest Discount First') {
          dailyDeals = _.orderBy(state.dailyDeals, d => +d.discount, ['asc']);
        } else if (sorting?.title === 'Highest Discount First') {
          dailyDeals = _.orderBy(state.dailyDeals, d => +d.discount, ['desc']);
        } else {
          dailyDeals = [...state.dailyDeals];
        }

        return {
          ...state,
          dailyDeals: [...dailyDeals],
          filteredDailyDeals: [...dailyDeals]
        };
      });
  } 

    filterDailyDeals(deals:  Array<DealDataItem>, filter: string) {
      /// Implement Filter code here..
      this.state.update((state) => ({
      ...state,
      dailyDeals: [...deals],
      filteredDailyDeals: [...deals, ...deals]
      }));
    }   

    updateDailyDeals(deals:  Array<DealDataItem>) {
      /// Implement Filter code here..
      this.state.update((state) => ({
      ...state,
      dailyDeals: [...deals],
      filteredDailyDeals: [...deals, ...deals]
      }));
    }   

updateAllDeals(deals: Array<DealDataItem>, status: any, category: string, title: string) {
  const filteredDeals = deals.filter(deal => {
    const statusMatch = +status === -1 ? true : String(deal.approved) === String(status);
    const categoryMatch = (category === 'All') ? true: (deal.category === category);
    const titleMatch = title
      ? deal.title.toLowerCase().includes(title.toLowerCase())
      : true;

    return statusMatch && categoryMatch && titleMatch;
  });

  const sortedFilteredDeals = _.orderBy(filteredDeals, d => +d.discount, ['desc']);

  this.state.update((state) => ({
    ...state,
    allDeals: [...deals],
    filteredAllDeals: [...sortedFilteredDeals]
  }));
}


filterAllDeals(status: any, category: string, title: string) {
  const toBoolean = (value: any): boolean =>
    value === true || value === 'true';

  this.state.update((state) => {
    let filteredAllDeals: Array<DealDataItem> = state.allDeals.filter(deal => {
      const statusMatch = +status === -1 ? true : deal.approved === toBoolean(status);
      const categoryMatch = (category === 'All') ? true: (deal.category === category);
      const titleMatch = title
        ? deal.title.toLowerCase().includes(title.toLowerCase())
        : true;

      return statusMatch && categoryMatch && titleMatch;
    });

    // Sort by discount descending
    filteredAllDeals = _.orderBy(filteredAllDeals, d => +d.discount, ['desc']);

    return {
      ...state,
      filteredAllDeals: [...filteredAllDeals]
    };
  });
}



    updateSelectedDeal(deal:  DealDataItem) {
      /// Implement Filter code here..
      this.state.update((state) => ({
      ...state,
      selectedDeal: deal,
      }));
    }   

    updateSelectedDealType(dealType:  DealType) {
      /// Implement Filter code here..
      this.state.update((state) => ({
      ...state,
      selectedDealType: dealType,
      }));
    }
    
    updateSelectedCategory(ctagory:  Category) {
      /// Implement Filter code here..
      this.state.update((state) => ({
      ...state,
      selectedCategory: ctagory,
      }));
    }

    updateRelatedDeals(deals:  Array<DealDataItem>) {
      /// Implement Filter code here..
      this.state.update((state) => ({
      ...state,
      relatedDeals: [...deals],
      }));
    }   

    updateDealTypes(dealTypes:  Array<DealType>) {
        this.state.update((state) => ({
          ...state,
          dealTypes: dealTypes
        }));
      }

    updateCategories(categories: Array<Category>) {
      console.log('Update categories');
       const sizeOptions = ['large', 'medium', 'small'];
       let uCategories = categories.map(category => ({
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

      this.state.update((state) => ({
        ...state,
        categories: uCategories,
        pCategories: pCategories
      }));
    }

    updateBrands(brands:  Array<Brand>) {
      this.state.update((state) => ({
        ...state,
        brands: brands
      }));
    }  

     updateMerchants(merchants:  Array<Merchant>) {
      this.state.update((state) => ({
        ...state,
        merchants: merchants
      }));
    }  

    getDealTypes(): Signal<Array<DealType>> {
      return computed(() => this.state().dealTypes);
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

    getSelectedCategory(): Signal<Category> {
      return computed(() => this.state().selectedCategory);
    }

    getSelectedDealType(): Signal<DealType> {
      return computed(() => this.state().selectedDealType);
    }

    getDeals(): Signal<Array<DealDataItem>> {
      return computed(() => this.state().deals);
    }

    getFilteredAllDeals(): Signal<Array<DealDataItem>> {
      return computed(() => this.state().filteredAllDeals);
    }
  }