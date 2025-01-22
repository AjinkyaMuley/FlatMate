import { Button } from "@/components/ui/button";
import { AlertTriangle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ListingCard from "./ListingCard";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";

const dummyListings = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "San Francisco, CA",
    price: "$2,500/month",
    description: "850 sqft • 2 beds • 2 baths • Furnished • Pets Allowed • Amenities: Gym, Pool, Parking"
  },
  {
    id: 2,
    title: "Cozy Studio in Mission District",
    location: "San Francisco, CA",
    price: "$1,800/month",
    description: "500 sqft • 1 bed • 1 bath • Amenities: Laundry, Rooftop"
  },
  {
    id: 3,
    title: "Luxury Condo with Bay View",
    location: "Oakland, CA",
    price: "$3,200/month",
    description: "1200 sqft • 3 beds • 2 baths • Furnished • Pets Allowed • Amenities: Security, Balcony, Garage"
  }
];

export default function HouseListingsPage() {

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getAllListings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using the API endpoint from your controller
        const response = await axios.get(`https://flatmate-c9up.onrender.com/api/listings/getAllListings/`);

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data
        setListing(data);

      } catch (error) {
        console.log('Error fetching listing:', error);
        setError('Failed to load listing details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getAllListings();
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The requested listing could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Available Houses</h2>
        <Link to={'/search'}>
          <Button className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Properties
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listing.map((listing, index) => (
          <ListingCard
            canDelete={false}
            key={listing.id}
            listing={listing}
            index={listing.id}
          />
        ))}
      </div>
    </div>
  );
}