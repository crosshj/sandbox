((window)=> {

  function range(from, to){
    return new Array(to).fill();
  }

  // http://stackoverflow.com/a/23095731/1627873
  function randomRGB(){
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return { r, g, b };
  }

  function randomPixel(setter, xmax, ymax){
    range(0, xmax).forEach((unused_x, x) => {
      range(0, ymax).forEach((unused_y, y) => {
        var _color = randomRGB();
        _color.r = _color.b = 0;
        setter(_color, {x, y, xmax});
      });
    });
  }

  var randomImageData;
  function randomPixels(setter){
    if (!setter) return;

    var ctx = this.canvas.getContext('2d');

    randomImageData = randomImageData
      ? randomImageData
      : ctx.createImageData(this.dimensions.x, this.dimensions.y);

    randomPixel(
      (color, pos) => { setter(randomImageData, color, pos)},
      this.dimensions.x,
      this.dimensions.y
    );

    requestAnimationFrame(
      () => ctx.putImageData( randomImageData, 0, 0 )
    );
  }

  var options = {
    init: randomPixels
  };


  function ready(){
    var cv = new CanvasPlus(options);
    cv.start();
  }

  document.addEventListener('DOMContentLoaded', ready, false);

})(window)
