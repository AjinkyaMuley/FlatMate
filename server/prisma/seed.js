// prisma/seed.js
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    await prisma.$transaction([
      prisma.message.deleteMany(),
      prisma.connectionRequest.deleteMany(),
      prisma.listingAmenities.deleteMany(),
      prisma.listingLocation.deleteMany(),
      prisma.housingListing.deleteMany(),
      prisma.userVerification.deleteMany(),
      prisma.userContact.deleteMany(),
      prisma.userLocation.deleteMany(),
      prisma.userPreferences.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john.doe@example.com',
          passwordHash,
          name: 'John Doe',
          age: 25,
          gender: 'Male',
          occupation: 'Software Engineer',
          isVerified: true,
          profilePictureUrl: 'https://example.com/john.jpg'
        }
      }),
      prisma.user.create({
        data: {
          email: 'jane.smith@example.com',
          passwordHash,
          name: 'Jane Smith',
          age: 28,
          gender: 'Female',
          occupation: 'Designer',
          isVerified: true,
          profilePictureUrl: 'https://example.com/jane.jpg'
        }
      }),
      prisma.user.create({
        data: {
          email: 'mike.wilson@example.com',
          passwordHash,
          name: 'Mike Wilson',
          age: 30,
          gender: 'Male',
          occupation: 'Teacher',
          isVerified: true,
          profilePictureUrl: 'https://example.com/mike.jpg'
        }
      })
    ]);

    // Create User Preferences
    await Promise.all(users.map(user => 
      prisma.userPreferences.create({
        data: {
          userId: user.id,
          smokingPreference: ['Non-Smoker', 'Smoker', 'Occasionally'][Math.floor(Math.random() * 3)],
          sleepSchedule: ['Early Bird', 'Night Owl', 'Regular'][Math.floor(Math.random() * 3)],
          cleanlinessLevel: ['Very Clean', 'Moderately Clean', 'Relaxed'][Math.floor(Math.random() * 3)],
          guestPreference: ['Rarely', 'Occasionally', 'Often'][Math.floor(Math.random() * 3)],
          budgetMin: 500 + Math.floor(Math.random() * 500),
          budgetMax: 1500 + Math.floor(Math.random() * 1000),
          moveInDate: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
          lookingForRoommates: true
        }
      })
    ));

    // Create User Locations
    await Promise.all(users.map(user =>
      prisma.userLocation.create({
        data: {
          userId: user.id,
          streetAddress: `${Math.floor(Math.random() * 1000)} Main St`,
          city: ['New York', 'Los Angeles', 'Chicago'][Math.floor(Math.random() * 3)],
          state: ['NY', 'CA', 'IL'][Math.floor(Math.random() * 3)],
          zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
          latitude: (30 + Math.random() * 10).toFixed(8),
          longitude: (-100 + Math.random() * 30).toFixed(8)
        }
      })
    ));

    // Create User Contacts
    await Promise.all(users.map(user =>
      prisma.userContact.create({
        data: {
          userId: user.id,
          phone: `+1${Math.floor(Math.random() * 1000000000)}`,
          socialMediaLinks: {
            facebook: `https://facebook.com/${user.name.toLowerCase().replace(' ', '.')}`,
            instagram: `https://instagram.com/${user.name.toLowerCase().replace(' ', '_')}`,
            linkedin: `https://linkedin.com/in/${user.name.toLowerCase().replace(' ', '-')}`
          },
          preferredContactMethod: ['Email', 'Phone', 'Message'][Math.floor(Math.random() * 3)]
        }
      })
    ));

    // Create Housing Listings
    const listings = await Promise.all(users.map(user =>
      prisma.housingListing.create({
        data: {
          userId: user.id,
          title: `${['Cozy', 'Modern', 'Spacious'][Math.floor(Math.random() * 3)]} Apartment in ${['Downtown', 'Suburbs', 'City Center'][Math.floor(Math.random() * 3)]}`,
          description: 'Beautiful apartment with great amenities and location',
          monthlyRent: 1000 + Math.floor(Math.random() * 1000),
          securityDeposit: 1000 + Math.floor(Math.random() * 1000),
          availableFrom: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
          roomCount: 1 + Math.floor(Math.random() * 3),
          bathroomCount: 1 + Math.floor(Math.random() * 2),
          totalArea: 500 + Math.floor(Math.random() * 500),
          furnished: Math.random() > 0.5,
          petsAllowed: Math.random() > 0.5,
          status: ['ACTIVE', 'PENDING', 'CLOSED'][Math.floor(Math.random() * 3)]
        }
      })
    ));

    // Create Listing Locations
    await Promise.all(listings.map(listing =>
      prisma.listingLocation.create({
        data: {
          listingId: listing.id,
          streetAddress: `${Math.floor(Math.random() * 1000)} Oak St`,
          city: ['New York', 'Los Angeles', 'Chicago'][Math.floor(Math.random() * 3)],
          state: ['NY', 'CA', 'IL'][Math.floor(Math.random() * 3)],
          zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
          latitude: (30 + Math.random() * 10).toFixed(8),
          longitude: (-100 + Math.random() * 30).toFixed(8)
        }
      })
    ));

    // Create Listing Amenities
    const amenities = ['WiFi', 'Parking', 'Gym', 'Pool', 'Laundry', 'AC'];
    await Promise.all(listings.flatMap(listing =>
      amenities
        .filter(() => Math.random() > 0.5)
        .map(amenity =>
          prisma.listingAmenities.create({
            data: {
              listingId: listing.id,
              amenity
            }
          })
        )
    ));

    // Create Connection Requests
    await Promise.all([
      prisma.connectionRequest.create({
        data: {
          senderId: users[0].id,
          receiverId: users[1].id,
          status: 'PENDING'
        }
      }),
      prisma.connectionRequest.create({
        data: {
          senderId: users[1].id,
          receiverId: users[2].id,
          status: 'ACCEPTED'
        }
      })
    ]);

    // Create Messages
    await Promise.all([
      prisma.message.create({
        data: {
          senderId: users[0].id,
          receiverId: users[1].id,
          content: "Hi, I'm interested in being your roommate!",
          readAt: new Date(),
          isEncrypted: true
        }
      }),
      prisma.message.create({
        data: {
          senderId: users[1].id,
          receiverId: users[0].id,
          content: "Great! Let's discuss more details.",
          isEncrypted: true
        }
      })
    ]);

    // Create User Verifications
    await Promise.all(users.map(user =>
      prisma.userVerification.create({
        data: {
          userId: user.id,
          verificationType: 'ID_VERIFICATION',
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
          verificationData: {
            documentType: `Driver's License`,
            verificationDate: new Date().toISOString()
          }
        }
      })
    ));

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });