import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Users, MessageSquare, HomeIcon } from 'lucide-react';
import ListingCard from './ListingCard';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const listings = [
    {
      title: "Shared Apartment in Downtown",
      location: "123 Main St",
      price: "$800/month",
      description: "Looking for a roommate in a modern 2-bed apartment"
    },
    {
      title: "Room in Spacious House",
      location: "456 Park Ave",
      price: "$600/month",
      description: "Private room available in a friendly house share"
    },
    {
      title: "Student Housing Near Campus",
      location: "789 College Rd",
      price: "$700/month",
      description: "Perfect for students, 5 min walk to university"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Found my perfect roommate within a week! The platform made it so easy to connect.",
      role: "Graduate Student"
    },
    {
      name: "Mike Chen",
      text: "Great experience using this site. Very user-friendly and secure.",
      role: "Young Professional"
    },
    {
      name: "Emma Davis",
      text: "Love the verification system. Felt safe throughout the whole process.",
      role: "Remote Worker"
    }
  ];

  const [listingsData, setListingsData] = useState([]);
  const [loading, setLoading] = useState(true)
  const getAllListings = async () => {
    try {
      const response = await axios.get('https://flatmate-c9up.onrender.com/api/listings/getAllListings');
      setListingsData(response.data)
      setLoading(false)
      console.log(listingsData)
    } catch (error) {
      console.error("error getting listings");
    }
  }

  
  useEffect(() => {
    getAllListings();
  }, [])
  
  console.log(listingsData)
  
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen flex flex-col w-full">

      {/* Hero Section */}
      <div className="bg-blue-50 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Roommate
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with verified roommates in your area
          </p>
          <div className="flex justify-center gap-4">
            <Link to={'/allListings'}>
              <Button size="lg">Find A Match</Button>
            </Link>
            <Link to={'/newListingForm'}>
              <Button size="lg" variant="outline">Post An Ad</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Listings Section */}
      <div className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Listings</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {listingsData.reverse().slice(0, 3).map((listing, index) => (
              <ListingCard listing={listing} key={index} index={listing.id}/>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Search className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Browse through verified listings in your area</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Message potential roommates securely</p>
            </div>
            <div className="flex flex-col items-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Meet</h3>
              <p className="text-gray-600">Schedule viewings and find your match</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RoommateFinder</h3>
              <p className="text-gray-400">Finding your perfect roommate match made easy.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Search Listings</li>
                <li>Post a Listing</li>
                <li>How It Works</li>
                <li>Safety Tips</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>FAQs</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RoommateFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;