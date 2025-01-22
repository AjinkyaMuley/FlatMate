import React, { useState } from 'react';
import { MapPin, Mail, Phone, Calendar, Briefcase, Home, DollarSign, Clock, Shield, Check, Edit2, X, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const EditableField = ({ value, onChange, type = 'text', options = [] }) => {
  if (type === 'select') {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue>{value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  return (
    <Input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full"
    />
  );
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    id: 1,
    email: "sarah.j@example.com",
    name: "Sarah Johnson",
    age: 28,
    gender: "Female",
    occupation: "Software Engineer",
    profilePictureUrl: "/api/placeholder/96/96",
    isVerified: true,
    createdAt: new Date("2024-01-01"),
    
    location: {
      streetAddress: "123 Tech Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      latitude: null,
      longitude: null
    },
    
    contact: {
      phone: "(555) 123-4567",
      preferredContactMethod: "Email",
      socialMediaLinks: {
        linkedin: "linkedin.com/in/sarahj",
        twitter: "@sarahj"
      }
    },
    
    preferences: {
      smokingPreference: "Non-Smoker",
      cleanlinessLevel: "Very Clean",
      sleepSchedule: "Early Bird",
      guestPreference: "Occasional guests ok",
      budgetMin: 1200,
      budgetMax: 2000,
      moveInDate: new Date("2025-02-01"),
      lookingForRoommates: true
    },
    
    verifications: [
      { verificationType: "EMAIL", verificationStatus: "VERIFIED", verifiedAt: new Date("2024-01-01") },
      { verificationType: "PHONE", verificationStatus: "VERIFIED", verifiedAt: new Date("2024-01-02") }
    ]
  });

  const handleSave = () => {
    // Here you would typically make an API call to update the user data
    console.log('Saving user data:', userData);
    setIsEditing(false);
  };

  const updateField = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-end mb-4">
          {isEditing ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userData.profilePictureUrl} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {userData.isVerified && (
                  <Badge className="absolute -bottom-2 right-0" variant="secondary">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                      {isEditing ? (
                        <EditableField 
                          value={userData.name}
                          onChange={(value) => updateField('name', '', value)}
                        />
                      ) : userData.name}
                      {userData.isVerified && <Shield className="h-5 w-5 text-blue-500" />}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      {isEditing ? (
                        <div className="flex gap-2">
                          <EditableField 
                            value={userData.location.city}
                            onChange={(value) => updateField('location', 'city', value)}
                          />
                          <EditableField 
                            value={userData.location.state}
                            onChange={(value) => updateField('location', 'state', value)}
                          />
                        </div>
                      ) : (
                        <span>{userData.location.city}, {userData.location.state}</span>
                      )}
                      <span className="mx-2">•</span>
                      <Briefcase className="h-4 w-4" />
                      {isEditing ? (
                        <EditableField 
                          value={userData.occupation}
                          onChange={(value) => updateField('occupation', '', value)}
                        />
                      ) : (
                        <span>{userData.occupation}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <EditableField 
                          value={userData.email}
                          onChange={(value) => updateField('email', '', value)}
                          type="email"
                        />
                      ) : (
                        <span>{userData.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <EditableField 
                          value={userData.contact.phone}
                          onChange={(value) => updateField('contact', 'phone', value)}
                          type="tel"
                        />
                      ) : (
                        <span>{userData.contact.phone}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <EditableField 
                            value={userData.preferences.budgetMin}
                            onChange={(value) => updateField('preferences', 'budgetMin', value)}
                            type="number"
                          />
                          <span>-</span>
                          <EditableField 
                            value={userData.preferences.budgetMax}
                            onChange={(value) => updateField('preferences', 'budgetMax', value)}
                            type="number"
                          />
                        </div>
                      ) : (
                        <span>Budget: ${userData.preferences.budgetMin} - ${userData.preferences.budgetMax}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <EditableField 
                          value={userData.preferences.moveInDate.toISOString().split('T')[0]}
                          onChange={(value) => updateField('preferences', 'moveInDate', new Date(value))}
                          type="date"
                        />
                      ) : (
                        <span>Available: {userData.preferences.moveInDate.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Lifestyle Preferences</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500">Smoking</div>
                  {isEditing ? (
                    <EditableField 
                      value={userData.preferences.smokingPreference}
                      onChange={(value) => updateField('preferences', 'smokingPreference', value)}
                      type="select"
                      options={['Non-Smoker', 'Smoker', 'Outside Only']}
                    />
                  ) : (
                    <div>{userData.preferences.smokingPreference}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Cleanliness</div>
                  {isEditing ? (
                    <EditableField 
                      value={userData.preferences.cleanlinessLevel}
                      onChange={(value) => updateField('preferences', 'cleanlinessLevel', value)}
                      type="select"
                      options={['Very Clean', 'Clean', 'Moderate', 'Relaxed']}
                    />
                  ) : (
                    <div>{userData.preferences.cleanlinessLevel}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Schedule</div>
                  {isEditing ? (
                    <EditableField 
                      value={userData.preferences.sleepSchedule}
                      onChange={(value) => updateField('preferences', 'sleepSchedule', value)}
                      type="select"
                      options={['Early Bird', 'Night Owl', 'Regular Schedule', 'Flexible']}
                    />
                  ) : (
                    <div>{userData.preferences.sleepSchedule}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Guests</div>
                  {isEditing ? (
                    <EditableField 
                      value={userData.preferences.guestPreference}
                      onChange={(value) => updateField('preferences', 'guestPreference', value)}
                      type="select"
                      options={['No guests', 'Occasional guests ok', 'Guests welcome']}
                    />
                  ) : (
                    <div>{userData.preferences.guestPreference}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Housing Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Living Arrangement</div>
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={userData.preferences.lookingForRoommates}
                          onCheckedChange={(checked) => 
                            updateField('preferences', 'lookingForRoommates', checked)
                          }
                        />
                        <span>Looking for roommates</span>
                      </div>
                    ) : (
                      <div>{userData.preferences.lookingForRoommates ? 'Looking for roommates' : 'Prefers living alone'}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Location</div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <EditableField 
                          value={userData.location.streetAddress}
                          onChange={(value) => updateField('location', 'streetAddress', value)}
                          placeholder="Street Address"
                        />
                        <EditableField 
                          value={userData.location.zipCode}
                          onChange={(value) => updateField('location', 'zipCode', value)}
                          placeholder="ZIP Code"
                        />
                      </div>
                    ) : (
                      <div>{userData.location.city}, {userData.location.state} {userData.location.zipCode}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;