import { Unown } from '../../util/unown';

export function main(input: string = `${__dirname}/input.txt`) {    
    const allNumbers = Unown.parseInput<number[]>(input, 
        { 
            splitter: [/\r?\n\r?\n/, /\r?\n/], 
            output: "number" 
        }).map((numbers) => numbers.reduce((a, b) => a + b));

    allNumbers.sort((a,b) => a - b)

    const top3 = allNumbers.slice(-3);
    
    // console.log(`Day 1, Part 2: ${top3.reduce((total, val) => total + val)}`);
    return top3.reduce((total, val) => total + val);
}

// main();
