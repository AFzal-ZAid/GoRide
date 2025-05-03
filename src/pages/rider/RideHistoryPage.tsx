import React, { useEffect, useState } from 'react';
import { Clock, Info, MapPin, Navigation, ReceiptText, Search } from 'lucide-react';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import { useRide, Ride } from '../../contexts/RideContext';
import { motion } from 'framer-motion';

const RideHistoryPage: React.FC = () => {
  const { getRideHistory, rideHistory, isLoading } = useRide();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  
  useEffect(() => {
    const loadRideHistory = async () => {
      await getRideHistory();
    };
    
    loadRideHistory();
  }, []);

  useEffect(() => {
    if (rideHistory) {
      setFilteredRides(
        rideHistory.filter((ride) => {
          const searchLower = searchTerm.toLowerCase();
          
          return (
            ride.pickup.address?.toLowerCase().includes(searchLower) ||
            ride.dropoff.address?.toLowerCase().includes(searchLower) ||
            new Date(ride.createdAt).toLocaleDateString().includes(searchTerm)
          );
        })
      );
    }
  }, [searchTerm, rideHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex-grow px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            Ride History
          </h1>
          <p className="text-neutral-600">
            View details of all your past rides
          </p>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search by location or date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            leftIcon={<Search size={18} />}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-pulse-subtle">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="grid gap-4">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <Clock size={16} className="text-neutral-500 mr-2" />
                      <span className="text-neutral-700">{formatDate(ride.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${ride.status === 'completed' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-error-100 text-error-800'}
                      `}>
                        {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-start mb-4">
                        <div className="mt-0.5">
                          <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center bg-white z-10 relative">
                            <MapPin size={14} className="text-primary-500" />
                          </div>
                          <div className="h-16 w-0.5 bg-neutral-300 mx-auto my-1"></div>
                          <div className="w-6 h-6 rounded-full border-2 border-primary-700 flex items-center justify-center bg-white">
                            <Navigation size={14} className="text-primary-700" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div>
                            <p className="text-sm text-neutral-500">Pickup</p>
                            <p className="text-neutral-800 font-medium">{ride.pickup.address || 'Pickup location'}</p>
                          </div>
                          
                          <div className="mt-10">
                            <p className="text-sm text-neutral-500">Destination</p>
                            <p className="text-neutral-800 font-medium">{ride.dropoff.address || 'Dropoff location'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <h3 className="font-semibold text-neutral-900 flex items-center mb-3">
                        <Info size={16} className="mr-2" />
                        Ride Details
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Total Fare</span>
                          <span className="font-medium text-neutral-900">${ride.fare.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Distance</span>
                          <span className="text-neutral-700">{ride.distance.toFixed(1)} miles</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Duration</span>
                          <span className="text-neutral-700">{Math.round(ride.duration / 60)} mins</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Payment</span>
                          <div className="flex items-center">
                            <ReceiptText size={14} className="text-success-600 mr-1" />
                            <span className="text-success-600">Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center my-8">
            {searchTerm ? (
              <>
                <p className="text-lg font-medium text-neutral-700 mb-2">No matching rides found</p>
                <p className="text-neutral-600">
                  We couldn't find any rides matching "{searchTerm}". Try a different search.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-neutral-700 mb-2">No ride history</p>
                <p className="text-neutral-600">
                  You haven't taken any rides yet. Book your first ride today!
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistoryPage;