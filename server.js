var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log('a user connected');
	// create a new player and add it to our players object
		players[socket.id] = {
			rotation: 0,
			x: 0,
			y: 0,
			playerId: socket.id,
      levelR: 'Level1',
      userNamer: "Default",
      anim: 'idle',
      hatAnimL: "defHat",
      flipX: false,
			team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
		};
	// when a player disconnects, remove them from our players object
	socket.on('disconnect', function () {
		console.log('user disconnected');
		// remove this player from our players object
		delete players[socket.id];
		// emit a message to all players to remove this player
		io.emit('disconnectR', socket.id);
	});
	socket.on('joiningRoom', function(roomID) {
		socket.join(roomID[0]);
		players[socket.id].room = roomID[0];
    players[socket.id].levelR = roomID[1];
    players[socket.id].userNamer = roomID[2];
		// when a player moves, update the player data
		socket.on('playerMovement', function (movementData) {
			players[socket.id].x = movementData.x;
			players[socket.id].y = movementData.y;
      players[socket.id].levelR = movementData.levelR;
      players[socket.id].anim = movementData.anim;
      players[socket.id].flipX = movementData.flipX;
      players[socket.id].hatAnim = movementData.hatAnim;
			// emit a message to all players about the player that moved
			socket.broadcast.to(roomID[0]).emit('playerMoved', players[socket.id]);
    });
    socket.on('deleteOldPlayer', function(socketID) {
      // remove this player from our players object
      // emit a message to all players to remove this player
      io.emit('disconnectR', socketID);
    });
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.to(roomID[0]).emit('newPlayer', players[socket.id]);
	});
});

server.listen(process.env.PORT, function () {
  console.log(`Listening on ${server.address().port}`);
});