import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    const success = await login(email, password);
    if (success) {
      showToast('Welcome back to LUXORA!', 'success');
      navigate('/home');
    }
  };

  const handleDemoFill = () => {
    setEmail('jithu@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="pt-4 flex items-center justify-between">
        <span className="font-serif text-2xl font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          LUXORA
        </span>
        <button
          onClick={handleDemoFill}
          className="text-[11px] font-semibold uppercase tracking-wider text-luxora-gold border border-luxora-gold/30 px-3 py-1.5 rounded-full"
        >
          Quick Fill Demo
        </button>
      </div>

      {/* Main Form Area */}
      <div className="my-auto py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-luxora-primary dark:text-luxora-dark-primary mb-1">
            Welcome back.
          </h1>
          <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
            Your next favorite luxury piece is waiting.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-luxora-error/10 border border-luxora-error/30 text-luxora-error text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary hover:text-luxora-gold transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button variant="primary" fullWidth isLoading={isLoading} type="submit">
            Sign In
          </Button>

          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-luxora-divider dark:border-luxora-dark-divider" />
            <span className="absolute bg-luxora-bg dark:bg-luxora-dark-bg px-3 text-[10px] uppercase font-semibold text-luxora-secondary">
              Or continue with
            </span>
          </div>

          <Button
            variant="outline"
            fullWidth
            type="button"
            onClick={() => {
              showToast('Google OAuth simulated successfully', 'info');
              login('jithu@example.com', 'password123').then(() => navigate('/home'));
            }}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-luxora-primary dark:text-white underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
