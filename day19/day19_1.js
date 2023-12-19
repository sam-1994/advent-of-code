const utils = require('../utils')

function parseRule(line) {
  const bracketIndex = line.indexOf('{');
  const name = line.substring(0, bracketIndex);
  const workflow = line.substring(bracketIndex + 1, line.length - 1).split(',').map(
    (condition) => {
      if (condition.indexOf(':') < 0) {
        return {
          target: condition,
        };
      } else {
        return {
          variable: condition.charAt(0),
          operator: condition.charAt(1),
          value: Number.parseInt(condition.substring(2, condition.indexOf(':'))),
          target: condition.substring(condition.indexOf(':') + 1),
        }
      }
    }
  );

  return {
    name,
    workflow,
  };
}

function parseVariables(line) {
  return line.substring(1, line.length - 1)
    .split(',')
    .reduce(
      (result, equation) => {
        const name = equation.charAt(0);
        const value = Number.parseInt(equation.substring(2));
        result[name] = value;
        return result;
      },
      {}
    );
}

function isSetAccepted(ruleMap, set, ruleName) {
  if (ruleName === 'A') {
    return true;
  } else if (ruleName === 'R') {
    return false;
  }

  const workflow = ruleMap.get(ruleName);
  for (let i = 0; i < workflow.length; i++) {
    const currentCondition = workflow[i];
    if (!currentCondition.variable) {
      return isSetAccepted(ruleMap, set, currentCondition.target);
    }

    const variableValue = set[currentCondition.variable];
    if(currentCondition.operator === '<' && variableValue < currentCondition.value) {
      return isSetAccepted(ruleMap, set, currentCondition.target);
    } else if(currentCondition.operator === '>' && variableValue > currentCondition.value) {
      return isSetAccepted(ruleMap, set, currentCondition.target);
    }
  }
}

const input = utils.getFileContent(19);

let emptyLineIndex = input.indexOf('');
const rules = input.slice(0, emptyLineIndex).map(parseRule);
const variables = input.slice(emptyLineIndex + 1).filter((line) => line.length > 0).map(parseVariables);

console.log('Rules:');
console.log(...rules);

console.log('Variables:');
console.log(...variables);

const ruleMap = new Map();
rules.forEach((rule) => ruleMap.set(rule.name, rule.workflow));

const resultSum = variables
  .filter((set) => isSetAccepted(ruleMap, set, 'in'))
  .map((set) => set.x + set.m + set.a + set.s)
  .reduce((sum, value) => sum + value, 0);

console.log(resultSum);
