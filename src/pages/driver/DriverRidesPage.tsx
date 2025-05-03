import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, ChevronDown, ChevronUp, DollarSign, Filter, MapPin, Search, User } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Ride, useRide } from '../../contexts/RideContext';
import { motion } from 'framer-motion';

const DriverRidesPage: React.FC = () => {
  const { getAvailableRides, acceptRide, isLoading } = useRide();
  
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [filters, setFilters] = useState({
    minFare: '',
    maxDistance: '',
  });

  useEffect(() => {
    const loadAvailableRides = async () => {
      try {
        const rides = await getAvailableRides();
        setAvailableRides(rides);
        setFilteredRides(rides);
      } catch (error) {
        console.error('Error loading available rides:', error);
      }
    };
    
    loadAvailableRides();
    
    // Periodically check for new rides
    const interval = setInterval(loadAvailableRides, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply filters and search term to available rides
    let filtered = [...availableRides];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((ride) => {
        return (
          ride.pickup.address?.toLowerCase().includes(searchLower) ||
          ride.dropoff.address?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply fare filter
    if (filters.minFare) {
      const minFare = parseFloat(filters.minFare);
      filtered = filtered.filter((ride) => ride.fare >= minFare);
    }
    
    // Apply distance filter
    if (filters.maxDistance) {
      const maxDistance = parseFloat(filters.maxDistance);
      filtered = filtered.filter((ride) => ride.distance <= maxDistance);
    }
    
    setFilteredRides(filtered);
  }, [searchTerm, filters, availableRides]);

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId);
      
      // Remove accepted ride from the list
      const updatedRides = availableRides.filter((ride) => ride.id !== rideId);
      setAvailableRides(updatedRides);
      setFilteredRides(updatedRides);
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters are already applied via useEffect
  };

  const clearFilters = () => {
    setFilters({
      minFare: '',
      maxDistance: '',
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex-grow px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            Available Rides
          </h1>
          <p className="text-neutral-600">
            Browse and accept ride requests from nearby riders
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search by location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                leftIcon={<Search size={18} />}
              />
            </div>
            <div>
              <Button
                variant="outline"
                onClick={toggleFilters}
                rightIcon={showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                leftIcon={<Filter size={18} />}
              >
                Filters
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-white rounded-xl shadow-sm border border-neutral-200 p-4"
            >
              <form onSubmit={applyFilters}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Minimum Fare ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={filters.minFare}
                      onChange={(e) => setFilters({...filters, minFare: e.target.value})}
                      placeholder="e.g. 10"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Maximum Distance (miles)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={filters.maxDistance}
                      onChange={(e) => setFilters({...filters, maxDistance: e.target.value})}
                      placeholder="e.g. 15"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                  >
                    Apply Filters
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-pulse-subtle">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <User size={16} className="text-neutral-500 mr-1" />
                      <span className="text-sm text-neutral-500">Rider #12{index + 345}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="text-neutral-500 mr-1" />
                      <span className="text-xs text-neutral-500">Now</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <MapPin size={16} className="text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-neutral-800">{ride.pickup.address || 'Pickup location'}</p>
                    </div>
                    <div className="flex items-start">
                      <MapPin size={16} className="text-primary-700 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-neutral-800">{ride.dropoff.address || 'Dropoff location'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-neutral-50 rounded-lg p-3 mb-4">
                    <div>
                      <span className="text-neutral-600 text-sm">Estimated Fare</span>
                      <div className="flex items-center text-success-600 font-medium">
                        <DollarSign size={16} className="mr-0.5" />
                        <span>{ride.fare.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-600 text-sm">Trip Details</span>
                      <p className="text-neutral-800 text-sm font-medium">
                        {ride.distance.toFixed(1)} miles • {Math.round(ride.duration / 60)} mins
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAcceptRide(ride.id)}
                    variant="success"
                    fullWidth
                    leftIcon={<CheckCircle size={16} />}
                  >
                    Accept Ride
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center my-8">
            {searchTerm || filters.minFare || filters.maxDistance ? (
              <>
                <p className="text-lg font-medium text-neutral-700 mb-2">No matching rides found</p>
                <p className="text-neutral-600 mb-6">
                  We couldn't find any rides matching your search criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-neutral-700 mb-2">No rides available</p>
                <p className="text-neutral-600">
                  There are currently no ride requests in your area. Check back soon!
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRidesPage;