import React from 'react';
import { Home, Building2, Users, Trash2, Edit } from 'lucide-react';
import { Address } from '../types/address';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSelect: (address: Address) => void;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const getIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return Home;
      case 'office':
        return Building2;
      default:
        return Users;
    }
  };

  return (
    <div className="space-y-4">
      {addresses.map((address) => {
        const Icon = getIcon(address.type);
        return (
          <div
            key={address.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium capitalize">{address.type}</h3>
                  <p className="text-sm text-gray-600 mt-1">{address.fullAddress}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(address)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(address.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => onSelect(address)}
              className="mt-3 w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Deliver Here
            </button>
          </div>
        );
      })}
    </div>
  );
}