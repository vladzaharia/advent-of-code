import { Unown } from '../../util/unown';

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    const lines = Unown.parseInput(/\r?\n/);

    // Do something with inputFile here

    if (verbose) {
        console.log("PART1: Log something important happening, but only when verbose");
    }

    // Return the value
    return 0;
}
