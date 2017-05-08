((window)=> {

  const {Architect, Trainer} = synaptic;

  var results = [];

  const clone = item => {
    return JSON.parse(JSON.stringify(item));
  };

  const intToBitArray = (number, len) => {
    function padLeft(nr, n, str){
      return Array(n-String(nr).length+1).join(str||'0')+nr;
    } 

    return padLeft((number).toString(2), len).split('').map(val=>parseInt(val));
  };

  const intToOneBitInArray = (number, parentSize) => {
    var array = new Array(parentSize).fill(0);
    array[number] = 1;
    return array;
  }

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

  function imageFromNet(imageData, setter, xmax, ymax, nt){
    range(0, xmax).forEach((unused_x, x) => {
      range(0, ymax).forEach((unused_y, y) => {
        const offset = xmax*y*4 + x*4;
        var _color = {
          r: 0,
          g: Math.round(nt.activate(
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

  function neuralize(setter){
    //init.bind(this)(setter);
    const ctx = this.canvas.getContext('2d');
    gridProcess(ctx, setter, this.dimensions.x, this.dimensions.y);
  }

  function gridProcess(ctx, setter, xmax, ymax){
  // var input = 16;
  // var pool = 100;
  // var output = 1;
  // var connections = 200;
  // var gates = 50;

  // const network = new Architect.Liquid(input, pool, output, connections, gates);

    var tasksArray = [];
    const tOptions = {
      rate: .01,
      iterations: 3350,
      error: .05,
      shuffle: false,
      log: 0
    };

    range(0, xmax/10).forEach((unused_x, x) => {
      range(0, ymax/10).forEach((unused_y, y) => {
        tasksArray.push((callback) => {
          const id = ctx.getImageData(x*10, y*10, 10, 10);
          const set = trainingSetFromImageData(id.data, 10, 10);
            // make it light while thinking
          id.data.forEach((x,i) => {
            if(i%4==0 && id.data[i+1] < 255){
              return;
            }
            if(i%4-2==0 && id.data[i-1] < 255){
              return;
            }
            if(i%4-1==0 && id.data[i] < 255){
              id.data[i] = x+30;
              return;
            }
            id.data[i] = x<255 ? 255 : x;
          });
          //debugger;
          requestAnimationFrame(() => {
            ctx.putImageData( id, x*10, y*10);
          });
          const net = new Architect.Perceptron(16,32,1);


          new Trainer(net).trainAsync(set, tOptions)
            .then(results => {
              //console.log(results);
              imageFromNet(id, setter, 10, 10, net);
              requestAnimationFrame(() => {
                if(results.error < 0.15){
                  ctx.putImageData( id, x*10, y*10);
                }
                callback();
              });
            });
          });
      });
    });

    var task = 0;
    var taskCallback = ()=>{
      task+=1;
      if(task >= tasksArray.length){ return; }
      tasksArray[task](taskCallback);
    };
    tasksArray[task](taskCallback);
  }


  var randomImageData;
  function init(setter){
    if (!setter) return;

    var ctx = this.canvas.getContext('2d');

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
