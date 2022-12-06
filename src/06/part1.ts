import * as fs from 'fs';

export function main() {
    const inputFile = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

    let lastLetters: string[] = [];

    for (let i = 0; i < inputFile.length; i++) {
        const letter = inputFile[i];
        lastLetters.push(letter);

        if (lastLetters.length > 4) {
            lastLetters = lastLetters.slice(1);
        }

        if (lastLetters.length === 4 && lastLetters.every((l, idx) => lastLetters.indexOf(l) === idx)) {
            // console.log(`Day 6, Part 1: ${i+1}`);
            return i+1;
        }
    }
    console.error(`No start sequence found.`);
    return -1;
}

// main();
