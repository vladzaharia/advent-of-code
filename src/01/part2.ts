import * as fs from 'fs';

export function main() {
    const inputFile = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

    let allNumbers: number[] = [];
    
    // Split on two empty lines
    inputFile.split(/\r?\n\r?\n/).forEach((lineGroup, idx) => {
        let total = 0;
        lineGroup.split(/\r?\n/).forEach(line => {
            total += parseInt(line, 10);
        });

        allNumbers.push(total);
    
        // console.log(`${idx}: ${total}`);
    });

    allNumbers.sort((a,b) => a - b)

    const top3 = allNumbers.slice(-3);
    
    console.log(`Day 1, Part 2: ${top3.reduce((total, val) => total + val)}`);
}

main();
