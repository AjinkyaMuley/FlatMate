import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  DollarSign,
  Home,
  Map,
  Phone,
  Mail,
  User,
  Check,
  Bath,
  Bed,
  Maximize,
  PawPrint,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';
import { Button } from '@/components/ui/button';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const [listing, setListing] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using the API endpoint from your controller
        const response = await axios.get(`http://localhost:8000/api/listings/getAllListingsById/${id}`);

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
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

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

  console.log(listing)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Listing Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    {listing.location.streetAddress}, {listing.location.city}, {listing.location.state} {listing.location.zipCode}
                  </CardDescription>
                </div>
                <Badge variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {listing.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rent</p>
                    <p className="font-semibold">{formatCurrency(listing.monthlyRent)}/month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Security Deposit</p>
                    <p className="font-semibold">{formatCurrency(listing.securityDeposit)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">{listing.roomCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">{listing.bathroomCount}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Property Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Maximize className="w-4 h-4" />
                      Total Area: {listing.totalArea} sq ft
                    </li>
                    <li className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      {listing.furnished ? 'Furnished' : 'Unfurnished'}
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4" />
                      {listing.petsAllowed ? 'Pets Allowed' : 'No Pets'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Available from: {formatDate(listing.availableFrom)}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity.amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground">{listing.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center items-center bg-gray-100 p-4 rounded-b-lg">
              <Link to={`/messages/${id}`}>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200 ease-in-out"
                  size="lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Owner Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Listed by</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={listing.user.profilePictureUrl} />
                  <AvatarFallback>
                    {listing.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{listing.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{listing.user.occupation}</p>
                  {listing.user.isVerified && (
                    <Badge variant="secondary" className="mt-1">
                      <Check className="w-3 h-3 mr-1" /> Verified User
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p>{listing.user.email}</p>
                </div>
                {listing.user.contact?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p>{listing.user.contact.phone}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p>{listing.user.age} years • {listing.user.gender}</p>
                </div>
              </div>

              {listing.user.preferences && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-semibold mb-4">Preferences</h3>
                    <div className="space-y-2 text-sm">
                      <p>Budget Range: {formatCurrency(listing.user.preferences.budgetMin)} - {formatCurrency(listing.user.preferences.budgetMax)}</p>
                      <p>Cleanliness: {listing.user.preferences.cleanlinessLevel}</p>
                      <p>Smoking: {listing.user.preferences.smokingPreference}</p>
                      <p>Guest Policy: {listing.user.preferences.guestPreference}</p>
                      <p>Sleep Schedule: {listing.user.preferences.sleepSchedule}</p>
                      <p>Looking for Roommates: {listing.user.preferences.lookingForRoommates ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </>
              )}

              {listing.user.verifications && listing.user.verifications.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-semibold mb-4">Verifications</h3>
                    <div className="space-y-2">
                      {listing.user.verifications.map((verification, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          <Check className="w-3 h-3 mr-1" />
                          {verification.verificationType.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;