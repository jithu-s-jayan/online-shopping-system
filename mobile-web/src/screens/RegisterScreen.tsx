import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export const RegisterScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { label: 'Medium', color: 'bg-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const success = await register({ firstName, lastName, email, phone, password });
    if (success) {
      showToast('Account created successfully!', 'success');
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="pt-4 flex items-center justify-between">
        <span className="font-serif text-2xl font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          LUXORA
        </span>
        <Link to="/login" className="text-xs font-semibold text-luxora-secondary dark:text-luxora-dark-secondary">
          Sign In
        </Link>
      </div>

      {/* Main Content */}
      <div className="my-auto py-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-luxora-primary dark:text-luxora-dark-primary mb-1">
            Create account.
          </h1>
          <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
            Join LUXORA for an elevated shopping experience.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-luxora-error/10 border border-luxora-error/30 text-luxora-error text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="Jithu"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="Last Name"
              placeholder="Kumar"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          {password && (
            <div className="flex items-center gap-2 text-[10px] font-semibold text-luxora-secondary">
              <span>Password strength:</span>
              <div className="flex-1 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all`} style={{ width: password.length > 8 ? '100%' : '50%' }} />
              </div>
              <span className="capitalize">{strength.label}</span>
            </div>
          )}

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button variant="primary" fullWidth isLoading={isLoading} type="submit" className="mt-2">
            Create Account
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-luxora-primary dark:text-white underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
