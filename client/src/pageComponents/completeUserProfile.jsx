import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, ChevronLeft, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';

const ProfileCompletion = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    age: '',
    gender: '',
    occupation: '',
    profilePictureUrl: '',

    // Contact Info
    phone: '',
    preferredContactMethod: '',
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },

    // Location
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: '',

    // Preferences
    smokingPreference: '',
    cleanlinessLevel: '',
    budgetMin: '',
    budgetMax: '',
    lookingForRoommates: true,
    moveInDate: '',
    sleepSchedule: '',
    guestPreference: '',

    // Verifications
    verificationType: '',
    verificationStatus: 'PENDING',
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/profile/completeUserProfile/${9}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      showNotification('success', 'Profile saved successfully!');
      navigate('/dashboard')
      // Handle success (e.g., redirect to dashboard)
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter your age"
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Enter your occupation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
              <Input
                id="profilePictureUrl"
                name="profilePictureUrl"
                value={formData.profilePictureUrl}
                onChange={handleInputChange}
                placeholder="Enter profile picture URL eg (https://example.com/mike.jpg)"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Contact Method</Label>
              <Select onValueChange={(value) => handleSelectChange('preferredContactMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Social Media Links</Label>
              {Object.keys(formData.socialMediaLinks).map(platform => (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                  <Input
                    id={platform}
                    value={formData.socialMediaLinks[platform]}
                    onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                    placeholder={`Enter your ${platform} profile URL`}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="Enter your street address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter your ZIP code"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="Latitude"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="Longitude"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Smoking Preference</Label>
              <Select onValueChange={(value) => handleSelectChange('smokingPreference', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select smoking preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non-smoker">Non-Smoker</SelectItem>
                  <SelectItem value="smoker">Smoker</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cleanliness Level</Label>
              <Select onValueChange={(value) => handleSelectChange('cleanlinessLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cleanliness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very Clean">Very Clean</SelectItem>
                  <SelectItem value="Clean">Clean</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sleep Schedule</Label>
              <Select onValueChange={(value) => handleSelectChange('sleepSchedule', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sleep schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early-bird">Early Bird</SelectItem>
                  <SelectItem value="night-owl">Night Owl</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Guest Preference</Label>
              <Select onValueChange={(value) => handleSelectChange('guestPreference', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guest preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No Guests">No Guests</SelectItem>
                  <SelectItem value="Occasional">Occasional Guests</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Minimum Budget</Label>
                <Input
                  id="budgetMin"
                  name="budgetMin"
                  type="number"
                  value={formData.budgetMin}
                  onChange={handleInputChange}
                  placeholder="Min budget"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetMax">Maximum Budget</Label>
                <Input
                  id="budgetMax"
                  name="budgetMax"
                  type="number"
                  value={formData.budgetMax}
                  onChange={handleInputChange}
                  placeholder="Max budget"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveInDate">Move-in Date</Label>
              <Input
                id="moveInDate"
                name="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="looking-for-roommates"
                checked={formData.lookingForRoommates}
                onCheckedChange={(checked) => handleSelectChange('lookingForRoommates', checked)}
              />
              <Label htmlFor="looking-for-roommates">Looking for roommates</Label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Verification Type</Label>
              <Select onValueChange={(value) => handleSelectChange('verificationType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select verification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="government-id">Government ID</SelectItem>
                  <SelectItem value="student-id">Student ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white z-50`}
        >
          {notification.message}
        </div>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-1/5 h-2 ${stepNumber <= step ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              {step === 1 && "Basic Information"}
              {step === 2 && "Contact Details"}
              {step === 3 && "Location"}
              {step === 4 && "Preferences"}
              {step === 5 && "Verification"}
            </div>
          </div>

          {renderStep()}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 1 || isLoading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {step < 5 ? (
              <Button
                onClick={() => setStep(prev => prev + 1)}
                disabled={isLoading}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {/* Handle complete later logic */ }}
              disabled={isLoading}
            >
              Complete Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;