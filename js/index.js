var Game = require('crtrdg-gameloop'),
    Player = require('./player'),
    Keyboard = require('crtrdg-keyboard');


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


var keyboard = new Keyboard(game);



var GOLDEN_RATIO = 1.61803398875;

var player = new Player({
  position: { x: parseInt(gameOptions.width, 10) / 2, y: parseInt(gameOptions.height, 10) * (4/5) },
  size: { x: 20, y: 20*GOLDEN_RATIO },
  color: '#fff',
  layer: 1,
  drawRectangle: true,
  speed: 0.3,
  friction: 0.01,
  boundary: { left: 30, right: parseInt(gameOptions.width) - 30 }
});

player.on('preupdate', function (interval) {
  this.keyboardInput(keyboard);
  // TODO check collisions with side of screen
  // TODO apply friction
  // TODO check collisions with entities
});

var player2 = new Player({
  position: { x: player.position.x + 30, y: player.position.y + 40 },
  size: player.size,
  color: '#000',
  layer: 2,
  drawRectangle: true,
  speed: 0.45,
  friction: 0.02,
  boundary: { left: 100, right: parseInt(gameOptions.width) - 100 }
});
player2.on('preupdate', function (interval) {
  this.keyboardInput(keyboard);
});

player.addTo(game);
player2.addTo(game);
