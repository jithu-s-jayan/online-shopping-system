import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Search } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useUIStore } from '../store/useUIStore';
import { Product } from '../types';
import api from '../services/api';

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useUIStore((state) => state.showToast);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [price, setPrice] = useState<number | ''>('');
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(20);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/products?search=${encodeURIComponent(search)}&limit=50`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', {
        name,
        brand,
        category,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        stock: Number(stock),
        description,
        images: [imageUrl || 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80'],
        variants: { colors: ['Black', 'Cream'], sizes: ['M', 'L'] }
      });

      if (res.data.success) {
        showToast('Product created successfully', 'success');
        setIsAddModalOpen(false);
        fetchProducts();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted', 'info');
      fetchProducts();
    } catch (err: any) {
      showToast('Failed to delete product', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between border-b border-luxora-divider pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">LUXORA INVENTORY</span>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              Product Management
            </h1>
          </div>
        </div>

        <Button variant="gold" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-luxora-secondary" />
        <input
          type="text"
          placeholder="Filter catalog by product name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider rounded-xl text-xs"
        />
      </div>

      {/* Product List */}
      <div className="space-y-2.5">
        {isLoading ? (
          <Skeleton className="w-full h-40" />
        ) : products.map((prod) => (
          <div
            key={prod._id}
            className="p-3 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider shadow-subtle flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <img src={prod.images[0]} alt={prod.name} className="w-12 h-14 object-cover rounded-lg bg-neutral-100" />
              <div>
                <span className="label-caps text-[9px] text-luxora-gold">{prod.brand}</span>
                <h4 className="font-bold text-luxora-primary dark:text-luxora-dark-primary line-clamp-1">{prod.name}</h4>
                <span className="text-[10px] text-luxora-secondary">Stock: {prod.stock} units | Category: {prod.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="font-bold text-luxora-primary dark:text-luxora-dark-primary block">
                  ₹{(prod.discountPrice || prod.price).toLocaleString()}
                </span>
                {prod.discountPrice && (
                  <span className="text-[10px] text-luxora-secondary line-through">₹{prod.price.toLocaleString()}</span>
                )}
              </div>

              <button onClick={() => handleDeleteProduct(prod._id)} className="p-2 text-luxora-secondary hover:text-luxora-error">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
        <form onSubmit={handleCreateProduct} className="space-y-3">
          <Input label="Product Name" placeholder="Aurelia Cashmere Coat" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Brand" placeholder="Luxora Atelier" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          
          <div>
            <label className="label-caps text-[11px] text-luxora-secondary block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider rounded-md text-xs"
            >
              <option value="Fashion">Fashion</option>
              <option value="Footwear">Footwear</option>
              <option value="Beauty">Beauty</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input label="Price (₹)" type="number" placeholder="25000" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
            <Input label="Discount Price (₹)" type="number" placeholder="19999" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} />
          </div>

          <Input label="Stock Quantity" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
          <Input label="Image URL" placeholder="https://images.unsplash.com/..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
          
          <div>
            <label className="label-caps text-[11px] text-luxora-secondary block mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Product details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-luxora-surface dark:bg-luxora-dark-surface border border-luxora-divider rounded-md text-xs focus:outline-none"
              required
            />
          </div>

          <Button variant="gold" fullWidth type="submit">
            Create Product
          </Button>
        </form>
      </Modal>
    </div>
  );
};
