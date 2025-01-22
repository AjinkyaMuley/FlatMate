import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch user profile details with selected related data
        const userProfile = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                email: true,
                name: true,
                age: true,
                gender: true,
                occupation: true,
                profilePictureUrl: true,
                listings: {
                    select: {
                        id: true,
                        title: true,
                        monthlyRent: true,
                        availableFrom: true,
                        status: true,
                    },
                },
                contact: {
                    select: {
                        phone: true,
                        preferredContactMethod: true,
                        socialMediaLinks : true,
                    },
                },
                location: {
                    select: {
                        streetAddress : true,
                        city: true,
                        state: true,
                        zipCode: true,
                    },
                },
                preferences: {
                    select: {
                        smokingPreference: true,
                        cleanlinessLevel: true,
                        budgetMin: true,
                        budgetMax: true,
                        lookingForRoommates : true,
                        sleepSchedule : true,
                        guestPreference : true,
                        moveInDate : true
                    },
                },
                verifications: {
                    select: {
                        verificationType: true,
                        verificationStatus: true,
                        verifiedAt: true,
                    },
                },
            },
        });

        if (!userProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error(`Error in getting user profile:`, error);
        res.status(500).json({ error: error.message });
    }
};

export const updateUserProfile = async (req,res) => {
    try {
        const {id} = req.params;

        const {email,name,age,gender,occupation,profilePictureUrl} = req.body;

        const response = await prisma.user.update({
            where : {
                id : parseInt(id)
            },
            data : {
                email : email,
                name : name,
                age : parseInt(age),
                gender : gender,
                occupation : occupation,
                profilePictureUrl : profilePictureUrl
            }
        })

        res.status(201).json(response);

    } catch (error) {
        console.log(`Error in updating user profile:`, error);
        res.status(500).json({ error: error.message });
    }
}

export const getUserPreferences = async (req,res) => {
    try {
        const {id} = req.params;

        const userPreferences = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
                },
            include : {
                listings : true,
                location : true,
                preferences : true,
                verifications : true,
                contact : true
            }
        })

        res.status(200).json(userPreferences)

    } catch (error) {
        console.log(`Error getting user preferences `,error);
        res.status(500).json({ error: error.message });
    }
}

export const updateUserPreferences = async (req,res) => {
    try {
        
        const {id} = req.params;

        const {listings,location,contact,preferences,verifications} = req.body;

        const response = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data : {
                preferences: preferences
                    ? {
                          update: {
                              smokingPreference: preferences.smokingPreference,
                              sleepSchedule: preferences.sleepSchedule,
                              cleanlinessLevel: preferences.cleanlinessLevel,
                              guestPreference: preferences.guestPreference,
                              budgetMin: preferences.budgetMin,
                              budgetMax: preferences.budgetMax,
                              moveInDate: preferences.moveInDate,
                              lookingForRoommates: preferences.lookingForRoommates,
                          },
                      }
                    : undefined,
                location: location
                    ? {
                          update: {
                              streetAddress: location.streetAddress,
                              city: location.city,
                              state: location.state,
                              zipCode: location.zipCode,
                              latitude: location.latitude,
                              longitude: location.longitude,
                          },
                      }
                    : undefined,
                contact: contact
                    ? {
                          update: {
                              phone: contact.phone,
                              socialMediaLinks: contact.socialMediaLinks,
                              preferredContactMethod: contact.preferredContactMethod,
                          },
                      }
                    : undefined,
                listings: listings
                    ? {
                          updateMany: listings.map((listing) => ({
                              where: { id: listing.id },
                              data: {
                                  title: listing.title,
                                  description: listing.description,
                                  monthlyRent: listing.monthlyRent,
                                  securityDeposit: listing.securityDeposit,
                                  availableFrom: listing.availableFrom,
                                  roomCount: listing.roomCount,
                                  bathroomCount: listing.bathroomCount,
                                  totalArea: listing.totalArea,
                                  furnished: listing.furnished,
                                  petsAllowed: listing.petsAllowed,
                                  status: listing.status,
                              },
                          })),
                      }
                    : undefined,
                verifications: verifications
                    ? {
                          updateMany: verifications.map((verification) => ({
                              where: { id: verification.id },
                              data: {
                                  verificationType: verification.verificationType,
                                  verificationStatus: verification.verificationStatus,
                                  verifiedAt: verification.verifiedAt,
                                  verificationData: verification.verificationData,
                              },
                          })),
                      }
                    : undefined,
            }
        })

        res.status(201).json(response)

    } catch (error) {
        console.log(`Error updating user preferences `,error);
        res.status(500).json({ error: error.message });
    }
}

export const completeProfile = async (req, res) => {
    try {
        const {
            name,
            age,
            gender,
            occupation,
            profilePictureUrl,
            phone,
            preferredContactMethod,
            city,
            state,
            zipCode,
            socialMediaLinks,
            smokingPreference,
            cleanlinessLevel,
            budgetMin,
            budgetMax,
            lookingForRoommates,
            moveInDate,
            sleepSchedule,
            guestPreference,
            streetAddress
        } = req.body;

        const {userId} = req.params; // Assuming you have user ID from authentication middleware

        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(userId)
            },
            data: {
                name,
                age: parseInt(age),
                gender,
                occupation,
                profilePictureUrl,
                contact: {
                    upsert: {
                        create: {
                            socialMediaLinks,
                            phone,
                            preferredContactMethod
                        },
                        update: {
                            socialMediaLinks,
                            phone,
                            preferredContactMethod
                        }
                    }
                },
                location: {
                    upsert: {
                        create: {
                            streetAddress,
                            city,
                            state,
                            zipCode
                        },
                        update: {
                            streetAddress,
                            city,
                            state,
                            zipCode
                        }
                    }
                },
                preferences: {
                    upsert: {
                        create: {
                            smokingPreference,
                            cleanlinessLevel,
                            budgetMin: parseFloat(budgetMin),
                            budgetMax: parseFloat(budgetMax),
                            lookingForRoommates,
                            moveInDate: moveInDate ? new Date(moveInDate) : null,
                            sleepSchedule,
                            guestPreference
                        },
                        update: {
                            smokingPreference,
                            cleanlinessLevel,
                            budgetMin: parseFloat(budgetMin),
                            budgetMax: parseFloat(budgetMax),
                            lookingForRoommates,
                            moveInDate: moveInDate ? new Date(moveInDate) : null,
                            sleepSchedule,
                            guestPreference
                        }
                    }
                }
            },
            include: {
                contact: true,
                location: true,
                preferences: true
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).json({ error: error.message });
    }
};