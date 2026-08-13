import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import api from '../services/api';

export const AdminCustomers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/admin/customers');
        setCustomers(res.data.customers || []);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3 border-b border-luxora-divider pb-4">
        <button onClick={() => navigate('/admin')} className="p-2 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="label-caps text-[10px] text-luxora-gold">LUXORA MANAGEMENT</span>
          <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
            Customer Directory
          </h1>
        </div>
      </div>

      <div className="space-y-2.5">
        {isLoading ? (
          <Skeleton className="w-full h-24" />
        ) : customers.map((c) => (
          <div
            key={c._id}
            className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider shadow-subtle flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-luxora-gold-soft/30 text-luxora-gold flex items-center justify-center font-bold">
                {c.firstName?.[0]}
              </div>
              <div>
                <h4 className="font-semibold text-luxora-primary dark:text-luxora-dark-primary">
                  {c.firstName} {c.lastName}
                </h4>
                <span className="text-[10px] text-luxora-secondary">{c.email} | {c.phone || 'No Phone'}</span>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Active Member
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
