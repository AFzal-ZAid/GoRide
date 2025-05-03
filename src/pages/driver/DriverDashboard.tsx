import React, { useEffect, useState } from 'react';
import { Calendar, Car, CheckCircle, DollarSign, MapPin, User } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Ride, useRide } from '../../contexts/RideContext';
import RideMap from '../../components/map/RideMap';
import { motion } from 'framer-motion';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCurrentRide, completeRide, getAvailableRides, isLoading } = useRide();
  
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState({
    today: 87.50,
    week: 432.75,
    month: 1875.20,
  });
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  
  useEffect(() => {
    const loadDriverData = async () => {
      try {
        const ride = await getCurrentRide();
        if (ride) {
          setCurrentRide(ride);
        }
        
        if (!ride) {
          const rides = await getAvailableRides();
          setAvailableRides(rides);
        }
      } catch (error) {
        console.error('Error loading driver data:', error);
      }
    };
    
    loadDriverData();
    
    // Periodically check for new rides
    const interval = setInterval(async () => {
      if (isOnline && !currentRide) {
        try {
          const rides = await getAvailableRides();
          setAvailableRides(rides);
        } catch (error) {
          console.error('Error fetching available rides:', error);
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleCompleteRide = async () => {
    if (!currentRide) return;
    
    try {
      await completeRide(currentRide.id);
      setCurrentRide(null);
      
      // Refresh available rides
      const rides = await getAvailableRides();
      setAvailableRides(rides);
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex-grow px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome, {user?.name || 'Driver'}
          </h1>
          <div className="flex items-center mt-1">
            <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-success-500' : 'bg-neutral-400'}`}></div>
            <p className="text-neutral-600">
              You are currently {isOnline ? 'online' : 'offline'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Earnings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Earnings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-neutral-50 rounded-xl p-4"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <Calendar size={16} className="text-primary-600" />
                      </div>
                      <span className="text-neutral-600">Today</span>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">${earnings.today.toFixed(2)}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-neutral-50 rounded-xl p-4"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <Calendar size={16} className="text-primary-600" />
                      </div>
                      <span className="text-neutral-600">This Week</span>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">${earnings.week.toFixed(2)}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-neutral-50 rounded-xl p-4"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <Calendar size={16} className="text-primary-600" />
                      </div>
                      <span className="text-neutral-600">This Month</span>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">${earnings.month.toFixed(2)}</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Toggle Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Driver Status
                </h2>
                
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isOnline ? 'bg-success-100 text-success-600' : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    <Car size={32} />
                  </div>
                  
                  <p className="text-lg font-medium text-neutral-900 mb-4">
                    {isOnline ? 'You are online' : 'You are offline'}
                  </p>
                  
                  <Button
                    onClick={toggleOnlineStatus}
                    variant={isOnline ? 'error' : 'success'}
                    fullWidth
                  >
                    {isOnline ? 'Go Offline' : 'Go Online'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-pulse-subtle">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Current Ride */}
            {currentRide ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-8"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-neutral-900">Current Ride</h2>
                    <div className="px-3 py-1 bg-success-100 text-success-800 text-sm font-medium rounded-full">
                      {currentRide.status === 'accepted' ? 'Pickup rider' : 'In progress'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="mt-0.5">
                            <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center bg-white z-10 relative">
                              <MapPin size={14} className="text-primary-500" />
                            </div>
                            <div className="h-16 w-0.5 bg-neutral-300 mx-auto my-1"></div>
                            <div className="w-6 h-6 rounded-full border-2 border-primary-700 flex items-center justify-center bg-white">
                              <MapPin size={14} className="text-primary-700" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div>
                              <p className="text-sm text-neutral-500">Pickup</p>
                              <p className="text-neutral-800 font-medium">{currentRide.pickup.address || 'Pickup location'}</p>
                            </div>
                            
                            <div className="mt-10">
                              <p className="text-sm text-neutral-500">Destination</p>
                              <p className="text-neutral-800 font-medium">{currentRide.dropoff.address || 'Dropoff location'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-neutral-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-neutral-600">Fare</span>
                            <span className="font-medium">${currentRide.fare.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-neutral-600">Distance</span>
                            <span className="font-medium">{currentRide.distance.toFixed(1)} miles</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Duration</span>
                            <span className="font-medium">{Math.round(currentRide.duration / 60)} mins</span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleCompleteRide}
                          variant="success"
                          fullWidth
                        >
                          Complete Ride
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 h-80 bg-neutral-100 rounded-lg overflow-hidden">
                      <RideMap ride={currentRide} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : isOnline ? (
              <>
                {/* Available Rides */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-neutral-900">Available Rides</h2>
                  </div>
                  
                  {availableRides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableRides.map((ride, index) => (
                        <motion.div
                          key={ride.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <User size={16} className="text-neutral-500 mr-1" />
                                <span className="text-sm text-neutral-500">Rider #12{index + 345}</span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign size={16} className="text-success-600 mr-1" />
                                <span className="font-medium">${ride.fare.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              <div className="flex items-start">
                                <MapPin size={16} className="text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-sm text-neutral-800 line-clamp-1">{ride.pickup.address || 'Pickup location'}</p>
                              </div>
                              <div className="flex items-start">
                                <MapPin size={16} className="text-primary-700 mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-sm text-neutral-800 line-clamp-1">{ride.dropoff.address || 'Dropoff location'}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                              <span className="text-neutral-600 text-sm">
                                {ride.distance.toFixed(1)} miles • {Math.round(ride.duration / 60)} mins
                              </span>
                              <Button
                                size="sm"
                                leftIcon={<CheckCircle size={14} />}
                                onClick={() => {}}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
                      <p className="text-neutral-600">
                        No rides available at the moment. New ride requests will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <Car size={32} className="text-neutral-400" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  You're currently offline
                </h2>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Go online to start receiving ride requests and earn money.
                </p>
                <Button
                  onClick={toggleOnlineStatus}
                  variant="success"
                >
                  Go Online
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;