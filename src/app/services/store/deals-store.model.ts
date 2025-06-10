import { Brand, Category, DealDataItem, DealType, Merchant, PCategory } from "../deals.model";
import { Account } from "../profile.model";

  
  export interface DealsState {
    dealTypes: Array<DealType>;
    categories: Array<Category>;
    pCategories: Array<PCategory>;
    brands: Array<Brand>;
    merchants: Array<Merchant>;
    allDeals: Array<DealDataItem>;
  }
  
  export const dealsStateConfig = {
    initState: {
      dealTypes: new Array<DealType>(),
      categories: new Array<Category>(),
      pCategories: new Array<PCategory>(),
      brands: new Array<Brand>(),
      merchants: new Array<Merchant>(),
      allDeals: new Array<DealDataItem>
    }
  };