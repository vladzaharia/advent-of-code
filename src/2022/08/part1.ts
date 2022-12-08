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
            for (let i1 = 0; i1 < i; i1++) {
                if (grid[i1][j] >= tree) {
                    if (verbose) {
                        console.log(`${i},${j}: invisible ${i1},${j} ${grid[i1][j]} > ${tree}`);
                    }
                } else {
                    if (verbose) {
                        console.log(`${i},${j}: visible ${i1},${j} ${grid[i1][j]} < ${tree}`);
                    }

                    visible = true;
                    break;
                }
            }

            // Determine if there's any trees south of here
            for (let i1 = i + 1; i1 < grid.length; i1++) {
                if (grid[i1][j] >= tree) {
                    if (verbose) {
                        console.log(`${i},${j}: invisible ${i1},${j} ${grid[i1][j]} > ${tree}`);
                    }
                } else {
                    if (verbose) {
                        console.log(`${i},${j}: visible ${i1},${j} ${grid[i1][j]} < ${tree}`);
                    }
                    visible = true;
                    break;
                }
            }

            // Determine if there's any trees east of here
            for (let j1 = 0; j1 < j; j1++) {
                if (grid[i][j1] >= tree) {
                    if (verbose) {
                        console.log(`${i},${j}: invisible ${i},${j1} ${grid[i][j1]} > ${tree}`);
                    }
                } else {
                    if (verbose) {
                        console.log(`${i},${j}: visible ${i},${j1} ${grid[i][j1]} < ${tree}`);
                    }

                    visible = true;
                    break;
                }
            }

            // Determine if there's any trees west of here
            for (let j1 = j + 1; j1 < line.length; j1++) {
                if (grid[i][j1] >= tree) {
                    if (verbose) {
                        console.log(`${i},${j}: invisible ${i},${j1} ${grid[i][j1]} > ${tree}`);
                    }
                } else {
                    if (verbose) {
                        console.log(`${i},${j}: visible ${i},${j1} ${grid[i][j1]} < ${tree}`);
                    }

                    visible = true;
                    break;
                }
            }
        }
    }

    // Return the value
    return visibleTrees;
}
