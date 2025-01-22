import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, Shield, Search, MessageSquare, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Search className="w-12 h-12 text-blue-500" />,
      title: "Smart Matching",
      description: "Our advanced algorithm helps you find compatible roommates based on lifestyle, preferences, and habits."
    },
    {
      icon: <Shield className="w-12 h-12 text-green-500" />,
      title: "Verified Profiles",
      description: "Every user goes through our verification process to ensure a safe and trusted community."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-purple-500" />,
      title: "Secure Messaging",
      description: "Connect with potential roommates through our secure in-app messaging system."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Roommate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to make finding the right roommate easier, safer, and more reliable than ever before.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-center text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How It Works</CardTitle>
            <CardDescription className="text-center">
              Finding a roommate is as easy as 1-2-3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Users className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-600">Tell us about yourself and what you're looking for in a roommate</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Search className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Browse Matches</h3>
                <p className="text-gray-600">Find potential roommates based on compatibility and preferences</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <MessageSquare className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">Message matches and find your perfect roommate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;