import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ChevronLeft, Hourglass, Navigation, Search } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useRide, Location } from '../../contexts/RideContext';
import { motion } from 'framer-motion';
import BookingMap from '../../components/map/BookingMap';

const BookRidePage: React.FC = () => {
  const navigate = useNavigate();
  const { bookRide, calculateFare, isLoading } = useRide();
  
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [fareEstimate, setFareEstimate] = useState<{
    fare: number;
    distance: number;
    duration: number;
  } | null>(null);
  const [step, setStep] = useState<'location' | 'confirmation'>('location');
  const [bookingError, setBookingError] = useState('');

  // Simulate getting the user's current location on component mount
  useEffect(() => {
    const getUserLocation = () => {
      // For simulation purposes, set a default location (NYC)
      const defaultLocation: Location = {
        lat: 40.7128,
        lng: -74.0060,
        address: 'Your Current Location',
      };
      
      setPickup(defaultLocation);
      setPickupAddress(defaultLocation.address || '');
    };
    
    getUserLocation();
  }, []);

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: Location) => {
    if (type === 'pickup') {
      setPickup(location);
      setPickupAddress(location.address || '');
    } else {
      setDropoff(location);
      setDropoffAddress(location.address || '');
    }
  };

  const handleContinue = async () => {
    if (!pickup || !dropoff) {
      setBookingError('Please select both pickup and dropoff locations');
      return;
    }
    
    try {
      setBookingError('');
      const fareData = await calculateFare(pickup, dropoff);
      setFareEstimate(fareData);
      setStep('confirmation');
    } catch (error) {
      console.error('Error calculating fare:', error);
      setBookingError('Unable to calculate fare. Please try again.');
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !dropoff) return;
    
    try {
      setBookingError('');
      await bookRide(pickup, dropoff);
      navigate('/rider/dashboard');
    } catch (error) {
      console.error('Error booking ride:', error);
      setBookingError('Failed to book ride. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex-grow relative">
        <div className="absolute inset-0 h-full w-full z-0">
          <BookingMap 
            pickup={pickup} 
            dropoff={dropoff} 
            onLocationSelect={handleLocationSelect} 
          />
        </div>
        
        <div className="relative z-10 h-full flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-lg w-full px-4 mt-4 mb-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
              {step === 'location' ? (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                    Where are you going?
                  </h2>
                  
                  {bookingError && (
                    <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                      {bookingError}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <Input
                      label="Pickup"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Enter pickup location"
                      fullWidth
                      leftIcon={<Search size={18} />}
                    />
                    
                    <Input
                      label="Dropoff"
                      value={dropoffAddress}
                      onChange={(e) => setDropoffAddress(e.target.value)}
                      placeholder="Enter destination"
                      fullWidth
                      leftIcon={<Navigation size={18} />}
                    />
                    
                    <Button
                      onClick={handleContinue}
                      fullWidth
                      isLoading={isLoading}
                      disabled={!pickup || !dropoffAddress}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <button 
                      onClick={() => setStep('location')}
                      className="p-1 rounded-full hover:bg-neutral-100 mr-2"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Confirm your ride
                    </h2>
                  </div>
                  
                  {bookingError && (
                    <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                      {bookingError}
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex items-start mb-4">
                      <div className="mt-0.5">
                        <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center bg-white z-10 relative">
                          <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        </div>
                        <div className="h-16 w-0.5 bg-neutral-300 mx-auto my-1"></div>
                        <div className="w-6 h-6 rounded-full border-2 border-primary-700 flex items-center justify-center bg-white">
                          <div className="w-2 h-2 rounded-full bg-primary-700"></div>
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div>
                          <p className="text-sm text-neutral-500">Pickup</p>
                          <p className="text-neutral-800 font-medium">{pickupAddress}</p>
                        </div>
                        
                        <div className="mt-10">
                          <p className="text-sm text-neutral-500">Destination</p>
                          <p className="text-neutral-800 font-medium">{dropoffAddress}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl bg-neutral-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Car size={18} className="text-primary-600 mr-2" />
                          <span className="font-medium">Ride Details</span>
                        </div>
                        <span className="text-neutral-600">Standard</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Price</span>
                          <span className="font-medium">${fareEstimate?.fare.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Distance</span>
                          <span>{fareEstimate?.distance.toFixed(1) || '0'} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Estimated time</span>
                          <div className="flex items-center">
                            <Hourglass size={14} className="text-neutral-600 mr-1" />
                            <span>{Math.round((fareEstimate?.duration || 0) / 60)} mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleBookRide}
                    fullWidth
                    isLoading={isLoading}
                  >
                    Confirm Booking
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookRidePage;