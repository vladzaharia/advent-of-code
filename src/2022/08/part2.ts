import * as fs from 'fs';

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    const inputFile = fs.readFileSync(input, 'utf-8');
    const lines = inputFile.split(/\r?\n/);

    // Do something with inputFile here

    if (verbose) {
        console.log("Log something important happening, but only when verbose");
    }

    // Return the value
    return 0;
}
