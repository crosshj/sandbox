(() => {

  //-- Redux
  //––––––––––––––––––––––––––––––––––––––––––––––––––

  function reduxSetup(){
    // Reducer
    function counter (state = 0, action) {
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

    const store = Redux.createStore(counter);
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
    const HelloComponent = function({name='No Name Provided'}) {
        return React.createElement("div", null, "Hello ", name);
    };

    ReactDOM.render(
      React.createElement(HelloComponent, {name: "World"}),
      document.getElementById('container')
    );
  }

  function reactReduxSetup() {
    const defaultState = {
        greeting: "Hello World!"
    };

    function reducerFunction() {
        const state = arguments.length <= 0 || arguments[0] === undefined
          ? defaultState
          : arguments[0];
        const action = arguments[1];

        return state;
    }

    const store = Redux.createStore(reducerFunction);

    const Svg = ({greeting='no greeting provided'}={}) => {
      console.log(greeting);
      const props = {
        className: 'image',
        width: 20,
        height: 10
      };
      const children = [
        React.DOM.circle({
          cx: 15,
          cy: 5,
          r: 5,
          fill: 'cadetblue'
        })
      ];

      return React.DOM.svg(props, children);
    };

    let App = ({greeting='no greeting provided'}={}) => {
      const props = {
        className: 'app'
      };
      var children = [greeting, Svg()];
      return React.DOM.div(props, children);
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
