import { Unown } from '../../util/unown';

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    const instructions = Unown.parseInput(input, { parser: parseLine });

    // Generate a nxn grid
    const gridSize = 1000;
    const grid = [...Array<number[]>(gridSize)].map(_e => Array<number>(gridSize).fill(0));

    let headCoords: Coordinates = { i: Math.ceil(grid.length / 2), j: Math.ceil(grid.length / 2) };
    let tailCoords: Coordinates[] = Array<Coordinates>(9).fill({ i: Math.ceil(grid.length / 2), j: Math.ceil(grid.length / 2) });

    if (verbose) {
        console.log(`Starting at head ${headCoords.i},${headCoords.j}, tails ${JSON.stringify(tailCoords)}`);
    }

    // mark grid of start position
    markGrid(grid, tailCoords[0]);

    instructions.forEach((instruction, idx) => {
        if (verbose) {
            console.log(`${idx}: instruction ${JSON.stringify(instruction)}, head ${headCoords.i},${headCoords.j}, tails ${JSON.stringify(tailCoords)}`);
        }

        for (let i = 0; i < instruction.distance; i++) {
            headCoords = moveHead(headCoords, instruction.direction, verbose);
            if (verbose) {
                console.log(`moveHead: moved head to ${JSON.stringify(headCoords)}`);
            }

            tailCoords = moveTails(tailCoords, headCoords, verbose);
            markGrid(grid, tailCoords[tailCoords.length - 1], verbose);
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

function moveHead({ i, j }: Coordinates, direction: Direction, verbose = false): Coordinates {
    if (verbose) {
        console.log(`moveHead: head ${i},${j}, direction ${direction}`);
    }

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

function moveTails(tailCoordsArray: Coordinates[], headCoords: Coordinates, verbose = false): Coordinates[] {
    const result: Coordinates[] = [];
    
    for (let i = 0; i < tailCoordsArray.length; i++) {
        const tailCoords = moveTail(tailCoordsArray[i], headCoords, verbose);

        result.push(tailCoords);
        headCoords = tailCoords;
    }

    return result;
}

function moveTail(tailCoords: Coordinates, headCoords: Coordinates, verbose = false): Coordinates {
    if (verbose) {
        console.log(`moveTail: tail ${JSON.stringify(tailCoords)}, head ${JSON.stringify(headCoords)}`);
    }

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

        if (verbose) {
            console.log(`moveTail: moved tail to ${JSON.stringify(tempCoords)}`);
        }
    }

    return tempCoords;
}

function markGrid(grid: number[][], {i,j}: Coordinates, verbose = false) {
    grid[i][j] = grid[i][j] + 1;

    if (verbose) {
        console.log(`markGrid: set ${i},${j} to ${grid[i][j]}`);
    }
}
