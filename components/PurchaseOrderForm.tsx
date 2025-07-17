import React from 'react';
import { LineItem, PurchaseOrderData } from '../types';
import { TrashIcon } from './Icons';
import { SavedOrders } from './SavedOrders';

interface PurchaseOrderFormProps {
  supplier: string;
  setSupplier: (supplier: string) => void;
  paymentTerms: string;
  setPaymentTerms: (terms: string) => void;
  deliveryTerms: string;
  setDeliveryTerms: (terms: string) => void;
  items: LineItem[];
  onAddItem: () => void;
  onUpdateItem: (index: number, item: LineItem) => void;
  onRemoveItem: (index: number) => void;
  handlePrint: () => void;
  pricesIncludeTax: boolean;
  setPricesIncludeTax: (value: boolean) => void;
  applyCommercialTax: boolean;
  setApplyCommercialTax: (value: boolean) => void;
  savedPOs: PurchaseOrderData[];
  onSave: () => void;
  onLoad: (poNumber: string) => void;
  onDelete: (poNumber: string) => void;
  onNew: () => void;
}

const ItemEditor: React.FC<{ 
    item: LineItem; 
    index: number; 
    onUpdate: (index: number, item: LineItem) => void;
    onRemove: (index: number) => void;
}> = ({ item, index, onUpdate, onRemove }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'quantity' || name === 'price' ? parseFloat(value) : value;
        onUpdate(index, { ...item, [name]: newValue });
    };

    return (
        <div className="p-3 bg-gray-50 rounded-lg mb-3 border border-gray-200 transition-all hover:border-blue-400">
            <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-gray-700">Item #{index + 1}</p>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-100"
                    aria-label="Remove item"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input
                    type="text"
                    name="code"
                    value={item.code}
                    onChange={handleChange}
                    placeholder="Item Code"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="text"
                    name="unit"
                    value={item.unit}
                    onChange={handleChange}
                    placeholder="Unit (e.g., EA)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={handleChange}
                    placeholder="Item Description"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2"
                />
                <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                />
                <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                />
            </div>
        </div>
    );
};


export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  supplier,
  setSupplier,
  paymentTerms,
  setPaymentTerms,
  deliveryTerms,
  setDeliveryTerms,
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  handlePrint,
  pricesIncludeTax,
  setPricesIncludeTax,
  applyCommercialTax,
  setApplyCommercialTax,
  savedPOs,
  onSave,
  onLoad,
  onDelete,
  onNew,
}) => {
    
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg h-full flex flex-col">
      <SavedOrders savedPOs={savedPOs} onLoad={onLoad} onDelete={onDelete} />

      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">PO Creator</h2>
      <div className="space-y-4 mb-4">
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
            Supplier Name (المورد)
          </label>
          <input
            type="text"
            id="supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="e.g., Bridge Egypt"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Terms (شروط الدفع)
          </label>
          <input
            type="text"
            id="paymentTerms"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="deliveryTerms" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Terms (شروط التسليم)
          </label>
          <input
            type="text"
            id="deliveryTerms"
            value={deliveryTerms}
            onChange={(e) => setDeliveryTerms(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Tax Settings (إعدادات الضريبة)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="pricesIncludeTax"
                    checked={pricesIncludeTax}
                    onChange={(e) => setPricesIncludeTax(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="pricesIncludeTax" className="mr-2 ml-2 block text-sm font-medium text-gray-700">
                    الأسعار شاملة ض.ق.م
                </label>
            </div>
            <div>
                 <label htmlFor="commercialTax" className="sr-only">ضريبة الأرباح التجارية والصناعية</label>
                 <select
                    id="commercialTax"
                    value={applyCommercialTax ? 'apply' : 'none'}
                    onChange={(e) => setApplyCommercialTax(e.target.value === 'apply')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                    <option value="none">بدون خصم أ.ت.ص (الافتراضي)</option>
                    <option value="apply">تطبيق خصم 1%</option>
                </select>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-800 border-b pb-3 mb-3">
          <h3 className="text-xl font-bold">Line Items (البنود)</h3>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
        {items.map((item, index) => (
          <ItemEditor 
            key={item.id}
            item={item}
            index={index}
            onUpdate={onUpdateItem}
            onRemove={onRemoveItem}
          />
        ))}
         <button
            type="button"
            onClick={onAddItem}
            className="w-full mt-2 border-2 border-dashed border-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            + Add New Item
        </button>
      </div>
      
      <div className="mt-8 pt-4 border-t space-y-3">
        <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSave}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Purchase Order
            </button>
            <button
              onClick={onNew}
              className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
             New PO
            </button>
        </div>
        <button
          onClick={handlePrint}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm-2 6H9v1h4v-1z" clipRule="evenodd" />
          </svg>
          Generate & Print PO
        </button>
      </div>
    </div>
  );
};
