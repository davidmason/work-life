/* custom entity based on crtrdg-entity, with some additional config and default drawing behaviour */
var CrtrdgEntity = require('crtrdg-entity'),
    inherits = require('inherits'),
    extend = require('xtend'),
    aabb = require('aabb-2d');

module.exports = Entity;

inherits(Entity, CrtrdgEntity);

var defaultOptions = {
  layer: 0,
  color: '#f0f',
  drawRectangle: true
}

function Entity(options) {
  Entity.super_.call(this);
  options = extend({}, defaultOptions, options);

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

  this.on('update', function (interval) {
    this.emit('preupdate', interval);
    if (this.velocity) {
      this.move(this.velocity, interval);
    }
    if (this.options.friction) {
      var friction = Math.pow(this.options.friction, interval/1000)
      this.velocity.x = this.velocity.x * friction;
      this.velocity.y = this.velocity.y * friction;
    }
  });
}

Entity.prototype.draw = function(context) {
  context.save();
  context.translate(this.position.x, this.position.y);
  this.emit('draw-local', context);
  context.restore();
};

Entity.prototype.drawRect = function(context) {
  context.fillStyle = this.color;
  context.fillRect(0, 0, this.size.x, this.size.y);
}

/* move by a fixed distance, or include interval to adjust distance based on time */
Entity.prototype.move = function (velocity, interval) {
  interval = interval || 1;
  this.position.x += velocity.x * interval;
  this.position.y += velocity.y * interval;
  if (this.options.boundary) {
    var bounds = this.getBounds();
    if (this.options.boundary.left && bounds.x0() < this.options.boundary.left) {
      this.position.x = this.options.boundary.left;
      this.emit('boundary-collision', 'left');
    }
    if (this.options.boundary.right && bounds.x1() > this.options.boundary.right) {
      this.position.x = this.options.boundary.right - this.size.x;
      this.emit('boundary-collision', 'right');
    }
    if (this.options.boundary.top && bounds.y1() < this.options.boundary.top) {
      this.position.y = this.options.boundary.top;
      this.emit('boundary-collision', 'top');
    }
    if (this.options.boundary.bottom && bounds.y0() > this.options.boundary.bottom) {
      this.position.y = this.options.boundary.bottom - this.size.y;
      this.emit('boundary-collision', 'bottom');
    }
  }
}

Entity.prototype.getBounds = function () {
  return aabb([this.position.x, this.position.y],
              [this.size.x, this.size.y]);
}