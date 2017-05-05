((window)=> {

  var randomImageData;
  function init(setter){
    if (!setter) return;

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
          //_color.r = Math.round(Math.random()) * 255;
          //_color.b = Math.round(Math.random()) * 255;
          
          _color.g = Math.round(Math.random()) * 255;
          setter(_color, {x, y, xmax});
        });
      });
    }

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
      () => {
        //this.canvas.style.filter = 'url(#myFilter)';
        ctx.putImageData( randomImageData, 0, 0 );
      }
    );
  }

  function filter(setter){
    this.canvas.style.filter = this.canvas.style.filter
      ? ''
      : 'url(#myFilter)';
  }

  var buttons = [{
    text: 'random',
    onClick: init
  }, {
    text: 'filter',
    onClick: filter
  }];


  var options = {
    init,
    buttons
  };


  function ready(){
    var cv = new CanvasPlus(options);
    cv.start();
  }

  document.addEventListener('DOMContentLoaded', ready, false);

})(window)
