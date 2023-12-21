const utils = require('../utils')

const inputs = utils.getFileContent(20)
  .filter((line) => line.length > 0)
  .map(
    (line) => {
      const type = line.charAt(0);
      const name = line.substring(type === 'b' ? 0 : 1, line.indexOf(' '));
      const outputs = line.split(' -> ')[1].split(', ');

      if (type === '%') {
        return {
          type,
          name,
          outputs,
          on: false,
        }
      } else if (type === '&') {
        return {
          type,
          name,
          outputs,
          lastPings: new Map(),
        }
      } else {
        return {
          type,
          name,
          outputs,
        }
      }
    }
  );

const inputMap = new Map();
const outputMap = new Map();

inputs.forEach((input) => {
  inputMap.set(input.name, input);
  input.outputs.forEach((output) => {
    let inputsOfOutput = outputMap.get(output);
    if (!inputsOfOutput) {
      inputsOfOutput = [];
      outputMap.set(output, inputsOfOutput);
    }
    inputsOfOutput.push(input.name);
  })
})

inputs
  .filter((input) => input.type === '&')
  .forEach((input) => {
    outputMap.get(input.name).forEach((output) => {
      input.lastPings.set(output, false);
    });
  });

console.log(inputMap.entries());
console.log(outputMap.entries());

let countLowPulses = 0;
let countHighPulses = 0;

function pushButton() {
  const signals = [{
    from: null,
    input: 'broadcaster',
    high: false,
  }];

  while (signals.length > 0) {
    const signal = signals.shift();

    if (signal.high) {
      countHighPulses++;
    } else {
      countLowPulses++;
    }

    const input = inputMap.get(signal.input);

    if (input?.type === '%' && !signal.high) {
      input.on = !input.on;
      input.outputs.forEach((output) => {
        signals.push({
          from: input.name,
          input: output,
          high: input.on,
        });
      });
    }

    if (input?.type === '&') {
      input.lastPings.set(signal.from, signal.high);

      const nextPulse = [...input.lastPings.values()].some((high) => !high);

      input.outputs.forEach((output) => {
        signals.push({
          from: input.name,
          input: output,
          high: nextPulse,
        });
      });
    }

    if (input?.type === 'b') {
      input.outputs.forEach((output) => {
        signals.push({
          from: input.name,
          input: output,
          high: false,
        });
      });
    }

  }
}

for (let i = 0; i < 1000; i++) {
  pushButton();
}

console.log('Low', countLowPulses);
console.log('High', countHighPulses);
console.log('product', countLowPulses * countHighPulses);
