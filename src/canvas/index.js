(()=> {
  const XMAX = 160;
  const YMAX = 120;


  var newWorker = function (funcObj) {
    // TODO: also should work with multiple functions and external file

    var blobURL = URL.createObjectURL(new Blob(['(',
        funcObj.toString(),
      ')()'], {
      type: 'application/javascript'
    })),

    worker = new Worker(blobURL);

    URL.revokeObjectURL(blobURL);

    return worker;
  }

  //http://www.hyperlounge.net/blog/up-the-workers-2/
  //https://www.html5rocks.com/en/tutorials/workers/basics/
  //https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast
  //http://www.hyperlounge.net/blog/up-the-workers-2/

// TODO: use this to do the heavy lifting
//   var w = newWorker(function () {
//     var i = 0;

//     function timedCount() {
//         i = i + 1;
//         postMessage(i);
//         setTimeout(timedCount, 500);
//     }

//     timedCount();
//   });

//   w.onmessage = function (event) {
//       document.getElementById("result").innerHTML = event.data;
//   }

  // dynamically append css
  function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
  }

  // TODO: fully create canvas in DOM given root element and dimensions
  // ...


  // set one pixel at a time
  var id, d;
  function setCanvasPixel(context, {r=0, g=0, b=0, a=255}, {x=0, y=0}){
    id = id || context.createImageData(1,1); // only do this once per page
    d  = d || id.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;
    context.putImageData( id, x, y );
  }

  // used for setting entire page at a time
  function newImageData(context, {x=1,y=1}){
    return context.createImageData(x, y);
  }

  // used for setting entire page at a time
  var ad;
  function setImageDataPixel(imageData, {r=0, g=0, b=0, a=255}, {x=0, y=0, xmax=1}){
    ad = ad || imageData.data;

    const rowOffset = y * 4 * xmax;
    const colOffset = x * 4;
    const offset = rowOffset + colOffset;
    ad[offset + 0]   = r;
    ad[offset + 1]   = g;
    ad[offset + 2]   = b;
    ad[offset + 3]   = a;
  }

  function range(from, to){
    return new Array(to).fill();
  }

  function randomInt(min, max) {
    return Math.floor(max - Math.random()*(max-min))
  }

  // http://stackoverflow.com/a/23095731/1627873
  function randomRGB(){
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return { r, g, b };
  }

  // https://remysharp.com/2010/07/21/throttling-function-calls
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  // https://remysharp.com/2010/07/21/throttling-function-calls
  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  function randomPixel(setter){
    range(0, XMAX).forEach((unused_x, x) => {
      range(0, YMAX).forEach((unused_y, y) => {
        setter(randomRGB(), {x, y, xmax: XMAX});
      });
    });
  }

  const defaultCSS = `

  @media (min-width:320px) { /* smartphones, portrait iPhone, portrait 480x320 phones (Android) */ }
  @media (min-width:480px) { /* smartphones, Android phones, landscape iPhone */ }
  @media (min-width:600px) { /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */ }
  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
  @media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
  @media (min-width:1281px) { /* hi-res laptops and desktops */ }

    body {
      background-color: #000;
      font-family: verdana;
    }


    #canvas-container {
      display: flex;
      flex-direction: column;
    }

    #rotateMessage {
      display: none;
      color: white;
      width: 90%;
      margin: auto;
      text-align: center;
      font-size: 5em;
      color: #00BCD4;
    }

    @media screen and (orientation: portrait) and (min-height: 650px) and (max-height: 985px) {
      #canvas-container { display: none; }
      #rotateMessage { display: block; }
    }

    #canvas-container canvas {
      zoom: 5;
      margin: auto;
      border: 0px solid #8a8a8a;
      /* box-shadow: 1px -4px 12px 0px #d4d4d4; */
      background-color: #fefefe;
      margin-top: 5%;
      image-rendering: pixelated;
      border-radius: 0.5px;
    }

    @media screen and (max-width: 1400px) {
      #canvas-container canvas{
        zoom: 4;
        margin-top: 2%;
      }
    }

    @media screen and (max-width: 750px) {
      #canvas-container canvas{
        zoom: 3;
      }
    }

    @media screen and (max-width: 750px)
    and (orientation: landscape) and (max-height: 450px) {
      #canvas-container canvas{
        zoom: 2.5;
      }
    }

    @media screen and (max-width: 500px) {
      #canvas-container canvas{
        zoom: 2;
      }
    }

    @media screen and (max-width: 350px) {
      #canvas-container canvas{
        zoom: 1;
      }
    }

    #button-container {
      align-self: flex-end;
      margin: auto;
      margin-top: 4em;
    }

    button {
      border-radius: 50px;
      color: #333333;
      font-size: 20px;
      background: rgba(255, 255, 255, 0.1);
      padding: 9.5px 15px 11px 15px;
      text-decoration: none;
      border: 1px solid transparent;
      width: 42px;
      min-height: 42px;
      color: transparent;
      margin: 10px 10px;
      transition: background-color 1s, color 0s;
      overflow: hidden;
    }

    button:hover {
      background-color: #7eccfc;
      color: #111;
      width: auto;
      transition: color 0.5s;
    }

    :focus {
      display: inline-block;
      border: 1px solid red;
      outline: none;
      border-radius: 45px;
    }

    @media screen and (max-width: 1400px) {
      #button-container {
        margin-top: 2em;
      }
    }

    @media screen and (max-width: 750px) {
      #button-container {
        margin-top: 1em;
      }
    }

    @media screen and (max-width: 500px) {
      #button-container {
        margin-top: 1em;
      }
    }

  `;

  var randomImageData;
  function randomPixels(){
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    randomImageData = randomImageData
      ? randomImageData
      : newImageData(ctx, {x:XMAX, y:YMAX});
    randomPixel((color, pos) => setImageDataPixel(randomImageData, color, pos));
    requestAnimationFrame(
      () => ctx.putImageData( randomImageData, 0, 0 )
    );
  }

  function makeCanvas({width=XMAX, height=YMAX}={}){
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.id = 'myCanvas';
    canvas.textContent = 'Your browser does not support the HTML5 canvas tag.';
    canvas.style.filter = 'url(#myFilter)';
    return canvas;
  }

  function makeButtons({buttons = [] } = {}){
    var buttonDiv = document.createElement('div');
    buttonDiv.id = 'button-container';

    var first, last;
    buttons.forEach((button,index) => {
      var el = document.createElement('button');
      el.textContent = button.text;
      el.onclick = button.onClick;
      el.tabindex = index;
      if (index === 0){
        first = el;
      }
      if (index === buttons.length - 1){
        last = el;
        el.onkeydown = function(e){
          if( e.keyCode === 9 ) {
              first.focus();
              return false;
          }
        };
      }
      buttonDiv.appendChild(el);
    });

    buttonDiv.querySelectorAll('button')[0].onkeydown = function(e){
      if( e.keyCode === 9 && e.shiftKey) {
        last.focus();
        return false;
      }
    };

    return buttonDiv;
  }

  function createCanvas() {
    var div = document.createElement('div');
    div.id = 'canvas-container';

    var canvas = makeCanvas();
    div.appendChild(canvas);

    var buttonDiv = makeButtons({
      buttons: [
        {text: 'random', onClick: throttle(randomPixels)}
      ]
    });
    div.appendChild(buttonDiv);

    document.body.appendChild(div);
    div.querySelectorAll('button')[0].focus();

    var rotMess = document.createElement('div');
    rotMess.id = 'rotateMessage';
    rotMess.textContent = 'Rotate your device!';
    document.body.appendChild(rotMess);
  }

  function ready(){
    addcss(defaultCSS);
    createCanvas();
    randomPixels();

    // boo, bad global
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    window.setPixel = (color, pos) => setCanvasPixel(ctx, color, pos);
  }
  document.addEventListener('DOMContentLoaded', ready, false);
})();


/*

// modularize

var foo = new Canvas({
  id: "myCanvas",
  parent: 'body', //selector or element
  dimensions: {
    x: 320,
    y: 240
  },
  css: '', //if none will use default, or will add to default?
  init: (setter) => {console.log(do something to init canvas); },
  buttons: [
    {text: 'random', onClick: (setter) => { console.log('do something with setter'); }},
    {}
  ],
  workers: [{
    function: () => { postMessage('this will happen in worker'); },
    onMessage: (event) => { console.log('worker posted message: ', event.data); } // should know how to set pixels
  },{
    files: ['worker.js'],
    onMessage: (event) => { console.log('worker posted message: ', event.data); } // should know how to set pixels
  }]
});

foo.start()
foo.stop()




*/
