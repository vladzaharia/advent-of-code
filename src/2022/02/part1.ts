import { Unown } from '../../util/unown';

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {    
    return Unown.parseInput(input, { 
        parser: (line) => calculateScore(line[0] as OpponentMove, line[2] as YourMove) 
    }).reduce((a, b) => a + b);
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
