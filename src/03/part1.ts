import * as fs from 'fs';

export function main() {
    const inputFile = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

    let total = 0;
    
    // Split on empty line
    inputFile.split(/\r?\n/).forEach((line, idx) => {
        const cpt1 = line.slice(0, line.length / 2).split("");
        const cpt2 = line.slice(line.length / 2).split("");

        const common = cpt1.filter((i) => cpt2.includes(i));
        const value = getValue(common);
        total += value;

        // console.log(`1: ${cpt1}, 2: ${cpt2}, ${common}/${value}`);
    });

    console.log(`Day 3, Part 1: ${total}`);
}

function getValue(items: string[]): number {
    const item = items[0];

    if (item === item.toLowerCase()) {
        return item.charCodeAt(0) - 96;
    } else {
        return item.charCodeAt(0) - 64 + 26; 
    }
}

main();
