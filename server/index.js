import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import friendsRoute from "./routes/friends.js";
import authRoute from "./routes/auth.js";
import cors from 'cors';

const app = express();
app.use(cors());
app.use("/friends",friendsRoute);
app.use("/auth",authRoute);


const httpServer =  createServer(app);
const io = new Server(httpServer,{
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }    
});
io.on('connection', (socket) => {
    console.log("User connected",socket.id);
    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', {message:data.message});
    });
});
httpServer.listen(3001, () => {console.log("Server is running on port 3001")});

