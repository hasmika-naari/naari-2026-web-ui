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
        categories: new  Array<Category>(), 
        pCategories: new Array<PCategory>(),
        brands: new Array<Brand>(),
        merchants: new Array<Merchant>(),
        dailyDeals: new Array<DealDataItem>(),
        filteredDailyDeals: new Array<DealDataItem>(),
        selectedHomeFilter: '',
        selectedHomeSorting: new DealSorting()
       });


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
      filteredDailyDeals: [...deals]
      }));
    }   

    updateDailyDeals(deals:  Array<DealDataItem>) {
      /// Implement Filter code here..
      this.state.update((state) => ({
      ...state,
      dailyDeals: [...deals],
      filteredDailyDeals: [...deals]
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

  }