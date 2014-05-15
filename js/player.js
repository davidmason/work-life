var Entity = require('crtrdg-entity'),
    inherits = require('inherits');

module.exports = Player;

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

  this.layer = options.layer;
  this.color = options.color;

  this.on('draw', this.draw);
}

Player.prototype.draw = function(context) {
  context.save();
  context.translate(this.position.x, this.position.y);
  this.emit('draw-local', context);
  context.restore();
};

Player.prototype.drawRect = function(context) {
  context.fillStyle = this.color;
  context.fillRect(this.size.x / -2, this.size.y / -2, this.size.x, this.size.y);
}
