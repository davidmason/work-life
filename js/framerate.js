module.exports = function (game) {
  var framerate = document.getElementById('framerate');
  var suppress = 0;
  game.on('update', function (interval) {
    if (!suppress) framerate.textContent = (1000 / interval).toFixed();
    suppress++;
    suppress %= 30;
  });
};
