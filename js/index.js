var Game = require('crtrdg-gameloop'),
    Player = require('./player'),
    Bubble = require('./bubble'),
    Keyboard = require('crtrdg-keyboard'),
    showFramerate = require('./framerate'),
    gameOptions = require('./game-options');

var game = new Game(gameOptions);

showFramerate(game);

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

var types = [
  'wealth',
  'health',
  'social'
];

var typeColors = {
  wealth: 'rgba(50, 255, 50, 0.25)',
  health: 'rgba(255, 50, 50, 0.25)',
  social: 'rgba(200, 200, 50, 0.25)'
}

var score = {
  wealth: 0,
  health: 0,
  social: 0
}

game.on('draw-foreground', function (context) {
  //draw text "paused" in the center of the screen
  if (game.ticker.paused) {
    drawBigText(context, "Paused", 0.75);
  }

  drawText(context, score['wealth'], typeColors['wealth'], { x: 10, y: 30 });
  drawText(context, score['health'], typeColors['health'], { x: 10, y: 60 });
  drawText(context, score['social'], typeColors['social'], { x: 10, y: 90 });
});

function drawText(context, text, color, position) {
  context.save();
  context.font = '20px Montserrat, sans-serif';
  context.fillStyle = color;
  context.fillText(text, position.x, position.y);
  context.restore();
}

function drawBigText(context, text, opacity) {
  context.save();
  context.font = '80px Montserrat, sans-serif';
  context.textAlign = 'center';
  context.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
  context.fillText(text, game.width/2, game.height/2);
  context.restore();
}

var player = new Player();

player.on('preupdate', function (interval) {
  this.keyboardInput(keyboard);
  this.checkCollision(); // fires 'collision' events
});


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var spawnBubble = function spawnBubble () {
  var size = Math.random() * 20 + 35;
  var type = types[randomInt(0, 2)];
  (new Bubble({
    position: {
      x: 50 - (size / 2) + Math.random() * (parseInt(gameOptions.width, 10) - 100),
      y: -50 },
    size: { x: size, y: size },
    type: type,
    color: typeColors[type],
    speed: Math.random() * 0.2 + 0.1,
  })).addTo(game);
};

player.on('collision', function (entity) {
  // a collision with a bubble
  // NOTE: may not be a new collision (but it will be if the bubble is destroyed immediately)
  if (entity.options.value) {
    score[entity.options.type] += entity.options.value;
  }
  entity.remove();
  spawnBubble();
});

player.addTo(game);
setInterval(spawnBubble, 200);
