const io = require('socket.io')();

io.on('connection', (socket) => {
  socket.on('newGame', (newGame) => {
    const gameId = newGame.id
    const game = socket.join(gameId);
    console.log('New game created:', gameId)
  });

  socket.on('join', (player) => {
    player.id = Math.random().toString(36).substr()
    socket.join(player.gameId);
    socket.to(player.gameId).emit('join', player)
    console.log('New player join game:', player.gameId)
    // `${player.username} joined the game`
  })
});

const port = 3000;
io.listen(port);
console.log('listening on port ', port);