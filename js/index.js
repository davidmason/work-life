var Game = require('crtrdg-gameloop');
    Entity = require('crtrdg-entity'),
    inherits = require('inherits');


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

inherits(Player, Entity);

function Player(options) {
  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.color = options.color;
}

var player = new Player({
  position: { x: 10, y: 10 },
  size: { x: 10, y: 10 },
  color: '#fff'
});

player.addTo(game);

player.on('update', function (interval) {
  // TODO change velocity in response to input
  // TODO check collisions with entities
});

player.on('draw', function (context) {
  context.fillStyle = this.color;
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
});
