var Game = require('crtrdg-gameloop'),
    Player = require('./player'),
    Bubble = require('./bubble'),
    Keyboard = require('crtrdg-keyboard'),
    showFramerate = require('./framerate'),
    gameOptions = require('./game-options'),
    page = require('visibility')(),
    Time = require('crtrdg-time');

var game = new Game(gameOptions);
var time = new Time(game);

showFramerate(game);

game.on('draw-background', function (context) {
  context.fillStyle = gameOptions.backgroundColor;
  context.fillRect(0, 0, gameOptions.width, gameOptions.height - 100);
  context.fillStyle = gameOptions.groundColor;
  context.fillRect(0, gameOptions.height - 100, gameOptions.width, 100);
});

var keyboard = new Keyboard(game);

keyboard.on('keydown', function (keyCode) {
  if (keyCode === 'P') {
    if (game.ticker.paused) game.resume();
    else game.pause();
  }
});

page.on('hide', function () {
  game.pause();
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
  // FIXME drawing now seems to stop upon pause, so the paused message is never shown
  //       could just put an element over the canvas with the paused message (and partial opacity)
  if (this.paused) {
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
  context.fillStyle = 'rgba(200, 200, 200, ' + opacity + ')';
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

var newBubbleAtPos = function (x, y) {
  var bubble = new Bubble({
    position: {
      x: x,
      y: y
    },
    size: { x: 40, y: 40 },
    type: types[0],
    color: typeColors[types[0]],
    speed: 0.2,
    value: 1,
    chain: 2
  });
  return bubble;
};


player.on('collision', function (entity) {
  // a collision with a bubble
  // NOTE: may not be a new collision (but it will be if the bubble is destroyed immediately)
  if (entity.options.value) {
    score[entity.options.type] += entity.options.value;
  }
  entity.remove();
});

player.addTo(game);


var bbl = newBubbleAtPos;
function newWave () {
  return {
    duration: 2000,
    bubbles: [
      bbl(100, -50),
      bbl(200, -100),
      bbl(300, -150),
      bbl(400, -200)
    ]
  }
}

var nextWaveTime = 2000;

game.on('update', function (interval) {
  if (time.millis > nextWaveTime) {
    var wave = newWave();
    nextWaveTime = time.millis + wave.duration;
    spawnBubbles(wave.bubbles);
  }
});

function spawnBubbles(bubbles) {
  for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].addTo(game);
  }
}



// TODO spawn bubbles in specific waves
// a wave is a 2D distribution of bubbles in the space above the screen
// a wave lasts for a specific time, after which another wave of the same type may occur (some waves are special so have no type and do not block other waves)
// each bubble can have some variation in its position and speed,
// but keep it fairly tight for any fancy shapes - just enough variation to make it feel a bit real
// also sometimes have speed and position modified together so that things with wildly
// different speeds can come together into specific shapes when they are near the player
// (just figure out the mathematics for being at a specific location at a specific time given a random speed)
// a wave can have specific types of bubbles at specific places, and specific values of bubbles at specific places,
// but the range of values will be constrained by the player stats (e.g. career stat may limit value to 2, so a bubble
// that should be max wealth would be worth only 2, and a medium-wealth bubble would be worth only 1).
// there could also be partial waves that define only a single type of bubble, that can be composed to make a variety
// of waves. This would allow for more variety with different combinations of stats, so that you can have regular job
// waves mixing with either early-dating waves or marriage waves (among others).


// TODO make a JSON representation of a bubble that has:
//  - size
//  - type/color
//  - value (in 1 or multiple currencies)
//  - icon image
//  - % chance of being social
//  - other bubbles it can spawn
//    - maybe represent chaining separately

// TODO make JSON representation of a wave, using bubble names that look up bubble definitions above

// TODO define equations for figuring out which level and type of bubbles to spawn

// TODO add pop animation to bubbles
