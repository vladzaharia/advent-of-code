import * as fs from 'fs';

export function main() {
    const inputFile = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

    let total = 0;
    
    // Split on empty line
    inputFile.split(/\r?\n/).forEach((line, idx) => {
        const assignments = line.split(",");

        const firstAssingment = getAssignmentList(assignments[0]);
        const secondAssignment = getAssignmentList(assignments[1]);

        if (firstAssingment.some((v) => secondAssignment.includes(v)) || secondAssignment.some((v) => firstAssingment.includes(v))) {
            total++;
        }
    });

    console.log(`Day 4, Part 2: ${total}`);
}

function getAssignmentList(assignment: string): number[] {
    const range = assignment.split("-");
    const start: number = parseInt(range[0], 10);
    const end: number = parseInt(range[1], 10);
    const arr: number[] = [];

    for(let i = start; i <= end; i++) {
        arr.push(i);
    }

    return arr;
}

main();
