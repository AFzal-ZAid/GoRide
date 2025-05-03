import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AtSign, Lock, User, Phone } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState<'rider' | 'driver'>('rider');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      await register({
        name,
        email,
        password,
        userType,
        phoneNumber,
      });
      
      // Redirect based on user type
      if (userType === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/rider/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex flex-grow items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
          <div>
            <h2 className="mt-4 text-center text-3xl font-bold text-neutral-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-600">
              Join RideShare today and get moving
            </p>
          </div>
          
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                fullWidth
                leftIcon={<User size={18} />}
              />
              
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                fullWidth
                leftIcon={<AtSign size={18} />}
              />
              
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                fullWidth
                leftIcon={<Lock size={18} />}
              />
              
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                fullWidth
                leftIcon={<Phone size={18} />}
              />
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  I want to:
                </label>
                <div className="flex space-x-4">
                  <div 
                    className={`
                      flex-1 py-3 px-4 border rounded-lg cursor-pointer transition
                      ${userType === 'rider' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'}
                    `}
                    onClick={() => setUserType('rider')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="userType"
                        checked={userType === 'rider'}
                        onChange={() => setUserType('rider')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                      />
                      <span className="ml-2 font-medium">Book rides</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`
                      flex-1 py-3 px-4 border rounded-lg cursor-pointer transition
                      ${userType === 'driver' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'}
                    `}
                    onClick={() => setUserType('driver')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="userType"
                        checked={userType === 'driver'}
                        onChange={() => setUserType('driver')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                      />
                      <span className="ml-2 font-medium">Drive & earn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;