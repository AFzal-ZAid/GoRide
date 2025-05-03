import React from 'react';
import { Car } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="bg-primary-600 text-white rounded-full p-2">
        <Car size={20} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default Logo;