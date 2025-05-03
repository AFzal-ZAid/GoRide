import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock data storage
const users = [];
const rides = [];

// Mock auth middleware
const authenticateUser = (req, res, next) => {
  // For demo purposes, just pass through
  // In a real app, this would verify JWT tokens
  next();
};

// Socket.io handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a room based on user type and ID
  socket.on('join', ({ userId, userType }) => {
    socket.join(`${userType}-${userId}`);
    console.log(`${userType} ${userId} joined their room`);
  });
  
  // Handle ride requests
  socket.on('request-ride', (rideData) => {
    // Broadcast to all available drivers
    socket.broadcast.to('drivers').emit('new-ride', rideData);
  });
  
  // Handle ride acceptance
  socket.on('accept-ride', ({ rideId, driverId, riderId }) => {
    // Notify the rider that their ride was accepted
    socket.to(`rider-${riderId}`).emit('ride-accepted', { rideId, driverId });
  });
  
  // Handle driver location updates
  socket.on('driver-location', (locationData) => {
    // Send to the specific rider
    socket.to(`rider-${locationData.riderId}`).emit('driver-location-update', locationData);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, userType, phoneNumber } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user (in a real app, you'd hash the password)
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // This would be hashed in a real app
    userType,
    phoneNumber: phoneNumber || '',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Create a mock token
  const token = `mock-token-${newUser.id}`;
  
  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      userType: newUser.userType,
      phoneNumber: newUser.phoneNumber
    },
    token
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = users.find(user => user.email === email);
  
  // Check if user exists and password is correct
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create a mock token
  const token = `mock-token-${user.id}`;
  
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      phoneNumber: user.phoneNumber
    },
    token
  });
});

// User routes
app.get('/api/users/me', authenticateUser, (req, res) => {
  // For demo purposes, just return a mock user
  res.json({
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    userType: 'rider',
    phoneNumber: '+1234567890'
  });
});

app.put('/api/users/update', authenticateUser, (req, res) => {
  // For demo purposes, just echo back the updated data
  const { name, email, phoneNumber } = req.body;
  
  res.json({
    id: 'user-123',
    name: name || 'John Doe',
    email: email || 'john@example.com',
    userType: 'rider',
    phoneNumber: phoneNumber || '+1234567890'
  });
});

// Ride routes
app.post('/api/rides', authenticateUser, (req, res) => {
  const { pickup, dropoff } = req.body;
  
  // Calculate mock fare, distance, and duration
  const fare = 15 + Math.random() * 10;
  const distance = 3 + Math.random() * 5;
  const duration = 600 + Math.random() * 900; // In seconds
  
  const newRide = {
    id: `ride-${Date.now()}`,
    riderId: 'user-123', // In a real app, this would be extracted from auth token
    pickup,
    dropoff,
    status: 'requested',
    fare,
    distance,
    duration,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  rides.push(newRide);
  
  // Emit new ride to all available drivers
  io.to('drivers').emit('new-ride', newRide);
  
  res.status(201).json(newRide);
});

app.put('/api/rides/:id/accept', authenticateUser, (req, res) => {
  const { id } = req.params;
  
  // Find the ride
  const ride = rides.find(ride => ride.id === id);
  
  if (!ride) {
    return res.status(404).json({ message: 'Ride not found' });
  }
  
  // Update ride
  ride.driverId = 'driver-123'; // In a real app, this would be extracted from auth token
  ride.status = 'accepted';
  ride.updatedAt = new Date().toISOString();
  
  // Emit ride accepted event
  io.to(`rider-${ride.riderId}`).emit('ride-accepted', { 
    rideId: ride.id, 
    driverId: ride.driverId 
  });
  
  res.json(ride);
});

app.put('/api/rides/:id/complete', authenticateUser, (req, res) => {
  const { id } = req.params;
  
  // Find the ride
  const ride = rides.find(ride => ride.id === id);
  
  if (!ride) {
    return res.status(404).json({ message: 'Ride not found' });
  }
  
  // Update ride
  ride.status = 'completed';
  ride.updatedAt = new Date().toISOString();
  
  // Emit ride completed event
  io.to(`rider-${ride.riderId}`).emit('ride-completed', { rideId: ride.id });
  
  res.json(ride);
});

app.put('/api/rides/:id/cancel', authenticateUser, (req, res) => {
  const { id } = req.params;
  
  // Find the ride
  const ride = rides.find(ride => ride.id === id);
  
  if (!ride) {
    return res.status(404).json({ message: 'Ride not found' });
  }
  
  // Update ride
  ride.status = 'cancelled';
  ride.updatedAt = new Date().toISOString();
  
  // Emit ride cancelled event
  if (ride.driverId) {
    io.to(`driver-${ride.driverId}`).emit('ride-cancelled', { rideId: ride.id });
  }
  
  res.json(ride);
});

app.get('/api/rides/current', authenticateUser, (req, res) => {
  // For demo purposes, return null (no current ride)
  // In a real app, you'd query the database for the user's active ride
  res.json(null);
});

app.get('/api/rides/history', authenticateUser, (req, res) => {
  // For demo purposes, return mock ride history
  const mockHistory = [
    {
      id: 'ride-1',
      riderId: 'user-123',
      driverId: 'driver-456',
      pickup: { lat: 40.7128, lng: -74.0060, address: '120 Broadway, New York, NY' },
      dropoff: { lat: 40.7484, lng: -73.9857, address: 'Empire State Building, NY' },
      status: 'completed',
      fare: 24.50,
      distance: 4.2,
      duration: 1260, // 21 minutes in seconds
      createdAt: '2023-06-15T14:30:00.000Z',
      updatedAt: '2023-06-15T15:00:00.000Z'
    },
    {
      id: 'ride-2',
      riderId: 'user-123',
      driverId: 'driver-789',
      pickup: { lat: 40.7484, lng: -73.9857, address: 'Empire State Building, NY' },
      dropoff: { lat: 40.7580, lng: -73.9855, address: 'MoMA, New York, NY' },
      status: 'completed',
      fare: 15.75,
      distance: 2.1,
      duration: 840, // 14 minutes in seconds
      createdAt: '2023-06-17T10:15:00.000Z',
      updatedAt: '2023-06-17T10:35:00.000Z'
    },
    {
      id: 'ride-3',
      riderId: 'user-123',
      driverId: 'driver-456',
      pickup: { lat: 40.7580, lng: -73.9855, address: 'MoMA, New York, NY' },
      dropoff: { lat: 40.7527, lng: -73.9772, address: 'Grand Central Terminal, NY' },
      status: 'cancelled',
      fare: 12.00,
      distance: 1.5,
      duration: 660, // 11 minutes in seconds
      createdAt: '2023-06-20T18:20:00.000Z',
      updatedAt: '2023-06-20T18:25:00.000Z'
    }
  ];
  
  res.json(mockHistory);
});

app.get('/api/rides/available', authenticateUser, (req, res) => {
  // For demo purposes, return mock available rides
  const mockAvailableRides = [
    {
      id: 'ride-4',
      riderId: 'user-456',
      pickup: { lat: 40.7128, lng: -74.0060, address: '120 Broadway, New York, NY' },
      dropoff: { lat: 40.7484, lng: -73.9857, address: 'Empire State Building, NY' },
      status: 'requested',
      fare: 22.75,
      distance: 4.2,
      duration: 1260, // 21 minutes in seconds
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ride-5',
      riderId: 'user-789',
      pickup: { lat: 40.7484, lng: -73.9857, address: 'Empire State Building, NY' },
      dropoff: { lat: 40.7580, lng: -73.9855, address: 'MoMA, New York, NY' },
      status: 'requested',
      fare: 14.50,
      distance: 2.1,
      duration: 840, // 14 minutes in seconds
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ride-6',
      riderId: 'user-101',
      pickup: { lat: 40.7580, lng: -73.9855, address: 'MoMA, New York, NY' },
      dropoff: { lat: 40.7527, lng: -73.9772, address: 'Grand Central Terminal, NY' },
      status: 'requested',
      fare: 10.25,
      distance: 1.5,
      duration: 660, // 11 minutes in seconds
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  res.json(mockAvailableRides);
});

app.post('/api/rides/calculate-fare', (req, res) => {
  const { pickup, dropoff } = req.body;
  
  // Calculate mock fare, distance, and duration
  const distance = 3 + Math.random() * 5;
  const duration = 600 + Math.random() * 900; // In seconds
  const fare = 5 + (distance * 2.5) + (duration / 60 * 0.5);
  
  res.json({
    fare: parseFloat(fare.toFixed(2)),
    distance,
    duration
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});