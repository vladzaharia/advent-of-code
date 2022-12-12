import { Unown } from "../../util/unown";

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    const lines = Unown.parseInput(input);

    let total = 0;

    // X register, starts at 1
    let regX = 1;

    // In the middle of an `addx` which takes 2 cycles
    let midAdd: number | false = false;

    // Go through cycles
    for (let i = 1; i <= 221; i++) {
        if ([20, 60, 100, 140, 180, 220].includes(i)) {
            total += regX * i;
        }

        if (midAdd) {
            regX += midAdd;
            midAdd = false;
        } else {
            // Grab a line, parse it, and run an op
            const line = lines.splice(0, 1)[0];
            if (line !== "noop") {
                midAdd = parseInt(line.split(" ")[1], 10);
            }
        }
    }

    // Return the value
    return total;
}
