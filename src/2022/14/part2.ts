import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const rocks = Unown.parseInput(__filename).flatMap(generateRocks);

    const lowestRockHeight = Math.max(... rocks.map((r) => r.i));

    // const floor: Coordinates[] = [... Array(1000)].map((_, j) => { return { i: lowestRockHeight + 2, j }})

    const sandStart: Coordinates = { i: 0, j: 500 };

    return simulateSand(sandStart, [... rocks], lowestRockHeight) + 1;
}

function simulateSand(sandStart: Coordinates, rocks: Coordinates[], lowestRockHeight: number): number {
    Missingno.log(`simulateSand: sandStart ${sandStart.i, sandStart.j}, impediments: ${JSON.stringify(rocks)}`)

    let result = 0;
    const impediments = [... rocks];
    
    while (true) {
        const sand = moveSand(sandStart, impediments, lowestRockHeight);

        if (sand.i === sandStart.i && sand.j === sandStart.j) {
            return result;
        }

        impediments.push(sand);
        result++;
    }
}

function moveSand(start: Coordinates, impediments: Coordinates[], lowestRockHeight: number) {
    Missingno.log(`moveSand: start`);
    let currCoord: Coordinates = { i: start.i, j: start.j };

    while (true) {
        const {i, j} = currCoord;

        if (!impediments.some((c) => c.i === i + 1 && c.j === j)) {
            // try to move down
            currCoord = { i: i + 1, j };
            Missingno.log(`moved down to ${currCoord.i},${currCoord.j}`);
        } else if (!impediments.some((c) => c.i === i + 1 && c.j === j - 1)) {
            // try to move down-left
            currCoord = { i: i + 1, j: j - 1 };
            Missingno.log(`moved down-left to ${currCoord.i},${currCoord.j}`);
        } else if (!impediments.some((c) => c.i === i + 1 && c.j === j + 1)) {
            // try to move down-right
            currCoord = { i: i + 1, j: j + 1 };
            Missingno.log(`moved down-right to ${currCoord.i},${currCoord.j}`);
        } else {
            // can't move anymore
            Missingno.log(`rested at ${currCoord.i},${currCoord.j}`);
            return currCoord;
        }

        // fallen past lowest rock, return current position
        if (currCoord.i >= lowestRockHeight + 1) {
            Missingno.log(`fallen past lowest rock (${lowestRockHeight}) at ${currCoord.i},${currCoord.j}`);
            return currCoord;
        }
    }
}

interface Coordinates {
    i: number;
    j: number;
}

function generateRocks(line: string): Coordinates[] {
    Missingno.log(`generateRocks: ${line}`);

    const result: Coordinates[] = [];
    const coords = line.split(" -> ");

    const getCoords = (coordStrings: string[]) => {
        Missingno.log(`getCoords: ${coordStrings}`);

        return {
            i: parseInt(coordStrings[1], 10),
            j: parseInt(coordStrings[0], 10)
        }
    } 

    for (let x = 0; x < coords.length - 1; x++) {
        const currCoord = getCoords(coords[x].split(","));
        const nextCoord = getCoords(coords[x+1].split(","));

        Missingno.log(`mapping: ${currCoord.i},${currCoord.j} => ${nextCoord.i},${nextCoord.j}`);

        if (nextCoord.i > currCoord.i) {
            for (let i = currCoord.i; i <= nextCoord.i; i++) {
                Missingno.log(`adding ${i},${currCoord.j}`);

                result.push({ i, j: currCoord.j });
            }
        } else if (nextCoord.i < currCoord.i) {
            for (let i = nextCoord.i; i <= currCoord.i; i++) {
                Missingno.log(`adding ${i},${currCoord.j}`);

                result.push({ i, j: currCoord.j });
            }
        }
        
        if (nextCoord.j > currCoord.j) {
            for (let j = currCoord.j; j <= nextCoord.j; j++) {
                Missingno.log(`adding ${currCoord.i},${j}`);

                result.push({ i: currCoord.i, j });
            }
        } else if (nextCoord.j < currCoord.j) {
            for (let j = nextCoord.j; j <= currCoord.j; j++) {
                Missingno.log(`adding ${currCoord.i},${j}`);

                result.push({ i: currCoord.i, j });
            }
        }
    }
    
    return result;
}

function generateGrid(rocks: Coordinates[]): string[][] {
    Missingno.log(`generateGrid: ${JSON.stringify(rocks)}`);

    const grid = [... Array(1000)].map((_) => Array(1000).fill(" "));
    Missingno.log(`${grid.length}x${grid[0].length} grid`);

    for(const rockCoords of rocks) {
        Missingno.log(`adding rock to: ${rockCoords.i},${rockCoords.j}`);
        grid[rockCoords.i][rockCoords.j] = "#";
    }

    return grid;
}