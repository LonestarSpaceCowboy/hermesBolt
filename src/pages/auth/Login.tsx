import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AtSign, Github, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithProvider, resendConfirmationEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'Email not confirmed') {
        setError(
          <span>
            Please confirm your email address before logging in.{' '}
            <button
              onClick={handleResendConfirmation}
              disabled={isResendingConfirmation}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium underline"
            >
              {isResendingConfirmation ? 'Sending...' : 'Resend confirmation email'}
            </button>
          </span>
        );
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsResendingConfirmation(true);
    try {
      await resendConfirmationEmail(email);
      setError(
        <span>
          Confirmation email sent! Please check your inbox and spam folder.
        </span>
      );
    } catch (error) {
      console.error('Error resending confirmation:', error);
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const handleProviderLogin = async (provider: 'google' | 'github') => {
    try {
      await signInWithProvider(provider);
      // Redirect happens automatically after successful auth
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(`${provider} login failed. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              leftElement={<Mail size={18} />}
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              leftElement={<Lock size={18} />}
              fullWidth
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => handleProviderLogin('google')}
                leftIcon={<AtSign size={18} />}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => handleProviderLogin('github')}
                leftIcon={<Github size={18} />}
              >
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;