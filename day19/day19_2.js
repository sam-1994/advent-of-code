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

function getAcceptedRanges(ruleMap, ranges, ruleName) {
  if (ruleName === 'A') {
    return [ranges];
  } else if (ruleName === 'R') {
    return [];
  }

  const results = [];

  const workflow = ruleMap.get(ruleName);
  let workflowFinished = false;
  for (let i = 0; i < workflow.length && !workflowFinished; i++) {
    const currentCondition = workflow[i];
    if (!currentCondition.variable) {
      results.push(
        ...getAcceptedRanges(ruleMap, ranges, currentCondition.target)
      );
      workflowFinished = true;
      continue;
    }

    const variableMin = ranges[currentCondition.variable + 'Min'];
    const variableMax = ranges[currentCondition.variable + 'Max'];
    const conditionValue = currentCondition.operator === '<' ? currentCondition.value - 1 : currentCondition.value + 1
    if (currentCondition.operator === '<') {
      if (conditionValue >= variableMax) {
        results.push(...getAcceptedRanges(ruleMap, ranges, currentCondition.target));
        workflowFinished = true;
        continue;
      } else if (conditionValue >= variableMin) {
        results.push(
          ...getAcceptedRanges(
            ruleMap, {
              ...ranges,
              [currentCondition.variable + 'Max']: conditionValue,
            },
            currentCondition.target
          )
        );
        ranges[currentCondition.variable + 'Min'] = conditionValue + 1;
      }
    } else if (currentCondition.operator === '>') {
      if (conditionValue <= variableMin) {
        results.push(...getAcceptedRanges(ruleMap, ranges, currentCondition.target));
        workflowFinished = true;
        continue;
      } else if (conditionValue <= variableMax) {
        results.push(
          ...getAcceptedRanges(
            ruleMap, {
              ...ranges,
              [currentCondition.variable + 'Min']: conditionValue,
            },
            currentCondition.target
          )
        );
        ranges[currentCondition.variable + 'Max'] = conditionValue - 1;
      }
    }
  }

  return results;
}

const input = utils.getFileContent(19);

let emptyLineIndex = input.indexOf('');
const rules = input.slice(0, emptyLineIndex).map(parseRule);

console.log('Rules:');
console.log(...rules);


const ruleMap = new Map();
rules.forEach((rule) => ruleMap.set(rule.name, rule.workflow));

const results = getAcceptedRanges(
  ruleMap,
  {
    xMin: 1,
    xMax: 4000,
    mMin: 1,
    mMax: 4000,
    aMin: 1,
    aMax: 4000,
    sMin: 1,
    sMax: 4000,
  },
  'in',
);

console.log(results);

const sum = results.reduce(
  (sum, ranges) => {
    return sum +
      (ranges.xMax - ranges.xMin + 1) *
      (ranges.mMax - ranges.mMin + 1) *
      (ranges.aMax - ranges.aMin + 1) *
      (ranges.sMax - ranges.sMin + 1);
  },
  0
);

console.log(sum);
