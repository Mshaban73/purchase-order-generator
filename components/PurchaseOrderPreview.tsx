import React, { useMemo } from 'react';
import { LineItem } from '../types';
import { LogoIcon } from './Icons';

interface PurchaseOrderPreviewProps {
  poNumber: string;
  date: string;
  supplier: string;
  paymentTerms: string;
  deliveryTerms: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  pricesIncludeTax: boolean;
  applyCommercialTax: boolean;
  commercialTaxAmount: number;
}

export const PurchaseOrderPreview: React.FC<PurchaseOrderPreviewProps> = ({
  poNumber,
  date,
  supplier,
  paymentTerms,
  deliveryTerms,
  items,
  subtotal,
  tax,
  total,
  pricesIncludeTax,
  applyCommercialTax,
  commercialTaxAmount,
}) => {
  const showItemCodeColumn = useMemo(() => 
    items.some(item => item.code && item.code.trim() !== ''), 
  [items]);

  return (
    <div id="po-preview" className="p-8 lg:p-10 bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-auto font-cairo">
      <div dir="rtl" className="text-right">
        {/* Header */}
        <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
          <div className="text-left flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 font-poppins">Think Solution Engineering</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-poppins mt-1">Golden Mall - Vodafone Square - 6th of October - Giza</p>
            <p className="text-xs lg:text-sm text-gray-500 font-poppins">info@thinksolutioneg.com</p>
          </div>
          <div className="flex flex-col items-center mx-4">
            <LogoIcon className="w-48" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">شركة ابتكار الحلول الهندسية</h1>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">جولدن مول - میدان فودافون - السادس من أكتوبر - جيزة</p>
            <p className="text-xs lg:text-sm text-gray-500">:البريد الإلكتروني <span className="font-poppins">info@thinksolutioneg.com</span></p>
          </div>
        </header>

        {/* PO Number - Centered */}
        <div className="text-center my-8">
            <h2 className="text-2xl font-bold inline-block border-b-2 border-gray-300 pb-2 px-4">
                أمر توريد رقم: <span className="font-poppins tracking-wider">{poNumber}</span>
            </h2>
        </div>
        
        {/* PO Details */}
        <div className="mt-8 text-right">
             <p className="text-base mb-2"><span className="font-bold">المورد: </span> <span className="font-poppins">{supplier || '.........................'}</span></p>
             <p className="text-base"><span className="font-bold">التاريخ:</span> <span className="font-poppins">{date}</span></p>
        </div>
        
        {/* Items Table */}
        <div className="mt-8">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-100 border-y-2 border-gray-300">
                <th className="p-3 font-bold text-gray-600 text-sm tracking-wider">الرقم المسلسل</th>
                {showItemCodeColumn && <th className="p-3 font-bold text-gray-600 text-sm tracking-wider">كود الصنف</th>}
                <th className="p-3 font-bold text-gray-600 text-sm tracking-wider">اسم الصنف</th>
                <th className="p-3 font-bold text-gray-600 text-sm tracking-wider">الوحدة</th>
                <th className="p-3 font-bold text-gray-600 text-sm tracking-wider">الكمية</th>
                <th className="p-3 font-bold text-gray-600 text-sm tracking-wider">السعر</th>
                <th className="p-3 font-bold text-gray-600 text-sm tracking-wider">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-poppins text-center">{index + 1}</td>
                  {showItemCodeColumn && <td className="p-3 font-poppins text-center">{item.code}</td>}
                  <td className="p-3 font-poppins">{item.description}</td>
                  <td className="p-3 font-poppins text-center">{item.unit}</td>
                  <td className="p-3 font-poppins text-center">{item.quantity.toFixed(1)}</td>
                  <td className="p-3 font-poppins text-center">{item.price.toFixed(2)}</td>
                  <td className="p-3 font-poppins text-center font-semibold">{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                    <td colSpan={showItemCodeColumn ? 7 : 6} className="p-12 text-center text-gray-400 font-poppins">
                        No items added yet.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-8">
          <div className="w-full max-w-sm space-y-2 text-gray-700">
            
            {/* Case 1: Prices DO NOT include VAT */}
            {!pricesIncludeTax && (
              <>
                <div className="flex justify-between">
                  <span>المجموع قبل الضريبة:</span>
                  <span className="font-poppins">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (14%):</span>
                  <span className="font-poppins">{tax.toFixed(2)}</span>
                </div>
              </>
            )}

            {/* Case 2: Prices DO include VAT, show subtotal as the base */}
            {pricesIncludeTax && (
                 <div className="flex justify-between">
                  <span>الإجمالي (شامل الضريبة):</span>
                  <span className="font-poppins">{subtotal.toFixed(2)}</span>
                </div>
            )}
            
            {/* Separator before deduction */}
            {(applyCommercialTax && !pricesIncludeTax) && <div className="border-b pt-1"></div>}


            {/* Commercial Tax Deduction - shown in both cases if active */}
            {applyCommercialTax && (
                <div className="flex justify-between pt-1 text-red-600">
                    <span>خصم أ.ت.ص (1%):</span>
                    <span className="font-poppins font-semibold">-{commercialTaxAmount.toFixed(2)}</span>
                </div>
            )}
            
            {/* Final Total */}
            <div className="flex justify-between font-bold text-lg p-2 bg-gray-100 rounded mt-2 border-t-2 border-gray-300">
              <span>الإجمالي النهائي:</span>
              <span className="font-poppins">{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Signature */}
        <div className="mt-12 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold mb-1">شروط الدفع:</p>
              <p className="font-poppins">{paymentTerms}</p>
            </div>
            <div>
              <p className="font-bold mb-1">شروط التسليم:</p>
              <p className="font-poppins">{deliveryTerms}</p>
            </div>
          </div>
          
          {/* ----- START OF MODIFICATION / بداية التعديل ----- */}
          <div className="mt-20 text-right">
            <p className="font-bold">إدارة المشتريات</p>
            
            {/* حاوية الختم والتوقيع */}
            <div className="relative h-28 w-48 mt-2 inline-block">
                <img 
                    src="/assets/seal.png" 
                    alt="Company Seal" 
                    className="absolute top-0 right-0 w-24 h-24"
                />
                <img 
                    src="/assets/signature.png"
                    alt="Signature" 
                    className="absolute bottom-4 left-0 w-40"
                />
            </div>
          </div>
          {/* ----- END OF MODIFICATION / نهاية التعديل ----- */}

        </div>
      </div>
    </div>
  );
};
