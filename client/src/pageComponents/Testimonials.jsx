import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Testimonials = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sample reviews data - in real app, this would come from your database
  const reviews = [
    {
      id: 1,
      reviewerName: "Sarah Johnson",
      reviewerImage: "/api/placeholder/150/150",
      rating: 5,
      date: "2024-12-20",
      review: "Amazing roommate! Very clean, respectful, and always paid rent on time. We became great friends and I would definitely recommend them to anyone looking for a responsible roommate.",
      roommateId: "user123",
      roommateName: "Michael Chen"
    },
    {
      id: 2,
      reviewerName: "David Wilson",
      reviewerImage: "/api/placeholder/150/150",
      rating: 4,
      date: "2024-12-15",
      review: "Good experience overall. Kept common areas tidy and was considerate of noise levels. Communication could have been better at times, but would still recommend.",
      roommateId: "user456",
      roommateName: "Emma Thompson"
    }
  ];

  const RatingStars = ({ rating }) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Roommate Reviews & Testimonials</h1>
        <p className="text-gray-600 mb-6">Read about others' experiences or share your own roommate story</p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Submit Your Review</DialogTitle>
              <DialogDescription>
                Share your experience with your previous roommate
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roommate">Roommate Name</Label>
                <input
                  id="roommate"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter roommate's name"
                />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-6 h-6 cursor-pointer text-gray-300 hover:text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review">Your Review</Label>
                <Textarea
                  id="review"
                  placeholder="Share your experience living with this roommate..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="w-full">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.reviewerImage} alt={review.reviewerName} />
                  <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{review.reviewerName}</CardTitle>
                  <CardDescription>
                    Review for {review.roommateName}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-gray-600">{review.review}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Posted on {new Date(review.date).toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="mr-2">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};

export default Testimonials;