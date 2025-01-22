import React, { useEffect, useState } from 'react';
import { Bell, Home, MessageCircle, PlusCircle, Search, Settings, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SettingsDropdown from './DashBoardDropDown';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  useEffect(() => {
    if (!auth.user_login && localStorage.getItem('user_login') == null) {
      window.location.href = '/auth' // Redirect to the auth page if not logged in
    } else {
      if (auth.userInfo != null) {
        setUserData(auth.userInfo); // Set user data when logged in
      }
      else {
        const getProfileInfo = async () => {
          try {
            const user_id = localStorage.getItem('userId')
            const response = await axios.get(`http://localhost:8000/api/users/profile/getUserProfile/${user_id}`);
            setUserData(response.data)
          } catch (error) {
            console.log(`Error in getting user info`, error)
          }
        }
        getProfileInfo();
      }
    }
  }, [])

  // Loading state
  if (!userData) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Helper function to safely get initials
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link to={'/dashboard'}>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to={'/messages'}>
              <Button variant="ghost" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link to={'/allListings'}>
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Find Roommates
              </Button>
            </Link>
            <Link to={'/newListingForm'}>
              <Button variant="ghost" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Listing
              </Button>
            </Link>
              <SettingsDropdown />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        {/* <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src={userData?.profilePictureUrl} />
                <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header> */}

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData?.profilePictureUrl} />
                  <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{userData?.name}</h3>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                  {userData?.isVerified && (
                    <Badge variant="secondary">Verified User</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle>Roommate Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Smoking:</span>
                  <span className="text-sm">{userData?.preferences?.smokingPreference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sleep Schedule:</span>
                  <span className="text-sm">{userData?.preferences?.sleepSchedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Cleanliness:</span>
                  <span className="text-sm">{userData?.preferences?.cleanlinessLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Budget Range:</span>
                  <span className="text-sm">${userData?.preferences?.budgetMin} - ${userData?.preferences?.budgetMax}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  {userData?.location?.city}, {userData?.location?.state} {userData?.location?.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{userData?.contact?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Preferred Contact:</span>
                  <span className="text-sm">{userData?.contact?.preferredContactMethod}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verifications Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userData?.verifications?.map((verification, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{verification.verificationType}</span>
                    <Badge
                      variant={verification.verificationStatus === "Verified" ? "success" : "warning"}
                    >
                      {verification.verificationStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;