import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, DollarSign, MapPin, Star } from 'lucide-react';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1664353655821-debedc55dda1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              filter: "brightness(75%)"
            }}
          ></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 md:py-28 lg:py-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Ride, Your Way
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-neutral-200">
                Book a ride in minutes. Track your driver in real-time. Arrive safely.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    onClick={() => navigate(user?.userType === 'rider' ? '/rider/book' : '/driver/dashboard')}
                  >
                    {user?.userType === 'rider' ? 'Book a Ride' : 'Start Driving'}
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => navigate('/register')}
                    >
                      Sign Up Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/login')}
                      className="bg-transparent text-white border-white hover:bg-white/10"
                    >
                      Log In
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">How It Works</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Simplified ride-sharing experience that puts you in control
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100"
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Request Your Ride</h3>
              <p className="text-neutral-600">
                Enter your pickup location and destination. Get instant fare estimates before confirming.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100"
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-5">
                <Car className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Get Matched with a Driver</h3>
              <p className="text-neutral-600">
                Our smart algorithm matches you with the closest available driver. Track their arrival in real-time.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100"
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Enjoy Transparent Pricing</h3>
              <p className="text-neutral-600">
                Pay exactly what you're quoted. No surge pricing or hidden fees. Rate your experience after each ride.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">What Our Users Say</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Thousands of satisfied users trust RideShare for their daily commute
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100"
              >
                <div className="flex items-center mb-4">
                  <div className="flex text-warning-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5" 
                        fill={i < testimonial.stars ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-700 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-medium">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-500">{testimonial.type}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
              Join thousands of users who've already made the switch to RideShare
            </p>
            <div className="mt-8">
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-white text-primary-700 hover:bg-neutral-100"
              >
                Sign Up Today
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="w-8 h-8 text-primary-500 mr-2" />
                <span className="text-xl font-bold">RideShare</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Modern ride-sharing platform that connects riders with drivers for a seamless transportation experience.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Press</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Safety</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Driver Requirements</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Cities</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Cookies</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-neutral-800 text-center">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} RideShare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Testimonial data
const testimonials = [
  {
    name: "Sarah Johnson",
    type: "Rider",
    stars: 5,
    text: "RideShare has completely changed my daily commute. The app is intuitive, drivers are always on time, and the prices are fair."
  },
  {
    name: "Michael Chen",
    type: "Driver",
    stars: 5,
    text: "As a driver, the platform makes it easy to find riders and manage my schedule. The payment system is reliable and I get paid quickly."
  },
  {
    name: "Jessica Williams",
    type: "Rider",
    stars: 4,
    text: "I use RideShare for my daily commute and occasional trips. The real-time tracking feature gives me peace of mind."
  },
  {
    name: "David Rodriguez",
    type: "Driver",
    stars: 5,
    text: "The driver app is fantastic - easy to navigate and gives me all the information I need about my passengers and routes."
  },
  {
    name: "Emily Thompson",
    type: "Rider",
    stars: 4,
    text: "I feel safe using RideShare even for late night trips. The driver verification system and real-time tracking are excellent features."
  },
  {
    name: "Alex Patel",
    type: "Rider",
    stars: 5,
    text: "The fare estimates are always accurate, and I love that I can schedule rides in advance for my important meetings."
  }
];

export default HomePage;