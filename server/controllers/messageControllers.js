import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        const response = await prisma.message.create({
            data: {
                sender: {
                    connect: { id: parseInt(senderId) },
                },
                receiver: {
                    connect: { id: parseInt(receiverId) },
                },
                content: content,
            },
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: response,
        });
    } catch (error) {
        console.log(`Error in sending message`, error);
        res.status(500).json({ error: error.message });
    }
};

export const getMessageById = async (req, res) => {
    try {
        const { senderId } = req.params;
        const { receiverId } = req.body;

        // Validate inputs
        if (!senderId || !receiverId) {
            return res.status(400).json({ error: "senderId and receiverId are required" });
        }

        const parsedSenderId = parseInt(senderId);
        const parsedReceiverId = parseInt(receiverId);

        if (isNaN(parsedSenderId) || isNaN(parsedReceiverId)) {
            return res.status(400).json({ error: "Invalid senderId or receiverId" });
        }

        // Fetch messages
        const response = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: parsedSenderId, receiverId: parsedReceiverId },
                    { senderId: parsedReceiverId, receiverId: parsedSenderId },
                ],
            },
        });

        res.status(200).json(response);
    } catch (error) {
        console.log(`Error in getting messages by user: `, error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllMessages = async (req,res) => {
    try {
        
        const {id} = req.params;

        const response = await prisma.message.findMany({
            where: {
                OR : [
                    {senderId : parseInt(id)},
                    {receiverId : parseInt(id) }
                ]
            },
            include : {
                sender : true,
                receiver : true
            }
        })

        res.status(200).json(response);

    } catch (error) {
        console.log(`Error getting of all users `,error);
        res.status(500).json({ error: error.message });
    }
}