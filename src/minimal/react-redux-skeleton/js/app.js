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

  function reactReduxSetup() {
    var defaultState = {
        greeting: "Hello World!"
    };

    function reducerFunction() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
        var action = arguments[1];

        return state;
    }

    var store = Redux.createStore(reducerFunction);

    var Svg = ({greeting}) => {
      console.log(greeting);
      var props = {
        className: 'image',
        width: 20,
        height: 10
      };
      var children = [
        React.DOM.circle({
          cx: 15,
          cy: 5,
          r: 5,
          fill: 'cadetblue'
        })
      ];

      return React.DOM.svg(props, children);
    };

    var App = (props) => {
      var _props = {
        className: 'app'
      };
      var _children = [
        props.greeting,
        Svg(props)
      ];
      return React.DOM.div(_props, _children);
    };

    App = ReactRedux.connect(function (state) {
        return state;
    })(App);

    ReactDOM.render(React.createElement(
        ReactRedux.Provider,
        { store: store },
        React.createElement(App, null)
    ), document.getElementById('app'));
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    reduxSetup();
    reactSetup();
    reactReduxSetup();
  });

})();
