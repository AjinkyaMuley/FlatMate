import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, MapPin, Heart, Phone, Clock, DollarSign, Mail, Image, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';

const ProfileUpdateForm = () => {
    const { auth } = useAuth();
    const userId = auth.userId || localStorage.getItem('userId')
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        // Basic Profile
        email: '',
        name: '',
        age: '',
        gender: '',
        occupation: '',
        profilePictureUrl: '',

        // Location
        location: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            latitude: '',
            longitude: ''
        },

        // Preferences
        preferences: {
            smokingPreference: '',
            sleepSchedule: '',
            cleanlinessLevel: '',
            guestPreference: '',
            budgetMin: '',
            budgetMax: '',
            moveInDate: '',
            lookingForRoommates: false
        },

        // Contact
        contact: {
            phone: '',
            socialMediaLinks: '',
            preferredContactMethod: ''
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/profile/getUserProfile/${userId}`);
                const data = await response.json();
                console.log(data)
                setProfile(data);
                setFormData(prev => ({
                    ...prev,
                    ...data
                }));
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleInputChange = (section, field, value) => {
        setFormData(prev => {
            if (section) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value
                    }
                };
            }
            return {
                ...prev,
                [field]: value
            };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Update basic profile
            await fetch(`http://localhost:8000/api/users/profile/updateUserProfile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    age: formData.age,
                    gender: formData.gender,
                    occupation: formData.occupation,
                    profilePictureUrl: formData.profilePictureUrl
                })
            });

            // Update preferences and other details
            await fetch(`http://localhost:8000/api/users/profile/updateUserPreferences/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    preferences: formData.preferences,
                    location: formData.location,
                    contact: formData.contact
                })
            });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Update Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid grid-cols-5 gap-4 mb-8">
                            <TabsTrigger value="basic" className="flex items-center gap-2">
                                <User size={16} />
                                Basic Info
                            </TabsTrigger>
                            <TabsTrigger value="location" className="flex items-center gap-2">
                                <MapPin size={16} />
                                Location
                            </TabsTrigger>
                            <TabsTrigger value="preferences" className="flex items-center gap-2">
                                <Heart size={16} />
                                Preferences
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="flex items-center gap-2">
                                <Phone size={16} />
                                Contact
                            </TabsTrigger>
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <Image size={16} />
                                Profile
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange(null, 'age', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange(null, 'gender', value)}
                                    >
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
                                        value={formData.occupation}
                                        onChange={(e) => handleInputChange(null, 'occupation', e.target.value)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="location" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="streetAddress">Street Address</Label>
                                    <Input
                                        id="streetAddress"
                                        value={formData.location.streetAddress}
                                        onChange={(e) => handleInputChange('location', 'streetAddress', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.location.city}
                                        onChange={(e) => handleInputChange('location', 'city', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        value={formData.location.state}
                                        onChange={(e) => handleInputChange('location', 'state', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">ZIP Code</Label>
                                    <Input
                                        id="zipCode"
                                        value={formData.location.zipCode}
                                        onChange={(e) => handleInputChange('location', 'zipCode', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        value={formData.location.latitude}
                                        onChange={(e) => handleInputChange('location', 'latitude', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        value={formData.location.longitude}
                                        onChange={(e) => handleInputChange('location', 'longitude', e.target.value)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preferences" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smokingPreference">Smoking Preference</Label>
                                    <Select
                                        value={formData.preferences.smokingPreference}
                                        onValueChange={(value) => handleInputChange('preferences', 'smokingPreference', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select preference" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="non-smoker">Non-Smoker</SelectItem>
                                            <SelectItem value="smoker">Smoker</SelectItem>
                                            <SelectItem value="occasional">Occasional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cleanlinessLevel">Cleanliness Level</Label>
                                    <Select
                                        value={formData.preferences.cleanlinessLevel}
                                        onValueChange={(value) => handleInputChange('preferences', 'cleanlinessLevel', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Very Clean">Very Clean</SelectItem>
                                            <SelectItem value="Clean">Clean</SelectItem>
                                            <SelectItem value="Moderate">Moderate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="budgetMin">Minimum Budget</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="budgetMin"
                                            type="number"
                                            className="pl-8"
                                            value={formData.preferences.budgetMin}
                                            onChange={(e) => handleInputChange('preferences', 'budgetMin', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="budgetMax">Maximum Budget</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="budgetMax"
                                            type="number"
                                            className="pl-8"
                                            value={formData.preferences.budgetMax}
                                            onChange={(e) => handleInputChange('preferences', 'budgetMax', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
                                    <Select
                                        value={formData.preferences.sleepSchedule}
                                        onValueChange={(value) => handleInputChange('preferences', 'sleepSchedule', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select schedule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Early Bird">Early Bird</SelectItem>
                                            <SelectItem value="Night Owl">Night Owl</SelectItem>
                                            <SelectItem value="Flexible">Flexible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guestPreference">Guest Preference</Label>
                                    <Select
                                        value={formData.preferences.guestPreference}
                                        onValueChange={(value) => handleInputChange('preferences', 'guestPreference', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select preference" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="No Guests">No Guests</SelectItem>
                                            <SelectItem value="Occasional">Occasional Guests</SelectItem>
                                            <SelectItem value="Flexible">Flexible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="moveInDate">Move-in Date</Label>
                                    <Input
                                        id="moveInDate"
                                        type="date"
                                        value={formData.preferences.moveInDate}
                                        onChange={(e) => handleInputChange('preferences', 'moveInDate', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 flex items-center space-x-2">
                                    <Switch
                                        id="lookingForRoommates"
                                        checked={formData.preferences.lookingForRoommates}
                                        onCheckedChange={(checked) => handleInputChange('preferences', 'lookingForRoommates', checked)}
                                    />
                                    <Label htmlFor="lookingForRoommates">Currently Looking for Roommates</Label>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.contact.phone}
                                        onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                                    <Select
                                        value={formData.contact.preferredContactMethod}
                                        onValueChange={(value) => handleInputChange('contact', 'preferredContactMethod', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="phone">Phone</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="message">In-App Message</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="socialMediaLinks">Social Media Links</Label>
                                    <Textarea
                                        id="socialMediaLinks"
                                        placeholder="Enter your social media links (one per line)"
                                        value={formData.contact.socialMediaLinks}
                                        onChange={(e) => handleInputChange('contact', 'socialMediaLinks', e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="profile" className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
                                    <Input
                                        id="profilePictureUrl"
                                        value={formData.profilePictureUrl}
                                        onChange={(e) => handleInputChange(null, 'profilePictureUrl', e.target.value)}
                                        placeholder="Enter URL for your profile picture"
                                    />
                                </div>
                                {formData.profilePictureUrl && (
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <img
                                            src="/api/placeholder/128/128"
                                            alt="Profile Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end mt-6 space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => setFormData(profile)}
                            disabled={loading}
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileUpdateForm;