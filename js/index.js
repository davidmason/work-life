var Game = require('crtrdg-gameloop'),
    Player = require('./player');


var gameOptions = {
  canvasId: 'game',
  width: '800',
  height: '600',
  backgroundColor: '#58d3f7'
}

var game = new Game(gameOptions);

game.on('draw-background', function (context) {
  context.fillStyle = gameOptions.backgroundColor;
  context.fillRect(0, 0, gameOptions.width, gameOptions.height);
});

var GOLDEN_RATIO = 1.61803398875;

var player = new Player({
  position: { x: parseInt(gameOptions.width, 10) / 2, y: parseInt(gameOptions.height, 10) * (4/5) },
  size: { x: 20, y: 20*GOLDEN_RATIO },
  color: '#fff',
  layer: 1
});
player.on('update', function (interval) {
  // TODO change velocity in response to input
  // TODO check collisions with entities
});
player.on('draw-local', function (context) {
  this.drawRect(context);
});


var player2 = new Player({
  position: { x: player.position.x + 5, y: player.position.y + 10 },
  size: player.size,
  color: '#000',
  layer: 2
});
player2.on('draw-local', function (context) {
  this.drawRect(context);
});

var player3 = new Player({
  position: { x: player2.position.x + 10, y: player2.position.y + 10 },
  size: player.size,
  color: '#0a0',
  layer: 3
});
player3.on('draw-local', function (context) {
  this.drawRect(context);
});

player.addTo(game);
player2.addTo(game);
player3.addTo(game);