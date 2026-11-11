import React from 'react';
export * from './useBankingStore';
import { useBankingStore } from './useBankingStore';

// Provide backward-compatible Provider wrapper and hook alias
export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useAdminStore = useBankingStore;
