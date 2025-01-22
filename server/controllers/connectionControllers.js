import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const makeNewConnections = async (req, res) => {
    try {
        const { fromId, toId } = req.body;

        // Check if a connection request already exists
        const existingRequest = await prisma.connectionRequest.findFirst({
            where: {
                senderId: parseInt(fromId),
                receiverId: parseInt(toId),
            },
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Connection request already exists.",
            });
        }

        // Create a new connection request
        const response = await prisma.connectionRequest.create({
            data: {
                senderId: parseInt(fromId),
                receiverId: parseInt(toId),
                status: 'PENDING',
            },
        });

        res.status(200).json(response);
    } catch (error) {
        console.log(`Error in making new connections`, error);
        res.status(500).json({ error: error.message });
    }
};

export const approvedConnections = async (req, res) => {
    try {
        const { id } = req.params;

        // Update the connection request status to 'APPROVED'
        const response = await prisma.connectionRequest.update({
            where: {
                id: parseInt(id),
            },
            data: {
                status: 'APPROVED',
            },
            select: {
                id: true,
                senderId: true,
                receiverId: true,
                status: true, // Include the updated status in the response
            },
        });

        res.status(200).json({
            message: "Connection approved successfully",
            data: response,
        });
    } catch (error) {
        if (error.code === 'P2025') {
            // Handle record not found error
            res.status(404).json({ error: "Connection request not found" });
        } else {
            console.log(`Error approving connections`, error);
            res.status(500).json({ error: error.message });
        }
    }
};

export const userConnections = async (req,res) => {
    try {
        
        const {userId} = req.params;


        const response = await prisma.connectionRequest.findMany({
            where: {
                OR: [
                    { senderId: parseInt(userId) },
                    { receiverId: parseInt(userId) },
                    ]
            },
            select: {
                id: true,
                senderId: true,
                receiverId: true,
                status: true, // Include the status in the response
            }
        });

        res.status(200).json(response);

    } catch (error) {
        console.log(`Error getting all user connections `,error);
        res.status(400).json({error : error});
    }
}