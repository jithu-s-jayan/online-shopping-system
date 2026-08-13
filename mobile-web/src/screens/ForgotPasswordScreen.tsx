import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-luxora-bg dark:bg-luxora-dark-bg flex flex-col justify-between p-6">
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-luxora-primary dark:text-luxora-dark-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif text-2xl font-bold tracking-tight text-luxora-primary dark:text-luxora-dark-primary">
          LUXORA
        </span>
      </div>

      <div className="my-auto max-w-sm w-full mx-auto">
        {!isSubmitted ? (
          <div>
            <h1 className="font-serif text-2xl font-bold text-luxora-primary dark:text-luxora-dark-primary mb-1">
              Reset your password
            </h1>
            <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

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

              <Button variant="primary" fullWidth type="submit">
                Send Reset Link
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-luxora-gold-soft/30 text-luxora-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-bold text-luxora-primary dark:text-luxora-dark-primary mb-2">
              Reset link sent!
            </h2>
            <p className="text-xs text-luxora-secondary dark:text-luxora-dark-secondary mb-6">
              We have sent password recovery instructions to <strong className="text-luxora-primary">{email}</strong>.
            </p>

            <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
              Return to Sign In
            </Button>
          </div>
        )}
      </div>

      <div className="text-center pb-4">
        <Link to="/login" className="text-xs font-semibold text-luxora-secondary hover:text-luxora-primary">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
