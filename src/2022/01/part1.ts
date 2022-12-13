import { Unown } from '../../util/unown';

export function main() {
    let max = 0;
    
    // Split on two empty lines
    Unown.parseInput<number[]>(__filename, 
        { 
            splitter: [Unown.TWO_LINES, Unown.ONE_LINE], 
            output: "number" 
        }).forEach((numbers, idx) => {
        let total = numbers.reduce((a, b) => a + b);
    
        if (total > max) {
            max = total;
        }
    
        // console.log(`${idx}: ${total}`);
    });
    
    // console.log(`Day 1, Part 1: ${max}`);
    return max;
}

// main();
