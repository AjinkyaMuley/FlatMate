import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import axios from 'axios'
import { Trash2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const ListingCard = ({ listing, index, canDelete, onDelete }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    const handleDelete = async () => {
        setIsLoading(true)
        setError('')
        
        try {
            await axios.delete(`http://localhost:8000/api/listings/deleteListings/${listing.id}`)
            setIsDeleted(true)
            // Notify parent component to update the list
            if (onDelete) {
                onDelete(listing.id)
            }
        } catch (error) {
            setError('Failed to delete the listing. Please try again.')
            console.log('Error in deleting listings ', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isDeleted) {
        return (
            <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-600">
                    Listing successfully deleted!
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Card key={index}>
            {error && (
                <Alert className="m-4 bg-red-50 border-red-200">
                    <AlertDescription className="text-red-600">
                        {error}
                    </AlertDescription>
                </Alert>
            )}
            <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription>
                    {listing.location.streetAddress}, {listing.location.city}, {listing.location.state}, {listing.location.zipCode}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-semibold text-blue-600 mb-2">
                    {formatCurrency(listing.monthlyRent)}/month
                </p>
                <p className="text-gray-600">{listing.description}</p>
                <Link to={`/listingsDetail/${index}`}>
                    <Button className="mt-4" variant="outline">
                        View Details
                    </Button>
                </Link>
                {canDelete && (
                    <Button 
                        className="mt-4 ml-5 bg-red-400 hover:bg-red-500" 
                        onClick={handleDelete} 
                        variant="outline"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Trash2 />
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default ListingCard