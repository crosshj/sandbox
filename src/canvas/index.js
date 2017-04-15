(()=> {
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
  
  function ready(){
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    // boo, bad global
    window.setPixel = (color, pos) => setCanvasPixel(ctx, color, pos);
    
    setPixel({r:255}, {x:10, y:10});
  }
  document.addEventListener('DOMContentLoaded', ready, false);
})();
