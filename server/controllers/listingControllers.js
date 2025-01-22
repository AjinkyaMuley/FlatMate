import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getAllListings = async (req,res) => {
    try {
        const data = await prisma.HousingListing.findMany({
            include : {
                location : true,
                amenities : true
            }
        })

        res.status(200).json(data)

    } catch (error) {
        console.log(`Error in getting all listings `,error);
        res.status(500).json({"error": error});
    }
}

export const getListingsById = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await prisma.housingListing.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                location: true,
                amenities: true,
                user: {
                    include: {
                        preferences: true,
                        contact: true,
                        verifications: true,
                        location: true
                    }
                }
            }
        });

        if (!response) {
            return res.status(404).json({ error: "Listing not found" });
        }

        res.status(200).json(response);

    } catch (error) {
        console.log(`Error getting listings by id:`, error);
        res.status(500).json({ "error": error.message });
    }
}

export const addNewListings = async (req, res) => {
    try {
        const {
            userId,
            title,
            description,
            monthlyRent,
            securityDeposit,
            availableFrom,
            roomCount,
            bathroomCount,
            totalArea,
            furnished,
            petsAllowed,
            status,
            location,
            amenities,
        } = req.body;

        const response = await prisma.housingListing.create({
            data: {
                userId: parseInt(userId),
                title: title,
                description: description,
                monthlyRent: parseFloat(monthlyRent),
                securityDeposit: securityDeposit ? parseFloat(securityDeposit) : null,
                availableFrom: availableFrom ? new Date(availableFrom) : null,
                roomCount: roomCount ? parseInt(roomCount) : null,
                bathroomCount: bathroomCount ? parseInt(bathroomCount) : null,
                totalArea: totalArea ? parseFloat(totalArea) : null,
                furnished: furnished,
                petsAllowed: petsAllowed,
                status: status || "ACTIVE",
                location: {
                    create: {
                        streetAddress: location.streetAddress,
                        city: location.city,
                        state: location.state,
                        zipCode: location.zipCode,
                        latitude: location.latitude ? parseFloat(location.latitude) : null,
                        longitude: location.longitude ? parseFloat(location.longitude) : null,
                    },
                },
                amenities: {
                    create: amenities.map((amenity) => ({
                        amenity: amenity,
                    })),
                },
            },
        });

        res.status(201).json({ message: "Housing listing created successfully", data: response });
    } catch (error) {
        console.error("Error in adding new listings", error);
        res.status(500).json({ error: error.message });
    }
};

export const updateListings = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            userId,
            title,
            description,
            monthlyRent,
            securityDeposit,
            availableFrom,
            roomCount,
            bathroomCount,
            totalArea,
            furnished,
            petsAllowed,
            status,
            location,
            amenities,
        } = req.body;

        // Update the housing listing
        const updatedListing = await prisma.housingListing.update({
            where: {
                id: parseInt(id),
            },
            data: {
                userId: parseInt(userId),
                title,
                description,
                monthlyRent: parseFloat(monthlyRent),
                securityDeposit: securityDeposit ? parseFloat(securityDeposit) : null,
                availableFrom: availableFrom ? new Date(availableFrom) : null,
                roomCount: roomCount ? parseInt(roomCount) : null,
                bathroomCount: bathroomCount ? parseInt(bathroomCount) : null,
                totalArea: totalArea ? parseFloat(totalArea) : null,
                furnished,
                petsAllowed,
                status: status || "ACTIVE",
            },
        });

        // Update location if provided
        if (location) {
            await prisma.listingLocation.update({
                where: {
                    listingId: parseInt(id),
                },
                data: {
                    streetAddress: location.streetAddress,
                    city: location.city,
                    state: location.state,
                    zipCode: location.zipCode,
                    latitude: location.latitude ? parseFloat(location.latitude) : null,
                    longitude: location.longitude ? parseFloat(location.longitude) : null,
                },
            });
        }

        // Update amenities if provided
        if (amenities && amenities.length > 0) {
            // Remove existing amenities and add new ones
            await prisma.listingAmenities.deleteMany({
                where: {
                    listingId: parseInt(id),
                },
            });

            await prisma.listingAmenities.createMany({
                data: amenities.map((amenity) => ({
                    listingId: parseInt(id),
                    amenity,
                })),
            });
        }

        res.status(200).json({ message: "Listing updated successfully", updatedListing });
    } catch (error) {
        console.error(`Error in updating listing: `, error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteListings = async (req,res) => {
    try {
        
        const {id} = req.params;

        const response = await prisma.housingListing.delete({
            where : {
                id : parseInt(id)
            }
        });

        res.status(204).json({ message: "Listing updated successfully", response })

    } catch (error) {
        console.log(`Error in deleting Listings `,error);
        res.status(500).json({ error: error.message });
    }
}

export const getListingsByUser = async (req,res) => {
    try {
        const {id} = req.params;

        const response = await prisma.housingListing.findMany({
            where : {
                userId : parseInt(id)
            },
            include: {
                location: true,
                amenities: true,
                user: {
                    include: {
                        preferences: true,
                        contact: true,
                        verifications: true,
                        location: true
                    }
                }
            },
        })

        res.status(200).json(response)

    } catch (error) {
        console.log(`Error in deleting Listings `,error);
        res.status(500).json({ error: error.message });
    }
}