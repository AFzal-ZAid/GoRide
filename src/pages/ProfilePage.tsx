import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, Camera, LogOut, Phone, User as UserIcon } from 'lucide-react';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isLoading } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setError('');
    setSuccess('');
    
    // Reset form data to current user data when canceling edit
    if (editing) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });
      
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <div className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900 mb-2 sm:mb-0">
                  Profile
                </h1>
                <div className="flex space-x-3">
                  <Button
                    variant={editing ? 'outline' : 'primary'}
                    onClick={handleEditToggle}
                  >
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button
                    variant="error"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mb-3 border-2 border-primary-200">
                      <UserIcon size={48} className="text-primary-600" />
                    </div>
                    {editing && (
                      <button 
                        className="absolute bottom-2 right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-neutral-200"
                        type="button"
                      >
                        <Camera size={16} className="text-neutral-700" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {user?.name}
                  </h2>
                  <p className="text-neutral-600">
                    {user?.userType === 'rider' ? 'Rider' : 'Driver'}
                  </p>
                </div>
                
                <div className="flex-grow">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        fullWidth
                        leftIcon={<UserIcon size={18} />}
                      />
                      
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editing}
                        fullWidth
                        leftIcon={<AtSign size={18} />}
                      />
                      
                      <Input
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!editing}
                        fullWidth
                        leftIcon={<Phone size={18} />}
                      />
                    </div>
                    
                    {editing && (
                      <div className="mt-6">
                        <Button
                          type="submit"
                          fullWidth
                          isLoading={isLoading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Account Type</p>
                    <p className="font-medium text-neutral-900">
                      {user?.userType === 'driver' ? 'Driver Account' : 'Rider Account'}
                    </p>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-1">Member Since</p>
                    <p className="font-medium text-neutral-900">June 2023</p>
                  </div>
                  
                  {user?.userType === 'rider' && (
                    <>
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-sm text-neutral-600 mb-1">Payment Method</p>
                        <p className="font-medium text-neutral-900">Visa •••• 4242</p>
                      </div>
                      
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-sm text-neutral-600 mb-1">Total Rides</p>
                        <p className="font-medium text-neutral-900">42</p>
                      </div>
                    </>
                  )}
                  
                  {user?.userType === 'driver' && (
                    <>
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-sm text-neutral-600 mb-1">Vehicle</p>
                        <p className="font-medium text-neutral-900">Toyota Prius (2020)</p>
                      </div>
                      
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-sm text-neutral-600 mb-1">License Number</p>
                        <p className="font-medium text-neutral-900">DL-1234567</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;