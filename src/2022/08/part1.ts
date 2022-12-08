import * as fs from 'fs';

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    const inputFile = fs.readFileSync(input, 'utf-8');
    const lines = inputFile.split(/\r?\n/);

    const grid = lines.map((l) => l.split("").map((d) => parseInt(d, 10)));

    let visibleTrees = 0;

    for (let i = 0; i < grid.length; i++) {
        const line = grid[i];

mainLoop:
        for (let j = 0; j < line.length; j++) {
            const tree = line[j];

            let visible = false;

            // Edge trees are always visible
            if (i === 0 || j === 0 || i === grid.length - 1 || j === line.length - 1) {
                if (verbose) {
                    console.log(`${i},${j}: edge`);
                }

                visibleTrees++;
                continue mainLoop;
            }

            // Determine if there's any trees north of here
            let trees: number[] = [];
            for (let i1 = 0; i1 < i; i1++) {
                trees.push(grid[i1][j]);
            }
            if (trees.every((t) => t < tree)) {
                if (verbose) {
                    console.log(`${i},${j}: N VISIBLE [${trees}] < ${tree}`);
                }

                visibleTrees++;
                continue mainLoop;
            } else {
                if (verbose) {
                    console.log(`${i},${j}: N [${trees}] > ${tree}`);
                }
            }

            // Determine if there's any trees south of here
            trees = [];
            for (let i1 = i + 1; i1 < grid.length; i1++) {
                trees.push(grid[i1][j]);
            }
            if (trees.every((t) => t < tree)) {
                if (verbose) {
                    console.log(`${i},${j}: S VISIBLE [${trees}] < ${tree}`);
                }

                visibleTrees++;
                continue mainLoop;
            } else {
                if (verbose) {
                    console.log(`${i},${j}: S [${trees}] > ${tree}`);
                }
            }

            // Determine if there's any trees east of here
            trees = [];
            for (let j1 = 0; j1 < j; j1++) {
                trees.push(grid[i][j1]);
            }
            if (trees.every((t) => t < tree)) {
                if (verbose) {
                    console.log(`${i},${j}: E VISIBLE [${trees}] < ${tree}`);
                }

                visibleTrees++;
                continue mainLoop;
            } else {
                if (verbose) {
                    console.log(`${i},${j}: E [${trees}] > ${tree}`);
                }
            }

            // Determine if there's any trees west of here
            trees = [];
            for (let j1 = j + 1; j1 < line.length; j1++) {
                trees.push(grid[i][j1]);
            }
            if (trees.every((t) => t < tree)) {
                if (verbose) {
                    console.log(`${i},${j}: W VISIBLE [${trees}] < ${tree}`);
                }

                visibleTrees++;
            } else {
                if (verbose) {
                    console.log(`${i},${j}: W [${trees}] > ${tree}`);
                }
            }
        }
    }

    // Return the value
    return visibleTrees;
}
