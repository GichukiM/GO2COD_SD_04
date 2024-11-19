const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

const gameRoutes = require('./routes/game.route.js');
const leaderboardRoutes = require('./routes/leaderboard.route.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Socket.io connection and events
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Handle player's move
    socket.on('play-move', ({ room, playerMove }) => {
        io.to(room).emit('receive-move', { playerMove, playerId: socket.id });
    });

    // Player leaves room
    socket.on('leave-room', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room ${room}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

console.log('Mongo URI:', process.env.MONGO_URI);

// MongoDB connection and server startup
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

connectDB();
