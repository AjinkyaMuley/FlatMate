import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NewListingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    monthlyRent: '',
    securityDeposit: '',
    availableFrom: '',
    roomCount: '',
    bathroomCount: '',
    totalArea: '',
    furnished: false,
    petsAllowed: false,
    location: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: '',
      longitude: ''
    },
    amenities: []
  });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const amenityOptions = [
    'WiFi', 'Parking', 'Gym', 'Laundry', 'Air Conditioning',
    'Heating', 'Dishwasher', 'Security System', 'Storage Space',
    'Balcony/Patio'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/listings/addNewListings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: 7, // Replace with actual logged-in user ID
          status: 'ACTIVE'
        }),
      });
      if (response.ok) {
        setNotification({
          show: true,
          message: 'Listing created successfully!',
          type: 'success'
        });

        setFormData({
          title: '',
          description: '',
          monthlyRent: '',
          securityDeposit: '',
          availableFrom: '',
          roomCount: '',
          bathroomCount: '',
          totalArea: '',
          furnished: false,
          petsAllowed: false,
          location: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            latitude: '',
            longitude: ''
          },
          amenities: []
        })
      } else {
        throw new Error('Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setNotification({
        show: true,
        message: 'Failed to create listing. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white z-50`}
        >
          {notification.message}
        </div>
      )}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Post New Housing Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div>
                <Label htmlFor="title">Listing Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Cozy Room in Downtown Apartment"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your space..."
                  className="mt-1"
                  rows={4}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    placeholder="1200"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                    placeholder="1200"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="availableFrom">Available From</Label>
                  <div className="relative">
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                      className="mt-1"
                      disabled={isLoading}
                    />
                    <Calendar className="absolute right-3 top-4 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="totalArea">Total Area (sq ft)</Label>
                  <Input
                    id="totalArea"
                    type="number"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                    placeholder="800"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roomCount">Number of Rooms</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, roomCount: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathroomCount">Number of Bathrooms</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, bathroomCount: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="furnished"
                    checked={formData.furnished}
                    onCheckedChange={(checked) => setFormData({ ...formData, furnished: checked })}
                    disabled={isLoading}
                  />
                  <Label htmlFor="furnished">Furnished</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="petsAllowed"
                    checked={formData.petsAllowed}
                    onCheckedChange={(checked) => setFormData({ ...formData, petsAllowed: checked })}
                    disabled={isLoading}
                  />
                  <Label htmlFor="petsAllowed">Pets Allowed</Label>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={formData.location.streetAddress}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, streetAddress: e.target.value }
                    })}
                    placeholder="123 Main St"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.location.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value }
                    })}
                    placeholder="City"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.location.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value }
                    })}
                    placeholder="State"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.location.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, zipCode: e.target.value }
                    })}
                    placeholder="12345"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Switch
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const updatedAmenities = checked
                          ? [...formData.amenities, amenity]
                          : formData.amenities.filter(a => a !== amenity);
                        setFormData({ ...formData, amenities: updatedAmenities });
                      }}
                      disabled={isLoading}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post Listing"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewListingForm;