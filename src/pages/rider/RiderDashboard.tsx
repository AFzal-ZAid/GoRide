import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, MapPin, Navigation, ReceiptText } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Ride, useRide } from '../../contexts/RideContext';
import { motion } from 'framer-motion';
import RideMap from '../../components/map/RideMap';

const RiderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRide, rideHistory, getCurrentRide, getRideHistory, cancelRide, isLoading } = useRide();
  
  const [recentRides, setRecentRides] = useState<Ride[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      await getCurrentRide();
      await getRideHistory();
    };
    
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (rideHistory?.length > 0) {
      setRecentRides(rideHistory.slice(0, 3));
    }
  }, [rideHistory]);

  const handleCancelRide = async () => {
    if (!currentRide) return;
    
    try {
      await cancelRide(currentRide.id);
    } catch (error) {
      console.error('Failed to cancel ride:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex-grow px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome, {user?.name || 'Rider'}
          </h1>
          <p className="text-neutral-600">
            {currentRide ? 'Your ride is in progress' : 'Ready to book your next ride?'}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-pulse-subtle">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {currentRide ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-8"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-neutral-900">Current Ride</h2>
                    <div className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                      {currentRide.status === 'requested' && 'Looking for driver'}
                      {currentRide.status === 'accepted' && 'Driver on the way'}
                      {currentRide.status === 'in-progress' && 'In progress'}
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
                              <Navigation size={14} className="text-primary-700" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div>
                              <p className="text-sm text-neutral-500">Pickup</p>
                              <p className="text-neutral-800 font-medium">{currentRide.pickup.address || 'Current location'}</p>
                            </div>
                            
                            <div className="mt-10">
                              <p className="text-sm text-neutral-500">Destination</p>
                              <p className="text-neutral-800 font-medium">{currentRide.dropoff.address || 'Destination location'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-neutral-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-neutral-600">Estimated fare</span>
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
                        
                        {currentRide.status === 'requested' && (
                          <Button
                            variant="error"
                            onClick={handleCancelRide}
                            fullWidth
                          >
                            Cancel Ride
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 h-80 bg-neutral-100 rounded-lg overflow-hidden">
                      <RideMap ride={currentRide} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-8"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <Car size={32} className="text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                    Need a ride?
                  </h2>
                  <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                    Book a ride now and get to your destination safely and comfortably.
                  </p>
                  <Button
                    onClick={() => navigate('/rider/book')}
                    size="lg"
                  >
                    Book a Ride
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Recent Rides */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">Recent Rides</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/rider/history')}
                >
                  View All
                </Button>
              </div>
              
              {recentRides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentRides.map((ride) => (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Clock size={16} className="text-neutral-500 mr-1" />
                            <span className="text-sm text-neutral-500">{formatDate(ride.createdAt)}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            ride.status === 'completed' 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-start">
                            <MapPin size={16} className="text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-neutral-800 line-clamp-1">{ride.pickup.address || 'Pickup location'}</p>
                          </div>
                          <div className="flex items-start">
                            <Navigation size={16} className="text-primary-700 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-neutral-800 line-clamp-1">{ride.dropoff.address || 'Dropoff location'}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-3 border-t border-neutral-200">
                          <div className="flex items-center">
                            <ReceiptText size={16} className="text-neutral-500 mr-1" />
                            <span className="font-medium">${ride.fare.toFixed(2)}</span>
                          </div>
                          <span className="text-sm text-neutral-600">
                            {ride.distance.toFixed(1)} miles
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
                  <p className="text-neutral-600">
                    You haven't taken any rides yet. Book your first ride today!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;