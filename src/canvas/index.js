(()=> {
  // http://stackoverflow.com/a/20693860/1627873
  var newWorker = function (funcObj) {
    // Build a worker from an anonymous function body
    var blobURL = URL.createObjectURL(new Blob(['(',
        funcObj.toString(),
      ')()'], {
      type: 'application/javascript'
    })),

    worker = new Worker(blobURL);

    // Won't be needing this anymore
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
  
  function randomPixel(setter){
    range(0, 640).forEach((unused_x, x) => {
      range(0, 480).forEach((unused_y, y) => {
        setter(randomRGB(), {x, y, xmax: 640});
      });
    });
  }
  
  function ready(){
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    // boo, bad global
    window.setPixel = (color, pos) => setCanvasPixel(ctx, color, pos);
    window.range = range;
    
    var imageData = newImageData(ctx, {x:640, y:480});
    randomPixel((color, pos) => setImageDataPixel(imageData, color, pos));
    requestAnimationFrame(
      () => ctx.putImageData( imageData, 0, 0 )
    );
  }
  document.addEventListener('DOMContentLoaded', ready, false);
})();
