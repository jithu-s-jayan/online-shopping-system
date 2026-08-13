import React from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { Address } from '../../types';

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, isSelected, onSelect, onEdit }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
        isSelected
          ? 'border-luxora-gold bg-luxora-gold-soft/20 dark:bg-luxora-gold/10 shadow-subtle'
          : 'border-luxora-divider dark:border-luxora-dark-divider bg-luxora-surface dark:bg-luxora-dark-surface'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className={`w-4 h-4 ${isSelected ? 'text-luxora-gold' : 'text-luxora-secondary'}`} />
          <h4 className="font-sans text-sm font-semibold text-luxora-primary dark:text-luxora-dark-primary">
            {address.fullName}
          </h4>
          {address.isDefault && (
            <span className="text-[10px] bg-luxora-primary text-white dark:bg-luxora-dark-primary dark:text-luxora-dark-bg px-2 py-0.5 rounded font-medium">
              DEFAULT
            </span>
          )}
        </div>
        {isSelected && <CheckCircle2 className="w-5 h-5 text-luxora-gold shrink-0" />}
      </div>

      <div className="mt-2 text-xs text-luxora-secondary dark:text-luxora-dark-secondary space-y-0.5 pl-6">
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} — {address.postalCode}
        </p>
        <p className="font-medium text-luxora-primary dark:text-luxora-dark-primary mt-1">Phone: {address.phone}</p>
      </div>

      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="mt-3 text-xs font-semibold text-luxora-gold underline pl-6"
        >
          Edit Address
        </button>
      )}
    </div>
  );
};
