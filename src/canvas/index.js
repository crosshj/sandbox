((window)=> {

  var options = {
    // init: function(setter) {
    //   var ctx = this.canvas.getContext('2d');

    //   requestAnimationFrame(
    //     () => {
    //       ctx.fillStyle = "#FF0000";
    //       ctx.fillRect(0,0,10,10);
    //     }
    //   );
    // }
  };


  function ready(){
    var cv = new CanvasPlus(options);
    cv.start();
  }

  document.addEventListener('DOMContentLoaded', ready, false);

})(window)
