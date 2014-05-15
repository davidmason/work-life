var Entity = require('./entity'),
    inherits = require('inherits');

module.exports = Bubble;

inherits(Bubble, Entity);

function Bubble(options) {
  Bubble.super_.call(this, options);
  this.velocity = { x: 0, y: options.speed };

  this.on('boundary-collision', function (boundary) {
    if (boundary === 'bottom') {
      // this is the end!
      // everything is going dark!
      // TODO
      this.velocity.y = - this.speed;
    }
  })
}
