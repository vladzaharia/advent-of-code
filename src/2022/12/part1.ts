import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const grid = Unown.parseInput<string[]>(__filename, { splitter: [ Unown.ONE_LINE, "" ] })
        .map((line, i) => line.map((val, j) => createNode(val, i, j)));
    
    const start = findPoint(grid, "S")!;
    const end = findPoint(grid, "E")!;

    return findRoute(grid, start, end);
}

function createNode(val: string, i: number, j: number): GridNode {
    let newVal = val;
    const isStart = val === "S";

    if (isStart) {
        newVal = "a";
    } else if (val === "E") {
        newVal = "z";
    }

    return {
        i,
        j,
        val,
        elevation: newVal.charCodeAt(0) - "a".charCodeAt(0),
        distance: val === "S" ? 0 : Infinity
    }
}

interface Coordinates {
    i: number;
    j: number;
}

interface GridNode extends Coordinates {
    val: string;
    elevation: number;
    distance: number;
    neighbors?: GridNode[];
}

function findPoint(grid: GridNode[][], point: string): GridNode | undefined {
    for (let i = 0; i < grid.length; i++) {
        const line = grid[i];

        for (let j = 0; j < grid[0].length; j++) {
            const t = line[j];
            if (t.val === point) {
                Missingno.log(`findPoint: ${point} found at ${i},${j}, ${JSON.stringify(grid[i][j])}`);

                return t;
            }
        }
    }
}

function findRoute(grid: GridNode[][], start: GridNode, end: GridNode): number {
    Missingno.log(`findRoute: grid ${JSON.stringify(grid)}`);

    let queue: GridNode[] = [start];
    const visited: GridNode[] = [];

    while (queue.length > 0) {
        queue.sort((a, b) => b.distance - a.distance);

        const node = queue.pop()!;
        visited.push(node);

        Missingno.log(`findRoute: current node ${node.i},${node.j}, queue ${JSON.stringify(queue)}`);

        if (node.i === end.i && node.j === end.j) {
            Missingno.log(`findRoute: reached ${node.i},${node.j}`);
            return node.distance;
        } else {
            const nextNodes = getNextNodes(grid, node);
            Missingno.log(`findRoute: next nodes ${JSON.stringify(nextNodes)}`);
            
            // Only consider unvisited nodes
            const unvisited = nextNodes.filter((n) => !visited.some((v) => v.i === n.i && v.j === n.j));
            Missingno.log(`findRoute: unvisited ${JSON.stringify(unvisited)}, visited ${JSON.stringify(visited)}`);
            
            unvisited.forEach((n) => {
                const neighbor = grid[n.i][n.j];

                // Update neighbor weight
                if (neighbor.distance > (node.distance + 1)) {
                    neighbor.distance = node.distance + 1;
                }

                // Push neighbor into queue
                queue.push(neighbor);
            });
        }

        queue = queue.filter((qn) => !visited.some((v) => v.i === qn.i && v.j === qn.j));
    }

    return -1;
}

function getNextNodes(grid: GridNode[][], node: GridNode): GridNode[] {
    const { i, j } = node;

    return [tryGetNode(grid, node, { i: i - 1, j }),
            tryGetNode(grid, node, { i: i + 1, j }),
            tryGetNode(grid, node, { i, j: j - 1 }),
            tryGetNode(grid, node, { i, j: j + 1 })]
        .filter((v) => v !== undefined) as GridNode[];
}

function tryGetNode(grid: GridNode[][], node: GridNode, nextCoord: Coordinates) {
    Missingno.log(`getValue: ${nextCoord.i},${nextCoord.j} (max ${grid.length}x${grid[0].length})`);

    if (nextCoord.i < 0 || nextCoord.i >= grid.length || nextCoord.j < 0 || nextCoord.j >= grid[0].length) {
        Missingno.log(`${nextCoord.i},${nextCoord.j} is outside bounds`);
        return undefined;
    }

    const nextNode = grid[nextCoord.i][nextCoord.j];

    if (nextNode.elevation > node.elevation + 1) {
        Missingno.log(`${nextCoord.i},${nextCoord.j} is too high (${nextNode.elevation} > ${node.elevation} + 1)`)
        return undefined;
    }

    return nextNode;
}