const requestAnimationFrame = (window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {
    window.setTimeout(cb, 1000 / 60);
  });

export default requestAnimationFrame;
