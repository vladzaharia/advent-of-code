import { Unown } from "../../util/unown";

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    let total = 0;
    
    // Split on 2 empty lines
    const fileParts = Unown.parseInput(input, { splitter: /\r?\n\r?\n/ });

    const stackLines = fileParts[0].split(/\r?\n/).slice(0,-1);
    const stacks = parseStacks(stackLines);

    const instructionLines = fileParts[1].split(/\r?\n/);
    runInstructions(stacks, instructionLines);
    
    // console.log(`Day 5, Part 1: ${stacks.map((s) => s[0]).join("")}`);
    return stacks.map((s) => s[0]).join("");
}

function parseStacks(lines: string[]): string[][] {
    const stacks: string[][] = [];

    lines.forEach((line) => {
        for (let i = 0; i < line.length; i += 4) {
            if (line[i] === "") {
                // empty, skip
            } else if (line[i] === "[") {
                // [X]
                const stack = i / 4;
                if (!stacks[stack] || !stacks[stack].length) {
                    stacks[stack] = [];
                }
                // add the letter to the stack
                stacks[stack].push(line[i+1]);
            }
        }

    });

    return stacks;
}

function runInstructions(stacks: string[][], lines: string[]) {
    // instruction in form move # from S to T
    lines.forEach((line) => {
        const parts = line.split(" ");

        const numToMove = parseInt(parts[1], 10);
        const from = parseInt(parts[3], 10) - 1;
        const to = parseInt(parts[5], 10) - 1;

        for (let i = 0; i < numToMove; i++) {
            const item = stacks[from][0];
            stacks[to] = [item, ...stacks[to]];
            stacks[from] = stacks[from].slice(1);
        }
    });
}

// main();
