import express from "express";
import dotenv from 'dotenv'
import profileRouter from "./routers/userProfileRoutes.js";
import listingRouter from "./routers/listingRoutes.js";
import connectionRouter from "./routers/connectionRoutes.js";
import messageRouter from "./routers/messageRoutes.js";
import verificationRouter from "./routers/verificationRoutes.js";
import recommendationsRouter from "./routers/recommendationRoutes.js";
import authRouter from "./routers/authRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST","PUT","DELETE"],
      },
})

dotenv.config();
app.use(cors())
app.use(express.json())

app.use('/api/users/profile',profileRouter);
app.use('/api/listings',listingRouter);
app.use('/api/connections',connectionRouter);
app.use('/api/message',messageRouter);
app.use('/api/verification',verificationRouter);
app.use('/api/recommendations',recommendationsRouter);
app.use('/api/auth',authRouter);

app.get('/',(req,res) => {
    res.send('Hello')
})

io.on('connection', (socket) => {
    console.log(`A user is connected ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
      });
    
      socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
      });
})

server.listen(process.env.PORT,() => {
    console.log(`Server is listening on PORT ${process.env.PORT}`)
})