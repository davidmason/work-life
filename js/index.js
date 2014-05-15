var Game = require('crtrdg-gameloop'),
    Player = require('./player'),
    Bubble = require('./bubble'),
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

keyboard.on('keydown', function (keyCode) {
  if (keyCode === 'P') {
    if (game.ticker.paused) game.resume();
    else game.pause();
  }
});

game.on('draw-foreground', function (context) {
  //draw text "paused" in the center of the screen
  if (game.ticker.paused) {
    drawBigText(context, "Paused", 0.75);
  }
});

function drawBigText(context, text, opacity) {
  context.save();
  context.font = '80px Montserrat, sans-serif';
  context.textAlign = 'center';
  context.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
  context.fillText(text, game.width/2, game.height/2);
  context.restore();
}



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

// TODO player needs to know if it collides with ANY bubbles.



var bubble = new Bubble({
  position: { x: parseInt(gameOptions.width, 10) / 2, y: -50 },
  size: { x: 35, y: 35 },
  color: '#888',
  layer: 0,
  drawRectangle: true,
  speed: 0.3,
  boundary: { bottom: parseInt(gameOptions.height, 10) + 100 }
});


// var player2 = new Player({
//   position: { x: player.position.x + 30, y: player.position.y + 40 },
//   size: player.size,
//   color: '#000',
//   layer: 2,
//   drawRectangle: true,
//   speed: 0.45,
//   friction: 0.02,
//   boundary: { left: 100, right: parseInt(gameOptions.width) - 100 }
// });
// player2.on('preupdate', function (interval) {
//   this.keyboardInput(keyboard);
// });

player.addTo(game);
bubble.addTo(game);
// player2.addTo(game);
