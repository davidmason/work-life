/* custom entity based on crtrdg-entity, with some additional config and default drawing behaviour */
var CrtrdgEntity = require('crtrdg-entity'),
    inherits = require('inherits');

module.exports = Entity;

inherits(Entity, CrtrdgEntity);

function Entity(options) {
  Entity.super_.call(this);
  this.options = options;

  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.speed = options.speed;
  this.layer = options.layer;
  this.color = options.color;

  this.on('draw', this.draw);

  if (options.drawRectangle) {
    this.on('draw-local', this.drawRect);
  }
}

Entity.prototype.draw = function(context) {
  context.save();
  context.translate(this.position.x, this.position.y);
  this.emit('draw-local', context);
  context.restore();
};

Entity.prototype.drawRect = function(context) {
  context.fillStyle = this.color;
  context.fillRect(this.size.x / -2, this.size.y / -2, this.size.x, this.size.y);
}

/* move by a fixed distance, or include interval to adjust distance based on time */
Entity.prototype.move = function (velocity, interval) {
  interval = interval || 1;
  this.position.x += velocity.x * interval;
  this.position.y += velocity.y * interval;
  if (this.options.boundary) {
    if (this.options.boundary.left && this.position.x < this.options.boundary.left) {
      this.position.x = this.options.boundary.left;
    }
    if (this.options.boundary.right && this.position.x > this.options.boundary.right) {
      this.position.x = this.options.boundary.right;
    }
    if (this.options.boundary.top && this.position.y < this.options.boundary.top) {
      this.position.y = this.options.boundary.top;
    }
    if (this.options.boundary.bottom && this.position.y > this.options.boundary.bottom) {
      this.position.y = this.options.boundary.bottom;
    }
  }
}