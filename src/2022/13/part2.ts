import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const packets = Unown.parseInput().filter((l) => l !== "").map((l) => JSON.parse(l));

    // Add additional packets
    packets.push([[2]]);
    packets.push([[6]]);

    packets.sort((a, b) => checkOrder(b, a));

    return packets.map((p, i) => isSpecialPacket(p) ? i + 1 : 0).filter((n) => n > 0).reduce((a, b) => a * b);
}

function isSpecialPacket(p: Line) {
    const p0Line = (p[0] as Line);

    return p.length === 1 && p0Line.length === 1 && (p0Line[0] === 2 || p0Line[0] === 6);
}

type Line = (number | number[])[];

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
        // both are numbers
        if (left < right) {
            Missingno.log(`${left} < ${right}, returning 1`);
            return 1;
        } else if (left > right) {
            Missingno.log(`${left} > ${right}, returning -1`);
            return -1;
        }
    }

    return 0;
}