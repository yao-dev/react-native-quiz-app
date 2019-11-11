const io = require('socket.io')();

io.on('connection', (socket) => {
  socket.on('newGame', (newGame) => {
    const roomId = newGame.id
    const game = socket.join(roomId);
    console.log('newGame started id:', roomId)
  });

  socket.on('join', (player) => {
    socket.join(player.gameId);
    socket.to(player.gameId).emit('join', `${player.username} joined the game`)
  })
});

const port = 3000;
io.listen(port);
console.log('listening on port ', port);
