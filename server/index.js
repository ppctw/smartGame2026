const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let gameState = {
  teams: [],
  currentTeamIndex: 0,
  diceValue: null,
  isRolling: false,
  showEvent: false,
  eventMessage: '',
  eventType: null,
  winner: null,
  gameStarted: false,
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/game', (req, res) => {
  res.json(gameState);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('game:state', gameState);

  socket.on('game:start', (data) => {
    console.log('Game started with teams:', data.teams.length);
    gameState = {
      ...data,
      gameStarted: true,
    };
    io.emit('game:state', gameState);
  });

  socket.on('game:update', (updates) => {
    console.log('Game update:', Object.keys(updates));
    gameState = {
      ...gameState,
      ...updates,
    };
    io.emit('game:state', gameState);
  });

  socket.on('game:reset', () => {
    console.log('Game reset');
    gameState = {
      teams: [],
      currentTeamIndex: 0,
      diceValue: null,
      isRolling: false,
      showEvent: false,
      eventMessage: '',
      eventType: null,
      winner: null,
      gameStarted: false,
    };
    io.emit('game:state', gameState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚂 夢想探索號列車伺服器運行在 http://localhost:${PORT}`);
  console.log(`Socket.IO 已啟用，等待客戶端連接...`);
});
