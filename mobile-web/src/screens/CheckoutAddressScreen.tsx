import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { StepProgress } from '../components/navigation/StepProgress';
import { AddressCard } from '../components/checkout/AddressCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export const CheckoutAddressScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  const addresses = user?.addresses || [
    {
      _id: 'default-1',
      fullName: user ? `${user.firstName} ${user.lastName}` : 'Jithu Kumar',
      phone: user?.phone || '+91 98765 43210',
      street: '42 Luxury Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      isDefault: true
    }
  ];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?._id || addresses[0]?._id || ''
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAddress({
      fullName: newFullName,
      phone: newPhone,
      street: newStreet,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      country: 'India',
      isDefault: false
    });

    if (success) {
      showToast('New shipping address added', 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleContinue = () => {
    const selected = addresses.find((a) => a._id === selectedAddressId) || addresses[0];
    sessionStorage.setItem('luxora_selected_address', JSON.stringify(selected));
    navigate('/checkout/delivery');
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-luxora-divider/40 dark:border-luxora-dark-divider/40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif text-lg font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          Checkout
        </span>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <StepProgress currentStep={1} />

        <div className="flex items-center justify-between pt-2">
          <h2 className="font-serif text-lg font-semibold text-luxora-primary dark:text-luxora-dark-primary">
            Select Shipping Address
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-luxora-gold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New
          </button>
        </div>

        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              address={addr}
              isSelected={selectedAddressId === addr._id}
              onSelect={() => setSelectedAddressId(addr._id!)}
            />
          ))}
        </div>
      </main>

      {/* Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-luxora-divider dark:border-luxora-dark-divider p-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] max-w-md mx-auto">
        <Button variant="gold" fullWidth onClick={handleContinue}>
          Continue to Delivery Method
        </Button>
      </div>

      {/* Add Address Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Shipping Address">
        <form onSubmit={handleAddNewAddress} className="space-y-3">
          <Input
            label="Full Name"
            placeholder="Recipient Name"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            required
          />
          <Input
            label="Street Address"
            placeholder="Flat, House No, Building, Street"
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="City"
              placeholder="Mumbai"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              required
            />
            <Input
              label="State"
              placeholder="Maharashtra"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              required
            />
          </div>
          <Input
            label="Pincode / Zip Code"
            placeholder="400050"
            value={newPostalCode}
            onChange={(e) => setNewPostalCode(e.target.value)}
            required
          />
          <Button variant="primary" fullWidth type="submit" className="mt-2">
            Save Address
          </Button>
        </form>
      </Modal>
    </div>
  );
};
