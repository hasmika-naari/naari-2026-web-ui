import { Injectable, Signal, computed, signal } from "@angular/core";
import { UserState } from "./user-store";
import { Account } from "../profile.model";
import { DealsState } from "./deals-store.model";
import { Brand, Category, DealDataItem, DealType, Merchant, PCategory } from "../deals.model";
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
        allDeals: new Array<DealDataItem>()
       });


    updateDeals(deals:  Array<DealDataItem>) {
      this.state.update((state) => ({
      ...state,
      allDeals: deals
      }));
    }   

    updateDealTypes(dealTypes:  Array<DealType>) {
        this.state.update((state) => ({
          ...state,
          dealTypes: dealTypes
        }));
      }

   updateCategories(categories:  Array<Category>) {
    debugger;
    console.log('Update categories');
      let pCategories = [..._.map(
                _.groupBy(this.state().categories, 'parent'),
                (categories, parent) => ({ parent, categories }))];
        this.state.update((state) => ({
          ...state,
          categories: categories,
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

      getAllDeals(): Signal<Array<DealDataItem>> {
      return computed(() => this.state().allDeals);
    } 

  }