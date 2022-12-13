import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const grid = Unown.parseInput<number[]>({ splitter: [Unown.ONE_LINE, ""], output: "number" });

    const distances = grid.flatMap((lines, i) => lines.map((_line, j) => getTreeScore(grid, i, j)));

    // Return the value
    return Math.max(... distances);
}

function getTreeScore(grid: number[][], i: number, j: number): number {
    const treeVal = grid[i][j];

    // Edge trees always have 0 (one side will always be 0 in a multiplication)
    if (i === 0 || j === 0 || i === grid.length - 1 || j === grid[0].length - 1) {
        Missingno.log(`${i},${j}: edge (0)`);
        return 0;
    }

    // Calculate tree value to the north
    let nVal = 0;
    for (let i1 = i - 1; i1 >= 0; i1--) {
        nVal++;
        
        if (grid[i1][j] >= treeVal) {
            // Reached higher tree, we're done
            break;
        }
    }

    // Calculate tree value to the south
    let sVal = 0;
    for (let i1 = i + 1; i1 < grid.length; i1++) {
        sVal++;

        if (grid[i1][j] >= treeVal) {
            // Reached higher tree, we're done
            break;
        }
    }

    // Calculate tree value to the east
    let eVal = 0;
    for (let j1 = j - 1; j1 >= 0; j1--) {
        eVal++;

        if (grid[i][j1] >= treeVal) {
            // Reached higher tree, we're done
            break;
        }
    }

    // Calculate tree value to the east
    let wVal = 0;
    for (let j1 = j + 1; j1 < grid[0].length; j1++) {
        wVal++;

        if (grid[i][j1] >= treeVal) {
            // Reached higher tree, we're done
            break;
        }
    }

    Missingno.log(`${i},${j}: ${nVal} * ${sVal} * ${eVal} * ${wVal}`);
    return nVal * sVal * eVal * wVal;
}
