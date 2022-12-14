import { Unown } from '../../util/unown';

export function main() {    
    const allNumbers = Unown.parseInput<number[]>(__filename, 
        { 
            splitter: [Unown.TWO_LINES, Unown.ONE_LINE], 
            output: "number" 
        }).map((numbers) => numbers.reduce((a, b) => a + b));

    allNumbers.sort((a,b) => a - b)

    const top3 = allNumbers.slice(-3);
    
    // console.log(`Day 1, Part 2: ${top3.reduce((total, val) => total + val)}`);
    return top3.reduce((total, val) => total + val);
}

// main();
