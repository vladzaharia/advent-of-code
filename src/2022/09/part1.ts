import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const instructions = Unown.parseInput(__filename, { parser: parseLine });

    // Generate a nxn grid
    const gridSize = 1000;
    const grid = [...Array<number[]>(gridSize)].map(_e => Array<number>(gridSize).fill(0));

    let headCoords: Coordinates = { i: Math.ceil(grid.length / 2), j: Math.ceil(grid.length / 2) };
    let tailCoords: Coordinates = { i: Math.ceil(grid.length / 2), j: Math.ceil(grid.length / 2) };

    Missingno.log(`Starting at head ${headCoords.i},${headCoords.j}, tail ${tailCoords.i},${tailCoords.j}`);

    // mark grid of start position
    markGrid(grid, tailCoords);

    instructions.forEach((instruction, idx) => {
        Missingno.log(`${idx}: instruction ${JSON.stringify(instruction)}, head ${headCoords.i},${headCoords.j}, tail ${tailCoords.i},${tailCoords.j}`);

        for (let i = 0; i < instruction.distance; i++) {
            headCoords = moveHead(headCoords, instruction.direction);
            tailCoords = moveTail(tailCoords, headCoords);
            markGrid(grid, tailCoords);

            Missingno.log(`${idx}: Moved head to ${headCoords.i},${headCoords.j}, tail to ${tailCoords.i},${tailCoords.j}`);
        }
    });

    // Return the value
    return grid.flatMap((l) => l.filter((i) => i > 0)).length;
}

type Direction = "U" | "D" | "L" | "R";
interface Coordinates {
    /** Row */
    i: number;

    /** Column */
    j: number;
}

interface Instruction {
    direction: Direction;
    distance: number;
}

function parseLine(line: string): Instruction {
    const splitLine = line.split(" ");

    return {
        direction: splitLine[0] as Direction,
        distance: parseInt(splitLine[1], 10)
    };
}

function moveHead({ i, j }: Coordinates, direction: Direction): Coordinates {
    Missingno.log(`moveHead: head ${i},${j}, direction ${direction}`);

    switch (direction) {
        case "U":
            return {
                i: i - 1,
                j
            };
        case "D":
            return {
                i: i + 1,
                j
            };
        case "L":
            return {
                i,
                j: j - 1
            };
        case "R":
            return {
                i,
                j: j + 1
            };
    }
}

function moveTail(tailCoords: Coordinates, headCoords: Coordinates): Coordinates {
    Missingno.log(`moveTail: tail ${JSON.stringify(tailCoords)}, head ${JSON.stringify(headCoords)}`);

    const tempCoords = Object.assign({}, tailCoords);

    let iDiff = headCoords.i - tailCoords.i;
    let jDiff = headCoords.j - tailCoords.j;

    if (Math.abs(iDiff) > 1 || Math.abs(jDiff) > 1) {
        if (iDiff > 0) {
            tempCoords.i++;
        } else if (iDiff < 0) {
            tempCoords.i--;
        }

        if (jDiff > 0) {
            tempCoords.j++;
        } else if (jDiff < 0) {
            tempCoords.j--;
        }

        Missingno.log(`moveTail: moved tail to ${JSON.stringify(tempCoords)}`);
    }

    return tempCoords;
}

function markGrid(grid: number[][], {i,j}: Coordinates) {
    grid[i][j] = grid[i][j] + 1;

    Missingno.log(`markGrid: set ${i},${j} to ${grid[i][j]}`);
}
