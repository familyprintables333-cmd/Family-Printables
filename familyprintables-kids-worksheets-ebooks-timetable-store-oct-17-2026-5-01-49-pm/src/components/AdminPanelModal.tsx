import React from 'react';
import { AdminPortal } from './AdminPortal';
import { Product, MerchantSettings } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  merchantSettings: MerchantSettings;
  onUpdateMerchantSettings: (settings: MerchantSettings) => void;
  logoUrl: string;
  onUpdateLogoUrl: (url: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  merchantSettings,
  onUpdateMerchantSettings,
  logoUrl,
  onUpdateLogoUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <AdminPortal
        products={products}
        onUpdateProducts={onUpdateProducts}
        merchantSettings={merchantSettings}
        onUpdateMerchantSettings={onUpdateMerchantSettings}
        logoUrl={logoUrl}
        onUpdateLogoUrl={onUpdateLogoUrl}
        onClose={onClose}
      />
    </div>
  );
};
