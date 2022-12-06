import * as fs from 'fs';

export function main() {
    const inputFile = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

    let total = 0;
    
    // Split on empty line
    inputFile.split(/\r?\n/).forEach((line, idx) => {
        const val = calculateScore(line[0] as OpponentMove, line[2] as YourMove);
        total += val;
    
        // console.log(`${idx}: ${val}`);
    });
    
    // console.log(`Day 2, Part 1: ${total}`);
    return total;
}

//                   R  |  P  |  S
type OpponentMove = "A" | "B" | "C";
type YourMove     = "X" | "Y" | "Z";

function calculateScore(oppMove: OpponentMove, yourMove: YourMove): number {
    return calculateMoveScore(yourMove) + calculateWinScore(oppMove, yourMove);
}

function calculateMoveScore(yourMove: YourMove): number {
    switch (yourMove) {
        case "X":
            return 1;
        case "Y":
            return 2;
        case "Z":
            return 3;
    }
}

function calculateWinScore(oppMove: OpponentMove, yourMove: YourMove): number {
    if ((oppMove == "A" && yourMove == "X") ||
        (oppMove == "B" && yourMove == "Y") ||
        (oppMove == "C" && yourMove == "Z")) {
        // Draw, 3 points
        return 3;
    } else if ((oppMove == "A" && yourMove == "Z") ||
               (oppMove == "B" && yourMove == "X") ||
               (oppMove == "C" && yourMove == "Y")) {
        // Loss, 0 points
        return 0;
    }
    
    // Otherwise, won so 6 points
    return 6;
}

// main();
