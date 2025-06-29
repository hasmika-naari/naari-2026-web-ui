import { Brand, Category, DealDataItem, DealSorting, DealType, Merchant, PCategory } from "../deals.model";
import { Account } from "../profile.model";

  
  export interface DealsState {
    dealTypes: Array<DealType>;
    selectedDealType: DealType;
    selectedCategory: Category;
    categories: Array<Category>;
    pCategories: Array<PCategory>;
    brands: Array<Brand>;
    merchants: Array<Merchant>;
    selectedDeal: DealDataItem;
    relatedDeals: Array<DealDataItem>;
    dailyDeals: Array<DealDataItem>;
    deals: Array<DealDataItem>;
    allDeals: Array<DealDataItem>;
    filteredAllDeals: Array<DealDataItem>;
    dealListDeals: Array<DealDataItem>;
    selectedHomeFilter: string;
    selectedHomeSorting: DealSorting;
    filteredDailyDeals: Array<DealDataItem>;
  }
  
  export const dealsStateConfig = {
    initState: {
      dealTypes: new Array<DealType>(),
      selectedDealType: new DealType(),
      selectedCategory: new Category(),
      categories: new Array<Category>(),
      pCategories: new Array<PCategory>(),
      brands: new Array<Brand>(),
      merchants: new Array<Merchant>(),
      dailyDeals: new Array<DealDataItem>,
      filteredDailyDeals: new Array<DealDataItem>,
      deals: new Array<DealDataItem>(),
      allDeals: new Array<DealDataItem>(),
      filteredAllDeals: new Array<DealDataItem>(),
      dealListDeals: new Array<DealDataItem>(),
      selectedHomeFilter: '',
      selectedHomeSorting: new DealSorting(),
      selectedDeal: new DealDataItem(),
      relatedDeals: new Array<DealDataItem>()
    }
  };