import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PurchaseOrderForm } from './components/PurchaseOrderForm';
import { PurchaseOrderPreview } from './components/PurchaseOrderPreview';
import { LineItem, PurchaseOrderData } from './types';

const TAX_RATE = 0.14;
const COMMERCIAL_TAX_RATE = 0.01;
const LOCAL_STORAGE_KEY = 'savedPurchaseOrders';


const App: React.FC = () => {
  const [supplier, setSupplier] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>('');
  const [deliveryTerms, setDeliveryTerms] = useState<string>('');
  const [items, setItems] = useState<LineItem[]>([]);
  
  const [poNumberCounter, setPoNumberCounter] = useState<number>(1);
  const [pricesIncludeTax, setPricesIncludeTax] = useState<boolean>(false);
  const [applyCommercialTax, setApplyCommercialTax] = useState<boolean>(false);

  const [savedPOs, setSavedPOs] = useState<PurchaseOrderData[]>([]);

  // Load saved POs from localStorage on initial render
  useEffect(() => {
    try {
      const storedPOs = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPOs) {
        const parsedPOs: PurchaseOrderData[] = JSON.parse(storedPOs);
        setSavedPOs(parsedPOs);
        // Set the counter to the next available number
        const maxCounter = parsedPOs.length > 0 
            ? Math.max(...parsedPOs.map(po => po.poNumberCounter)) 
            : 0;
        setPoNumberCounter(maxCounter + 1);
      }
    } catch (error) {
      console.error("Failed to load POs from localStorage", error);
    }
  }, []);

  // Save POs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedPOs));
    } catch (error) {
      console.error("Failed to save POs to localStorage", error);
    }
  }, [savedPOs]);


  const poNumber = useMemo(() => {
    const year = new Date().getFullYear();
    return `PO # ${String(poNumberCounter).padStart(5, '0')}-${year}`;
  }, [poNumberCounter]);
  
  const currentDate = useMemo(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  const handleAddItem = useCallback(() => {
    setItems(prevItems => [...prevItems, { id: Date.now(), code: '', description: '', quantity: 1, price: 0, unit: '' }]);
  }, []);

  const handleRemoveItem = useCallback((indexToRemove: number) => {
    setItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleUpdateItem = useCallback((indexToUpdate: number, updatedItem: LineItem) => {
    setItems(prevItems => prevItems.map((item, index) => index === indexToUpdate ? updatedItem : item));
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0);
  }, [items]);

  const tax = useMemo(() => {
    if (pricesIncludeTax) return 0;
    return subtotal * TAX_RATE;
  }, [subtotal, pricesIncludeTax]);

  const commercialTaxAmount = useMemo(() => {
    if (!applyCommercialTax) return 0;
    return subtotal * COMMERCIAL_TAX_RATE;
  }, [subtotal, applyCommercialTax]);
  
  const total = useMemo(() => {
    const totalBeforeCommercialTax = pricesIncludeTax ? subtotal : subtotal + tax;
    return totalBeforeCommercialTax - commercialTaxAmount;
  }, [subtotal, tax, pricesIncludeTax, commercialTaxAmount]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSavePO = useCallback(() => {
    const poData: PurchaseOrderData = {
        poNumber,
        poNumberCounter,
        supplier,
        paymentTerms,
        deliveryTerms,
        items,
        pricesIncludeTax,
        applyCommercialTax,
        savedAt: new Date().toISOString(),
    };

    setSavedPOs(prevPOs => {
        const existingIndex = prevPOs.findIndex(p => p.poNumber === poNumber);
        if (existingIndex > -1) {
            const updatedPOs = [...prevPOs];
            updatedPOs[existingIndex] = poData;
            alert(`Purchase Order ${poNumber} updated successfully!`);
            return updatedPOs;
        } else {
            alert(`Purchase Order ${poNumber} saved successfully!`);
            return [...prevPOs, poData].sort((a, b) => b.poNumberCounter - a.poNumberCounter);
        }
    });
  }, [poNumber, poNumberCounter, supplier, paymentTerms, deliveryTerms, items, pricesIncludeTax, applyCommercialTax]);

  const handleLoadPO = useCallback((poNumberToLoad: string) => {
      const poToLoad = savedPOs.find(p => p.poNumber === poNumberToLoad);
      if (poToLoad) {
          setPoNumberCounter(poToLoad.poNumberCounter);
          setSupplier(poToLoad.supplier);
          setPaymentTerms(poToLoad.paymentTerms);
          setDeliveryTerms(poToLoad.deliveryTerms);
          const loadedItems = poToLoad.items.map(item => ({...item, id: Date.now() + Math.random()}));
          setItems(loadedItems);
          setPricesIncludeTax(poToLoad.pricesIncludeTax);
          setApplyCommercialTax(poToLoad.applyCommercialTax);
          alert(`Purchase Order ${poNumberToLoad} loaded.`);
      }
  }, [savedPOs]);

  const handleDeletePO = useCallback((poNumberToDelete: string) => {
      if (window.confirm(`Are you sure you want to delete PO ${poNumberToDelete}? This action cannot be undone.`)) {
          setSavedPOs(prevPOs => prevPOs.filter(p => p.poNumber !== poNumberToDelete));
          alert(`Purchase Order ${poNumberToDelete} has been deleted.`);
      }
  }, []);

  const handleNewPO = useCallback(() => {
      setSupplier('');
      setPaymentTerms('Cash');
      setDeliveryTerms('Your location');
      setItems([{ id: Date.now(), code: '', description: '', quantity: 1, price: 0, unit: 'EA' }]);
      setPricesIncludeTax(false);
      setApplyCommercialTax(false);

      const maxCounter = savedPOs.length > 0
          ? Math.max(...savedPOs.map(po => po.poNumberCounter))
          : 0;
      setPoNumberCounter(maxCounter + 1);
      alert('New purchase order created. Ready to edit.');
  }, [savedPOs]);


  return (
    <main className="bg-slate-100 min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="no-print lg:sticky lg:top-8 flex flex-col gap-y-6">
          <PurchaseOrderForm 
            supplier={supplier}
            setSupplier={setSupplier}
            paymentTerms={paymentTerms}
            setPaymentTerms={setPaymentTerms}
            deliveryTerms={deliveryTerms}
            setDeliveryTerms={setDeliveryTerms}
            items={items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            handlePrint={handlePrint}
            pricesIncludeTax={pricesIncludeTax}
            setPricesIncludeTax={setPricesIncludeTax}
            applyCommercialTax={applyCommercialTax}
            setApplyCommercialTax={setApplyCommercialTax}
            savedPOs={savedPOs}
            onSave={handleSavePO}
            onLoad={handleLoadPO}
            onDelete={handleDeletePO}
            onNew={handleNewPO}
          />
        </div>
        <div id="po-preview-container" className="w-full">
          <PurchaseOrderPreview 
            poNumber={poNumber}
            date={currentDate}
            supplier={supplier}
            items={items}
            paymentTerms={paymentTerms}
            deliveryTerms={deliveryTerms}
            subtotal={subtotal}
            tax={tax}
            total={total}
            pricesIncludeTax={pricesIncludeTax}
            applyCommercialTax={applyCommercialTax}
            commercialTaxAmount={commercialTaxAmount}
          />
        </div>
      </div>
    </main>
  );
};

export default App;
