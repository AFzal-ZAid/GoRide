import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

// Types
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  pickup: Location;
  dropoff: Location;
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface RideContextType {
  currentRide: Ride | null;
  rideHistory: Ride[];
  isLoading: boolean;
  bookRide: (pickup: Location, dropoff: Location) => Promise<Ride>;
  cancelRide: (rideId: string) => Promise<void>;
  acceptRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
  getRideHistory: () => Promise<void>;
  getCurrentRide: () => Promise<void>;
  getAvailableRides: () => Promise<Ride[]>;
  calculateFare: (pickup: Location, dropoff: Location) => Promise<{fare: number, distance: number, duration: number}>;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const bookRide = async (pickup: Location, dropoff: Location): Promise<Ride> => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/rides`, {
        pickup,
        dropoff,
      });
      
      setCurrentRide(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRide = async (rideId: string) => {
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/api/rides/${rideId}/cancel`);
      setCurrentRide(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRide = async (rideId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_URL}/api/rides/${rideId}/accept`);
      setCurrentRide(response.data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeRide = async (rideId: string) => {
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/api/rides/${rideId}/complete`);
      setCurrentRide(null);
      // Refresh ride history after completion
      await getRideHistory();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRideHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/rides/history`);
      setRideHistory(response.data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentRide = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/rides/current`);
      
      if (response.data) {
        setCurrentRide(response.data);
      } else {
        setCurrentRide(null);
      }
    } catch (error) {
      setCurrentRide(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableRides = async (): Promise<Ride[]> => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/rides/available`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFare = async (pickup: Location, dropoff: Location) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/rides/calculate-fare`, {
        pickup,
        dropoff,
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RideContext.Provider
      value={{
        currentRide,
        rideHistory,
        isLoading,
        bookRide,
        cancelRide,
        acceptRide,
        completeRide,
        getRideHistory,
        getCurrentRide,
        getAvailableRides,
        calculateFare,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};