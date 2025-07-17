import React from 'react';
import { PurchaseOrderData } from '../types';

interface SavedOrdersProps {
    savedPOs: PurchaseOrderData[];
    onLoad: (poNumber: string) => void;
    onDelete: (poNumber: string) => void;
}

export const SavedOrders: React.FC<SavedOrdersProps> = ({ savedPOs, onLoad, onDelete }) => {
    return (
        <details className="mb-6 bg-gray-50 rounded-lg border border-gray-200" open>
            <summary className="p-4 font-semibold text-lg text-gray-800 cursor-pointer hover:bg-gray-100 rounded-t-lg transition-colors flex justify-between items-center">
                <span>أوامر التوريد المحفوظة ({savedPOs.length})</span>
                <span className="text-sm font-normal text-gray-500">Click to toggle</span>
            </summary>
            <div className="border-t border-gray-200 p-4 max-h-60 overflow-y-auto">
                {savedPOs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No saved purchase orders yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {savedPOs.map((po) => (
                            <li key={po.poNumber} className="p-3 bg-white rounded-md border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition-shadow">
                                <div className="flex-grow">
                                    <p className="font-bold text-gray-900 font-poppins">{po.poNumber}</p>
                                    <p className="text-sm text-gray-600">{po.supplier}</p>
                                    <p className="text-xs text-gray-400 font-poppins">
                                        Saved: {new Date(po.savedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 flex gap-2">
                                    <button
                                        onClick={() => onLoad(po.poNumber)}
                                        className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
                                    >
                                        Load
                                    </button>
                                    <button
                                        onClick={() => onDelete(po.poNumber)}
                                        className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </details>
    );
};
