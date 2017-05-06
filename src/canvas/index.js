((window)=> {

  const {Architect, Trainer} = synaptic;

  var results = [];
  const network = new Architect.Perceptron(16,127,1);
  const trainingOptions = {
    rate: .1,
    iterations: 10000,
    error: .001,
    shuffle: true,
    log: 1
  };
  const trainer = new Trainer(network);
  
  const clone = item => {
    return JSON.parse(JSON.stringify(item));
  };

  const intToBitArray = (number, len) => {
    function padLeft(nr, n, str){
      return Array(n-String(nr).length+1).join(str||'0')+nr;
    } 

    return padLeft((number).toString(2), len).split('').map(val=>parseInt(val));
  };

  function range(from, to){
    return new Array(to).fill();
  }

  function trainingSetFromImageData(id, xmax, ymax){
    var results = [];

    range(0, xmax).forEach((unused_x, x) => {
      range(0, ymax).forEach((unused_y, y) => {
        
        const offset = xmax*y*4 + x*4;
        results.push({
          input: intToBitArray(x,8).concat(intToBitArray(y,8)),
          output: [
            id[offset + 1]/255
          ]
        });

      });
    });

    return results;
  }

  function imageFromNet(imageData, setter, xmax, ymax){
    range(0, xmax).forEach((unused_x, x) => {
      range(0, ymax).forEach((unused_y, y) => {
        const offset = xmax*y*4 + x*4;
        var _color = {
          r: 0,
          g: Math.round(network.activate(
              intToBitArray(x,8).concat(intToBitArray(y,8))
            )[0]) * 255,
          b: 0,
          a: 255
        };
        setter(imageData, _color, {x, y, xmax});
      });
    });
    return imageData;
  }

  var neuralImageData;
  function neuralize(setter){
    //init.bind(this)(setter);
    const ctx = this.canvas.getContext('2d');

    const neuralImageData = ctx.getImageData(0, 0, this.dimensions.x, this.dimensions.y);

    const trainingSet = trainingSetFromImageData(neuralImageData.data, this.dimensions.x, 2);

    trainer.trainAsync(trainingSet, trainingOptions)
      .then(results => {
        console.log('done training!');
        imageFromNet(neuralImageData, setter, this.dimensions.x, this.dimensions.y);
        requestAnimationFrame(() => {
          ctx.putImageData( neuralImageData, 0, 0 );
        });
      });
  }


  var randomImageData;
  function init(setter){
    if (!setter) return;

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

    ctx.putImageData( randomImageData, 0, 0 );
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
  }, {
    text: 'neural',
    onClick: neuralize
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
