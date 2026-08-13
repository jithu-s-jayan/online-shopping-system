import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { AddressCard } from '../components/checkout/AddressCard';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export const AddressesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, addAddress, deleteAddress } = useAuthStore();
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
      showToast('New shipping address saved', 'success');
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/profile')} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="label-caps text-[10px] text-luxora-gold">DELIVERY LOCATIONS</span>
              <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
                Saved Addresses
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-luxora-gold"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              address={addr}
              onEdit={() => {
                deleteAddress(addr._id!);
                showToast('Address removed', 'info');
              }}
            />
          ))}
        </div>
      </main>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Address">
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
            placeholder="Flat, House No, Street"
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
            label="Pincode"
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

      <BottomNavigation />
    </div>
  );
};
