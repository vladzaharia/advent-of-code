import * as fs from 'fs';
import { Unown } from '../../util/unown';

export function main() {
    return Unown.parseInput<number>({
        parser: (line) => {
                const assignments = line.split(",");

                const firstAssingment = getAssignmentList(assignments[0]);
                const secondAssignment = getAssignmentList(assignments[1]);

                if (firstAssingment.some((v) => secondAssignment.includes(v)) || secondAssignment.every((v) => firstAssingment.includes(v))) {
                    return 1;
                }

                return 0;
            }
        }).reduce((a, b) => a + b);
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

// main();
