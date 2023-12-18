const utils = require('../utils')

function renderMap(map, path) {
  console.log('Map:')
  map.forEach((row) => {
    console.log(...row.map((node) => {
      return (path.indexOf(node) < 0 ? ' ' : 'X') + node.heat + '_';
    }));
  });
}

function renderPath(path) {
  let pathHeat = 0;
  console.log(path.map((n) => {
    pathHeat += n.heat;
    return {x: n.x, y: n.y, pathHeat};
  }))
}

function getPossibleNextEdges(map, edge) {
  const edges = [];

  const targetEdges = edge.target.edges;

  if (!!targetEdges.up && edge.direction !== 'down' && (edge.direction !== 'up' || edge.streightSteps < 3) && edge.currentHeat + targetEdges.up.target.heat <= targetEdges.up.currentHeat) {
    targetEdges.up.streightSteps = edge.direction === 'up' ? edge.streightSteps + 1 : 1
    targetEdges.up.currentHeat = edge.currentHeat + targetEdges.up.target.heat;
    targetEdges.up.path = [...edge.path, targetEdges.up.target];
    edges.push(targetEdges.up);
  }

  if (!!targetEdges.right && edge.direction !== 'left' && (edge.direction !== 'right' || edge.streightSteps < 3) && edge.currentHeat + targetEdges.right.target.heat <= targetEdges.right.currentHeat) {
    targetEdges.right.streightSteps = edge.direction === 'right' ? edge.streightSteps + 1 : 1
    targetEdges.right.currentHeat = edge.currentHeat + targetEdges.right.target.heat;
    targetEdges.right.path = [...edge.path, targetEdges.right.target];
    edges.push(targetEdges.right);
  }

  if (!!targetEdges.down && edge.direction !== 'up' && (edge.direction !== 'down' || edge.streightSteps < 3) && edge.currentHeat + targetEdges.down.target.heat <= targetEdges.down.currentHeat) {
    targetEdges.down.streightSteps = edge.direction === 'down' ? edge.streightSteps + 1 : 1
    targetEdges.down.currentHeat = edge.currentHeat + targetEdges.down.target.heat;
    targetEdges.down.path = [...edge.path, targetEdges.down.target];
    edges.push(targetEdges.down);
  }

  if (!!targetEdges.left && edge.direction !== 'right' && (edge.direction !== 'left' || edge.streightSteps < 3) && edge.currentHeat + targetEdges.left.target.heat <= targetEdges.left.currentHeat) {
    targetEdges.left.streightSteps = edge.direction === 'left' ? edge.streightSteps + 1 : 1
    targetEdges.left.currentHeat = edge.currentHeat + targetEdges.left.target.heat;
    targetEdges.left.path = [...edge.path, targetEdges.left.target];
    edges.push(targetEdges.left);
  }

  return edges;
}

function getIndexOfEdgeWithMinHeat(map, edges) {
  let index = 0;
  const maxX = map[0].length - 1;
  const maxY = map.length - 1;

  for (let i = 1; i < edges.length; i++) {
    const edgeI = edges[i];
    const edgeIndex = edges[index];

    const heatEstimationI = edgeI.currentHeat + maxY - edgeI.target.y + maxX - edgeI.target.x;
    const heatEstimationIndex = edgeIndex.currentHeat + maxY - edgeIndex.target.y + maxX - edgeIndex.target.x;
    if (heatEstimationI < heatEstimationIndex) {
      index = i;
    }
  }

  return index;
}

const map = utils.getFileContent(17)
  .filter((line) => line.length > 0)
  .map((line, y) => line.split('').map((value, x) => ({
    x,
    y,
    heat: Number.parseInt(value),
    edges: {
      up: undefined,
      right: undefined,
      down: undefined,
      left: undefined,
    }
  })));

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    const node = map[y][x];
    if (x > 0) {
      node.edges.left = {
        direction: 'left',
        streightSteps: Number.MAX_VALUE,
        currentHeat: Number.MAX_VALUE,
        path: [],
        from: map[y][x],
        target: map[y][x - 1],
      };
    }

    if (x < map[0].length - 1) {
      node.edges.right = {
        direction: 'right',
        streightSteps: Number.MAX_VALUE,
        currentHeat: Number.MAX_VALUE,
        path: [],
        from: map[y][x],
        target: map[y][x + 1],
      };
    }

    if (y > 0) {
      node.edges.up = {
        direction: 'up',
        streightSteps: Number.MAX_VALUE,
        currentHeat: Number.MAX_VALUE,
        path: [],
        from: map[y][x],
        target: map[y - 1][x],
      };
    }

    if (y < map.length - 1) {
      node.edges.down = {
        direction: 'down',
        streightSteps: Number.MAX_VALUE,
        currentHeat: Number.MAX_VALUE,
        path: [],
        from: map[y][x],
        target: map[y + 1][x],
      };
    }
  }
}

let currentEdges = [map[0][0].edges.right, map[0][0].edges.down];

currentEdges.forEach((edge) => {
  edge.currentHeat = edge.target.heat;
  edge.streightSteps = 1;
  edge.path = [edge.from, edge.target];
});

let currentBestEdge;

do {
  const currentBesEdgeIndex = getIndexOfEdgeWithMinHeat(map, currentEdges);
  currentBestEdge = currentEdges.splice(currentBesEdgeIndex, 1)[0];
  console.log(currentBestEdge.from.x + ',' + currentBestEdge.from.y, '->', currentBestEdge.target.x + ',' + currentBestEdge.target.y, 'with', currentBestEdge.currentHeat);
  renderMap(map, currentBestEdge.path);
  currentEdges.push(...getPossibleNextEdges(map, currentBestEdge));
} while (currentEdges.length > 0 && (currentBestEdge.target.x !== map[0].length - 1 || currentBestEdge.target.y !== map.length - 1))

renderPath(currentBestEdge.path);
console.log('Heat:', currentBestEdge.currentHeat);
