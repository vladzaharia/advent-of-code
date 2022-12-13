import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const pairs = Unown.parseInput({ splitter: Unown.TWO_LINES, parser: createPair });

    return pairs.map((pair, i) => checkOrder(pair[0], pair[1]) === 1 ? i + 1 : 0).reduce((a, b) => a + b);
}

type Line = (number | number[])[];
function createPair(linesStr: string): Line[] {
    const lines = linesStr.split(Unown.ONE_LINE);

    return [JSON.parse(lines[0]), JSON.parse(lines[1])];
}

function checkOrder(left: Line | number, right: Line | number): number {
    Missingno.log(`checkOrder: left ${JSON.stringify(left)}, right ${JSON.stringify(right)}`);

    if (Array.isArray(left) && Array.isArray(right)) {
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
            const leftItem = left[i];
            const rightItem = right[i];

            if (leftItem === undefined && rightItem !== undefined) {
                Missingno.log("Left ran out, returning 1")
                return 1;
            } else if (rightItem === undefined && leftItem !== undefined) {
                Missingno.log("Right ran out, returning -1")
                return -1;
            }

            const result = checkOrder(leftItem, rightItem);

            if (result != 0) {
                return result;
            } 
        }
    } else if (Array.isArray(left) && !Array.isArray(right)) {
        // left is array, right is number
        Missingno.log(`Checking ${JSON.stringify(left)} vs ${JSON.stringify([right])}`)
        return checkOrder(left, [right]);
    } else if (Array.isArray(right) && !Array.isArray(left)) {
        // right is array, left is number
        Missingno.log(`Checking ${JSON.stringify([left])} vs ${JSON.stringify(right)}`)
        return checkOrder([left], right);
    } else if (!Array.isArray(left) && !Array.isArray(right)) {
        if (left === undefined) {
            return -1;
        } else if (right === undefined) {
            return -1;
        }

        // both are numbers
        if (left < right) {
            Missingno.log(`${left} < ${right}, returning 1`);
            return 1;
        } else if (left > right) {
            Missingno.log(`${left} > ${right}, returning -1`);
            return -1;
        }
    }

    // Not in the right order
    return 0;
}