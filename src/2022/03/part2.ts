import { Unown } from '../../util/unown';

export function main() {
    let total = 0;
    
    // Split on empty lines
    const lines = Unown.parseInput<string[]>(__filename, { splitter: [Unown.ONE_LINE, ""] });

    for (let i = 0; i < lines.length; i+=3) {
        const grp1 = lines[i+0];
        const grp2 = lines[i+1];
        const grp3 = lines[i+2];

        const common = grp1.filter((i) => grp2.includes(i) && grp3.includes(i));
        const value = getValue(common);
        total += value;

        // console.log(`1: ${grp1}, 2: ${grp2}, 3: ${grp3}, ${common}/${value}`);
    }

    // console.log(`Day 3, Part 2: ${total}`);
    return total;
}

function getValue(items: string[]): number {
    const item = items[0];

    if (item === item.toLowerCase()) {
        return item.charCodeAt(0) - 96;
    } else {
        return item.charCodeAt(0) - 64 + 26; 
    }
}

// main();
