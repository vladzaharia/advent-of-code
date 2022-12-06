import * as fs from 'fs';

export function main() {
    const inputFile = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

    let lastLetters: string[] = [];

    for (let i = 0; i < inputFile.length; i++) {
        const letter = inputFile[i];
        lastLetters.push(letter);

        if (lastLetters.length > 14) {
            lastLetters = lastLetters.slice(1);
        }

        if (lastLetters.length === 14 && lastLetters.every((l, idx) => lastLetters.indexOf(l) === idx)) {
            console.log(`Day 6, Part 2: ${i+1}: ${lastLetters}`);
            return i+1;
        }
    }
    console.error(`No message sequence found.`);
    return -1;
}

main();
