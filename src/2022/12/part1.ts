import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const grid = Unown.parseInput<string[]>({ splitter: [ Unown.ONE_LINE, "" ] });
    
    const start = findPoint(grid, "S")!;
    const end = findPoint(grid, "E")!;

    return findRoute(grid, start, end, 0, []);
}

interface Coordinates {
    i: number;
    j: number;
}

function findPoint(grid: string[][], point: string): Coordinates | undefined {
    for (let i = 0; i < grid.length; i++) {
        const line = grid[i];

        for (let j = 0; j < grid[0].length; j++) {
            const t = line[j];
            if (t === point) {
                Missingno.log(`findPoint: ${point} found at ${i},${j}`);

                return {i, j};
            }
        }
    }
}

function findRoute(grid: string[][], coord: Coordinates, end: Coordinates, acc: number, visited: Coordinates[]): number {
    Missingno.log(`${coord.i},${coord.j}: route ${JSON.stringify(visited)}`);

    if (coord.i === end.i && coord.j === end.j) {
        Missingno.log(`findRoute: reached ${end.i},${end.j}`);

        // Reached the end
        return acc;
    } else {
        const currVal = getValue(grid, coord)!.value;
        const dirVals = getNextValues(grid, coord);
        Missingno.log(`findRoute: all ${JSON.stringify(Object.values(dirVals))}`);

        const availRoutes = Object.values(dirVals).filter((item) => !!item && item.value <= currVal + 1 && !visited.some((v) => v.i === item!.coord.i && v.j === item!.coord.j));
        Missingno.log(`findRoute: available ${JSON.stringify(availRoutes)}`);

        if (availRoutes.length === 0) {
            return Infinity;
        }

        const routeValues = availRoutes.map((item) => findRoute(grid, item!.coord, end, acc + 1, [...visited, coord]));

        return Math.min(... routeValues);
    }
}

function getNextValues(grid: string[][], { i, j }: Coordinates) {
    return {
        "N": getValue(grid, { i: i - 1, j }),
        "S": getValue(grid, { i: i + 1, j }),
        "W": getValue(grid, { i, j: j - 1 }),
        "E": getValue(grid, { i, j: j + 1 })
    }
}

function getValue(grid: string[][], coord: Coordinates) {
    Missingno.log(`getValue: ${coord.i},${coord.j} (max ${grid.length},${grid[0].length})`);

    if (coord.i < 0 || coord.i >= grid.length - 1 || coord.j < 0 || coord.j >= grid[0].length - 1) {
        return undefined;
    }

    let strVal = grid[coord.i][coord.j];
    let newVal = strVal;

    if (strVal === "S") {
        newVal = "a";
    } else if (strVal === "E") {
        newVal = "z";
    }

    const value = newVal.charCodeAt(0) - "a".charCodeAt(0);
    Missingno.log(`${coord.i},${coord.j} => ${strVal} ${value}`);

    return { coord, value };
}