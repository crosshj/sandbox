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

    const conicDefs = (() => {
      const gradients = [
        {
          id: "redyel",
          x1: 0, y1: 0,
          x2: 1, y2: 1
        }, {
          id: "yelgre",
          x1: 0, y1: 0,
          x2: 0, y2: 1
        }, {
          id: "grecya",
          x1: 1, y1: 0,
          x2: 0, y2: 1
        }, {
          id: "cyablu",
          x1: 1, y1: 1,
          x2: 0, y2: 0
        }, {
          id: "blumag",
          x1: 0, y1: 1,
          x2: 0, y2: 0
        }, {
          id: "magred",
          x1: 0, y1: 1,
          x2: 1, y2: 0
        }
      ];

      const defsChildren = gradients.map((gradient, index) => {
        const gradientProps = Object.assign({}, gradient, {
        	gradientUnits: "objectBoundingBox",
          key: index
        });
        const gradientChildren = [
          React.DOM.stop({
            offset: '0%'
          }),
          React.DOM.stop({
            offset: '100%'
          })
        ];
        return React.DOM.linearGradient(gradientProps, gradientChildren);
      });

      return React.DOM.defs(null, defsChildren);
    })();

    const conicG = (() => {
      const paths = [
        { d: "M 0,-100 A 100,100 0 0,1 86.6,-50",    stroke: "url(#redyel)" },
        { d: "M 86.6,-50 A 100,100 0 0,1 86.6,50",   stroke: "url(#yelgre)"},
        { d: "M 86.6,50 A 100,100 0 0,1 0,100",      stroke: "url(#grecya)"},
        { d: "M 0,100 A 100,100 0 0,1 -86.6,50",     stroke: "url(#cyablu)"},
        { d: "M -86.6,50 A 100,100 0 0,1 -86.6,-50", stroke: "url(#blumag)"},
        { d: "M -86.6,-50 A 100,100 0 0,1 0,-100",   stroke: "url(#magred)"}
      ];
      const conicGChildren = paths.map((path, index) => {
        const pathProps = Object.assign({}, path, {
          key: index
        });
        return React.DOM.path(null, pathProps);
      });
      return React.DOM.g(null, conicGChildren);
    })();

    const Svg = () => {
      const props = {
        viewBox: "-10 -10 220 220",
        width: "100%"
      };
      const children = [
        conicDefs,
        conicG
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
