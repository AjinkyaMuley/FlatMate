import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signup = async (req, res) => {
    try {

        const { email, password, name, age, gender, occupation } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                age: parseInt(age),
                gender,
                occupation,
                preferences: {
                    create: {
                        // Default preferences
                        lookingForRoommates: true,
                        smokingPreference: null
                    }
                }
            },
            include: {
                preferences: true
            }
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove sensitive data
        delete user.passwordHash;

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user
        });

    } catch (error) {
        console.log(`Error in registering user : `, error);
        res.status(500).json({ "error": error });
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                preferences: true,
                location: true,
                contact: true,
                verifications: true
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove sensitive data
        delete user.passwordHash;

        res.json({
            message: 'Logged in successfully',
            token,
            user
        });
    } catch (error) {
        console.log(`Error in logging in : `, error);
        res.status(500).json({ "error": error });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        console.log('Token received:', token);

        // Find verification record
        const verification = await prisma.userVerification.findFirst({
            where: {
                verificationType: 'EMAIL',
                verificationData: {
                    path: ['token'],
                    equals: token
                }
            },
            include: { user: true }
        });

        console.log('Verification record:', verification);

        if (!verification) {
            return res.status(404).json({ error: 'Invalid verification token' });
        }

        // Check if verification is expired
        const { expiresAt } = verification.verificationData;
        if (expiresAt && new Date(expiresAt) < new Date()) {
            return res.status(400).json({ error: 'Verification token has expired' });
        }

        // Update user and verification status
        await prisma.$transaction([
            prisma.user.update({
                where: { id: verification.userId },
                data: { isVerified: true }
            }),
            prisma.userVerification.update({
                where: { id: verification.id },
                data: {
                    verificationStatus: 'VERIFIED',
                    verifiedAt: new Date()
                }
            })
        ]);

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error in verifying email:', error);
        res.status(500).json({ error: error.message });
    }
};

export const extractToken = async (req, res) => {
    try {
        const decodedToken = jwt.decode(req.token);

        if (!decodedToken) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        // Return decoded data
        res.json({
            success: true,
            data: {
                header: decodedToken.header,
                payload: {
                    ...decodedToken,
                    iat: new Date(decodedToken.iat * 1000).toISOString(),
                    exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : null
                }
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('Error extracting data from token ', error)
    }
}