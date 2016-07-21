(() => {

  //-- Redux
  //––––––––––––––––––––––––––––––––––––––––––––––––––

  function reduxSetup(){
    var store;

    // Reducer
    function counter (state, action) {
      if (typeof state == 'undefined') {
        state = 0;
      }

      switch (action.type) {
        case 'INCREMENT':
          state++;
          break;
        case 'DECREMENT':
          state--;
          break;
      }
      return state;
    }

    function render() {
      document.querySelector('#counter').innerHTML = store.getState();
    }

    var store = Redux.createStore(counter);
      store.subscribe(render);
    render();

    setInterval(function() {
    	store.dispatch({type: 'DECREMENT'});
    }, 1000);

    document.addEventListener('click', function() {
      store.dispatch({type: 'INCREMENT'});
    });

    return store;
  }

  //-- React
  //––––––––––––––––––––––––––––––––––––––––––––––––––

  function reactSetup() {
    //TODO: would be nice to have JSX and watch+babel here
    var Hello = function(props) {
        return React.createElement("div", null, "Hello ", props.name);
    };

    ReactDOM.render(
      React.createElement(Hello, {name: "World"}),
      document.getElementById('container')
    );
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    reduxSetup();
    reactSetup();
  });

})();
