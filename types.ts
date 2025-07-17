
export interface LineItem {
  id: number;
  code: string;
  description: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface PurchaseOrderData {
    poNumber: string;
    poNumberCounter: number;
    supplier: string;
    paymentTerms: string;
    deliveryTerms: string;
    items: LineItem[];
    pricesIncludeTax: boolean;
    applyCommercialTax: boolean;
    savedAt: string; // ISO string date for timestamping
}
