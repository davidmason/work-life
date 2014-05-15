var Entity = require('./entity'),
    inherits = require('inherits');

module.exports = Player;

inherits(Player, Entity);

function Player(options) {
  Player.super_.call(this, options);
  this.velocity = { x: 0, y: 0 };

  this.friction = options.friction;

  this.on('update', function (interval) {
    this.emit('preupdate', interval);
    if (this.velocity) {
      this.move(this.velocity, interval);
    }
    if (this.options.friction) {
      this.velocity.x -= this.options.friction * this.velocity.x * interval;
      this.velocity.y -= this.options.friction * this.velocity.y * interval;
    }
  });
}

Player.prototype.keyboardInput = function (keyboard) {
  if ('A' in keyboard.keysDown || '<left>' in keyboard.keysDown) {
    this.velocity.x = -this.speed;
  }
  if ('D' in keyboard.keysDown || '<right>' in keyboard.keysDown) {
    this.velocity.x = this.speed;
  }
};