import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Tag, PackageCheck, Sparkles } from 'lucide-react';
import { TopAppBar } from '../components/navigation/TopAppBar';
import { BottomNavigation } from '../components/navigation/BottomNavigation';

const notificationList = [
  {
    id: 1,
    type: 'ORDER',
    title: 'Order Status Update',
    message: 'Your order LX-948210 has been dispatched via Express Courier.',
    time: '2 hours ago',
    icon: PackageCheck
  },
  {
    id: 2,
    type: 'PROMO',
    title: 'Exclusive Autumn Offer',
    message: 'Enjoy 20% off high-end cashmere outerwear with promo code ELEVATE20.',
    time: '1 day ago',
    icon: Tag
  },
  {
    id: 3,
    type: 'SYSTEM',
    title: 'Welcome to LUXORA VIP',
    message: 'Your account has been granted tier-one concierge member benefits.',
    time: '3 days ago',
    icon: Sparkles
  }
];

export const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg pb-24">
      <TopAppBar />

      <main className="max-w-md mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-luxora-primary dark:text-luxora-dark-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="label-caps text-[10px] text-luxora-gold">ACTIVITY FEED</span>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary">
              Notifications
            </h1>
          </div>
        </div>

        <div className="space-y-3">
          {notificationList.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className="p-4 bg-luxora-surface dark:bg-luxora-dark-surface rounded-xl border border-luxora-divider/50 dark:border-luxora-dark-divider/50 shadow-subtle flex items-start gap-3"
              >
                <div className="p-2.5 bg-luxora-gold-soft/30 text-luxora-gold rounded-lg shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-sans text-xs font-semibold text-luxora-primary dark:text-luxora-dark-primary truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-luxora-secondary">{notif.time}</span>
                  </div>
                  <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary leading-snug">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
