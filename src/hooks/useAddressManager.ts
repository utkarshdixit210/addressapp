import { useState } from 'react';
import { Address } from '../types/address';

export const useAddressManager = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses(prev => [...prev, newAddress]);
  };

  const editAddress = (address: Address) => {
    setAddresses(prev =>
      prev.map(addr => (addr.id === address.id ? address : addr))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return {
    addresses,
    addAddress,
    editAddress,
    deleteAddress,
  };
};