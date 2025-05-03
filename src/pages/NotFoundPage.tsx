import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-primary-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-neutral-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          
          <Button
            onClick={() => navigate('/')}
            size="lg"
            leftIcon={<Home size={18} />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;