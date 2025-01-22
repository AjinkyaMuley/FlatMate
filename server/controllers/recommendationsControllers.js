// Initialize Prisma client
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Search API Controllers
export const searchRoommates = async (req, res) => {
  try {
    const {
      city,
      state,
      minBudget,
      maxBudget,
      moveInDate,
      smokingPreference,
      cleanlinessLevel,
      page = 1,
      limit = 10
    } = req.query;

    // Step 1: Check for basic users
    const allUsers = await prisma.user.count({
      where: {
        isVerified: true
      }
    });

    // Step 2: Check users with preferences
    const usersWithPreferences = await prisma.user.count({
      where: {
        isVerified: true,
        preferences: {
          lookingForRoommates: true
        }
      }
    });

    // Step 3: Check users with location
    const usersWithLocation = await prisma.user.count({
      where: {
        isVerified: true,
        location: {
          city,
          state
        }
      }
    });

    // Step 4: Check users with smoking preference
    const usersWithSmoking = await prisma.user.count({
      where: {
        isVerified: true,
        preferences: {
          smokingPreference
        }
      }
    });

    // Step 5: Check users with cleanliness
    const usersWithCleanliness = await prisma.user.count({
      where: {
        isVerified: true,
        preferences: {
          cleanlinessLevel
        }
      }
    });

    // Step 6: Check users with budget range
    const usersWithBudget = await prisma.user.count({
      where: {
        isVerified: true,
        preferences: {
          OR: [
            {
              budgetMin: {
                lte: parseFloat(maxBudget)
              },
              budgetMax: {
                gte: parseFloat(minBudget)
              }
            }
          ]
        }
      }
    });

    // Get sample users for debugging
    const sampleUsers = await prisma.user.findMany({
      where: {
        isVerified: true
      },
      include: {
        preferences: true,
        location: true
      },
      take: 5
    });

    return res.json({
      data: {
        counts: {
          totalVerifiedUsers: allUsers,
          usersLookingForRoommates: usersWithPreferences,
          usersInLocation: usersWithLocation,
          usersMatchingSmoking: usersWithSmoking,
          usersMatchingCleanliness: usersWithCleanliness,
          usersInBudgetRange: usersWithBudget
        },
        searchCriteria: {
          city,
          state,
          minBudget,
          maxBudget,
          moveInDate,
          smokingPreference,
          cleanlinessLevel
        },
        users: sampleUsers.map(user => ({
          id: user.id,
          hasPreferences: !!user.preferences,
          hasLocation: !!user.location,
          preferences: user.preferences,
          location: user.location
        }))
      }
    });

  } catch (error) {
    console.error('Error in debugSearchRoommates:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Recommendations API Controller 
export const getRoommateRecommendations = async (req, res) => {
  try {
    const { userId, limit = 10 } = req.body;

    // Get user preferences and location
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        preferences: true,
        location: true
      }
    });

    if (!user || !user.preferences) {
      return res.status(400).json({ error: 'User or preferences not found' });
    }

    // Find potential matches
    const potentialMatches = await prisma.user.findMany({
      where: {
        id: { not: parseInt(userId) },
        isVerified: true,
        preferences: {
          lookingForRoommates: true,
          budgetMin: { lte: user.preferences.budgetMax || undefined },
          budgetMax: { gte: user.preferences.budgetMin || undefined }
        }
      },
      include: {
        preferences: true,
        location: true
      },
      take: limit * 2 // Fetch extra to allow for filtering
    });

    // Calculate compatibility scores and sort
    const scoredMatches = potentialMatches
      .map(match => ({
        ...match,
        compatibilityScore: calculateCompatibilityScore(user, match)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    res.json({
      recommendations: scoredMatches
    });

  } catch (error) {
    console.error('Error in getRoommateRecommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Utility functions
const calculateCompatibilityScore = (user1, user2) => {
  const factors = {
    smokingPreference: 0.2,
    cleanlinessLevel: 0.2,
    sleepSchedule: 0.15,
    guestPreference: 0.15,
    budget: 0.15,
    location: 0.15
  };

  let totalScore = 0;

  // Compare smoking preferences
  if (user1.preferences?.smokingPreference === user2.preferences?.smokingPreference) {
    totalScore += factors.smokingPreference;
  }

  // Compare cleanliness levels
  if (user1.preferences?.cleanlinessLevel === user2.preferences?.cleanlinessLevel) {
    totalScore += factors.cleanlinessLevel;
  }

  // Compare sleep schedules
  if (user1.preferences?.sleepSchedule === user2.preferences?.sleepSchedule) {
    totalScore += factors.sleepSchedule;
  }

  // Compare guest preferences
  if (user1.preferences?.guestPreference === user2.preferences?.guestPreference) {
    totalScore += factors.guestPreference;
  }

  // Compare budget compatibility
  if (user1.preferences?.budgetMin && user1.preferences?.budgetMax &&
      user2.preferences?.budgetMin && user2.preferences?.budgetMax) {
    const budgetOverlap = Math.min(
      parseFloat(user1.preferences.budgetMax),
      parseFloat(user2.preferences.budgetMax)
    ) - Math.max(
      parseFloat(user1.preferences.budgetMin),
      parseFloat(user2.preferences.budgetMin)
    );
    
    if (budgetOverlap >= 0) {
      totalScore += factors.budget;
    }
  }

  // Compare location proximity
  if (user1.location?.latitude && user1.location?.longitude &&
      user2.location?.latitude && user2.location?.longitude) {
    const distance = getDistanceFromLatLong(
      parseFloat(user1.location.latitude),
      parseFloat(user1.location.longitude),
      parseFloat(user2.location.latitude),
      parseFloat(user2.location.longitude)
    );
    
    // Score based on distance (closer = higher score)
    if (distance <= 5) totalScore += factors.location;
    else if (distance <= 10) totalScore += factors.location * 0.8;
    else if (distance <= 20) totalScore += factors.location * 0.6;
    else if (distance <= 30) totalScore += factors.location * 0.4;
    else if (distance <= 50) totalScore += factors.location * 0.2;
  }

  return totalScore;
};

const getDistanceFromLatLong = (lat1, lon1, lat2, lon2) => {
  const R = 3963; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

