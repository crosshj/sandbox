// SYNAPTIC --------------------------------------------------------------------

var history = [];
const train = ({color}={}, output) => {
  if (!color || !output ) return;

  debugger;
  //TODO: add input/output to history and train
  return;
}

const predict = input => {
  // TODO: activate net for input
  const output = 0;
  return output;
}

// CYCLE -----------------------------------------------------------------------
function render(state){
  const {button, div, label, input, h1, p} = CycleDOM;

  return div([
    div('#desc','synaptic.js demo - train a neural network to recognize color contrast'),
    div('#container', [
      div('#training-box.section', [
        div('.section-header', 'Which one can you read more easily?'),
        div('#swatches', [
          div(`.swatch-box${!state.guess?'.guess':''}`, [
            div('#black-swatch.swatch',
              {style: colorToStyle(state.color)},
              [div('.swatch-text', 'This one')]
            )
          ]),
          div(`.swatch-box${state.guess?'.guess':''}`, [
            div('#white-swatch.swatch',
              {style: colorToStyle(state.color)},
              [div('.swatch-text', 'This one')]
            )
          ])
        ]),
        p('Counter: ' + state.guess)
      ])
    ])
  ]);
}

const colorToStyle = (color) => ({
  backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`
});

const randomColor = () => {
  var rint = Math.floor( 0x100000000 * Math.random());
  return {
    r: rint & 255,
    g: rint >> 8 & 255,
    b: rint >> 16 & 255
  };
};

function main(sources) {
  const xs = xstream.default;

  const action$ = xs.merge(
    sources.DOM.select('#black-swatch').events('click').mapTo(0),
    sources.DOM.select('#white-swatch').events('click').mapTo(1)
  );

  const accumulator = (acc, next) => {
    train(acc, next);
    const color = randomColor();
    const guess = predict(color);
    return { color, guess };
  };
  const initial = accumulator();

  const state$ = action$.fold(accumulator, initial);
  const vdom$ = state$.map(render);

  const driverSinks = {
    DOM: vdom$
  };

  return driverSinks;
}

function createDOM(){
  const {run} = Cycle;
  const {makeDOMDriver} = CycleDOM;

  const drivers = {
    DOM: makeDOMDriver('#app')
  };

  run(main, drivers);
}

document.addEventListener('DOMContentLoaded', createDOM, false);
