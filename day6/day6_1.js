const utils = require('../utils')

// d < x*(t-x) = tx - x^2
//
// x^2 - tx + d < 0
// (x - t/2)^2 - t^2/4 + d < 0
// (x - t/2)^2 < t^2/4 - d
// |x - t/2| < sqrt(t^2/4 - d)
//
// Solution 1:
// x - t/2 < sqrt(t^2/4 - d)
// x < t/2 + sqrt(t^2/4 - d)
//
// Solution 2:
// -x + t/2 < sqrt(t^2/4 - d)
// t/2 -sqrt(t^2/4 - d) < x
//
// Final:
//   t/2 - sqrt(t^2/4 - d) < x < t/2 + sqrt(t^2/4 - d)
//
//
// Race 1: t=7, d=9
// t/2 = 7/2 = 3,5
// Wurzel(t^2/4 - d) = Wurzel(3,25) ≈ 1,8
// 3,5 - 1,8 = 1,7 < x < 3,5 + 1,8 = 5,3
// => 5-1 = 4
//
// Race 2: t=15, d=40
// t/2 = 15/2 = 7,5
// Wurzel(15^2/4 - 40) = Wurzel(16,25) ≈ 4,1
// 7,5 - 4,1 = 3,4 < x < 7,5 + 4,1 = 11,6
// => 11 - 3 = 8
//
// Race 3: t=30, d=200
// t/2 = 30/2 = 15
// Wurzel(30^2/4 - 200) = Wurzel(25) = 5
// 15 - 5 = 10 < x < 15 + 5 = 20
// => 20 - 11 = 9
//


let input = utils.getFileContent(6);

const times = input[0].split(':')[1].split(' ').filter((value) => value.length > 0);
const distances = input[1].split(':')[1].split(' ').filter((value) => value.length > 0);
const races = times.length;
console.log(times, distances);

let product = 1;

// t/2 - sqrt(t^2/4 - d) < x < t/2 + sqrt(t^2/4 - d)
for (let i = 0; i < races; i++) {
  const t = times[i];
  const d = distances[i];
  console.log(`Race ${i + 1}, time ${t}, distance ${d}`);

  let min = t / 2 - Math.sqrt(t * t / 4 - d);
  let max = t / 2 + Math.sqrt(t * t / 4 - d);

  console.log('Calculated:', min, max);

  if (Math.floor(min) === min) {
    min++
  } else {
    min = Math.floor(min);
  }
  max = Math.floor(max);
  console.log('Rounded:', min, max);
  console.log('Value:', max - min);

  product *= max - min
  console.log('----------------');
}

console.log('Product:', product);
