import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const requestVerification = async (req,res) => {
    try {
        
        const {userId } = req.params;
        const { verificationType, documentData } = req.body;

        const existingVerification = await prisma.userVerification.findFirst({
            where: {
              userId : parseInt(userId),
              verificationType,
              verificationStatus: 'VERIFIED'
            }
          });
      
          if (existingVerification) {
            return res.status(400).json({
              error: 'This verification type is already completed'
            });
          }
      
          // Handle different verification types
          switch (verificationType) {
            case 'ID_VERIFICATION':
              // Store ID document for review
              await prisma.userVerification.create({
                data: {
                  userId : parseInt(userId),
                  verificationType: 'ID_VERIFICATION',
                  verificationStatus: 'PENDING',
                  verificationData: {
                    documentType: documentData.type,
                    documentNumber: documentData.number,
                    submissionDate: new Date().toISOString()
                  }
                }
              });
              break;
      
            case 'EMPLOYMENT':
              // Store employment verification request
              await prisma.userVerification.create({
                data: {
                    userId : parseInt(userId),
                  verificationType: 'EMPLOYMENT',
                  verificationStatus: 'PENDING',
                  verificationData: {
                    employer: documentData.employer,
                    position: documentData.position,
                    salary: documentData.salary,
                    submissionDate: new Date().toISOString()
                  }
                }
              });
              break;
      
            case 'STUDENT':
              // Store student verification request
              await prisma.userVerification.create({
                data: {
                    userId : parseInt(userId),
                  verificationType: 'STUDENT',
                  verificationStatus: 'PENDING',
                  verificationData: {
                    university: documentData.university,
                    studentId: documentData.studentId,
                    enrollmentYear: documentData.enrollmentYear,
                    submissionDate: new Date().toISOString()
                  }
                }
              });
              break;
      
            default:
              return res.status(400).json({
                error: 'Unsupported verification type'
              });
          }
      
          res.status(201).json({
            message: 'Verification request submitted successfully'
          });

    } catch (error) {
        console.log(`Error requesting verification `,error);
        res.status(500).json({"error" : error})
    }
}

export const getVerifications = async (req,res) => {
    try {
        
        const {id} = req.params;

        const verifications = await prisma.userVerification.findMany({
            where: {
              userId : parseInt(id)
            },
            orderBy: {
              verifiedAt: 'desc'
            }
          });
      
          // Transform verification data for client
          const formattedVerifications = verifications.map(verification => ({
            type: verification.verificationType,
            status: verification.verificationStatus,
            submittedAt: verification.verificationData.submissionDate,
            verifiedAt: verification.verifiedAt,
            isExpired: verification.verifiedAt ? 
              new Date(verification.verifiedAt).getTime() + (365 * 24 * 60 * 60 * 1000) < Date.now() 
              : false
          }));
      
          res.json({
            verifications: formattedVerifications,
            verifiedCount: verifications.filter(v => v.verificationStatus === 'VERIFIED').length,
            pendingCount: verifications.filter(v => v.verificationStatus === 'PENDING').length
          });

    } catch (error) {
        console.log(`Error in getting all verifications `,error);
        res.status(400).json({"error" : error})
    }
}

export const approveVerifications = async (req,res) => {
    try {
        
        const {id} = req.params;

        const response = await prisma.userVerification.updateMany({
            where: {
                userId : parseInt(id)
            },
            data : {
                verificationStatus : 'VERIFIED'
            }
        })

        res.status(200).json(response);

    } catch (error) {
        console.log(`Error in approving verifications `,error);
        res.status(400).json({"error" : error})
    }
}