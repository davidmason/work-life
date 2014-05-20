var Entity = require('./entity'),
    inherits = require('inherits'),
    extend = require('xtend'),
    gameOptions = require('./game-options'),
    testIcon = document.getElementById('testicon');

module.exports = Bubble;


inherits(Bubble, Entity);

var defaultOptions = {
  position: {
    x: 400,
    y: -100 },
  size: { x: 40, y: 40 },
  color: 'rgba(100, 100, 100, 0.25)',
  layer: 0,
  speed: 0.2,
  boundary: { bottom: parseInt(gameOptions.height, 10) + 100 },
  drawRectangle: false,
  value: 1
};


function Bubble(options) {
  options = extend({}, defaultOptions, options);
  Bubble.super_.call(this, options);
  this.velocity = { x: 0, y: options.speed };

  this.on('boundary-collision', function (boundary) {
    if (boundary === 'bottom') {
      this.remove();
    }
  });

  this.on('collision', function () {
    if (this.options.chain) {
      var newOptions = extend(
        {},
        this.options,
        {
          chain: this.options.chain - 1,
          position: {
            x: this.position.x,
            y: this.position.y - 100
          }
        }
      );
      (new Bubble(newOptions)).addTo(this.game);
    }
  });

  this.on('draw-local', this.drawCircle);
}

Bubble.prototype.drawCircle = function (context) {
  // temp: drawing test image
  context.drawImage(testIcon, (this.size.x - testIcon.width) / 2, (this.size.y - testIcon.height) / 2);

  context.beginPath();
  context.arc(this.size.x / 2, this.size.y / 2, this.size.x / 2, 0, 2 * Math.PI, false);
  context.fillStyle = this.color;
  context.fill();
}