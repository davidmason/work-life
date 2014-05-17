var Entity = require('./entity'),
    inherits = require('inherits'),
    extend = require('xtend'),
    gameOptions = require('./game-options');

module.exports = Player;

inherits(Player, Entity);

var GOLDEN_RATIO = 1.61803398875;

var defaultOptions = {
  size: { x: 20, y: 20*GOLDEN_RATIO },
  color: '#fff',
  layer: 1,
  drawRectangle: true,
  speed: 0.3,
  friction: 0.01,
  position: { x: parseInt(gameOptions.width, 10) / 2, y: parseInt(gameOptions.height, 10) * (4/5) },
  boundary: { left: 30, right: parseInt(gameOptions.width) - 30 }
};

function Player(options) {
  options = extend({}, defaultOptions, options);
  Player.super_.call(this, options);
  this.velocity = { x: 0, y: 0 };

  this.friction = options.friction;
}

Player.prototype.keyboardInput = function (keyboard) {
  if ('A' in keyboard.keysDown || '<left>' in keyboard.keysDown) {
    this.velocity.x = -this.speed;
  }
  if ('D' in keyboard.keysDown || '<right>' in keyboard.keysDown) {
    this.velocity.x = this.speed;
  }
};

Player.prototype.checkCollision = function () {
  var entities = this.game.entities;

  this.bounds = this.getBounds();

  // loop is reversed since collisions may remove entities from the list
  for (var i = entities.length - 1; i >= 0; i--) {
    if (entities[i] !== this && entities[i].exists) {
      if (this.touches(entities[i])) {
        entities[i].emit('collision');
        this.emit('collision', entities[i]);
      }
    }
  }
};

Player.prototype.touches = function (entity) {
  return this.bounds.intersects(entity.getBounds());
};