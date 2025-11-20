import React from 'react';

interface Supplier {
  id?: number;
  name: string;
  website: string;
  relevance_score: number;
  notes: string;
}

interface SupplierCardProps {
  supplier: Supplier;
  onSave: (supplier: Supplier) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onSave }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{supplier.name}</h3>
          <a 
            href={supplier.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline text-sm"
          >
            {supplier.website || "No website provided"}
          </a>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          Score: {supplier.relevance_score}
        </div>
      </div>
      
      <p className="mt-4 text-gray-600 text-sm whitespace-pre-wrap">
        {supplier.notes}
      </p>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onSave(supplier)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Supplier
        </button>
      </div>
    </div>
  );
};

export default SupplierCard;
