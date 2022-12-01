import * as fs from 'fs';

export function main() {
    const inputFile = fs.readFileSync('input.txt', 'utf-8');

    let max = 0;
    
    // Split on two empty lines
    inputFile.split(/\r?\n\r?\n/).forEach((lineGroup, idx) => {
        let total = 0;
        lineGroup.split(/\r?\n/).forEach(line => {
            total += parseInt(line, 10);
        });
    
        if (total > max) {
            max = total;
        }
    
        console.log(`${idx}: ${total}`);
    });
    
    console.log(`Largest calories: ${max}`);
}

main();
