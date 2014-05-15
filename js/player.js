var Entity = require('./entity'),
    inherits = require('inherits');

module.exports = Player;

inherits(Player, Entity);

function Player(options) {
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
  var entities = this.game.entities,
      count = entities.length;

  for (var i = 0; i < count; i++) {
    if (entities[i] !== this) {
      if (this.touches(entities[i])) {
        this.emit('collision', entities[i]);
      }
    }
  }
};

Player.prototype.touches = function (entity) {
  
};