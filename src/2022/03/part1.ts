import { Unown } from '../../util/unown';

export function main() {    
    return Unown.parseInput(__filename, { parser: parseLine }).reduce((a, b) => a + b);
}

function parseLine(line: string) {
    const cpt1 = line.slice(0, line.length / 2).split("");
    const cpt2 = line.slice(line.length / 2).split("");

    const common = cpt1.filter((i) => cpt2.includes(i));
    return getValue(common);

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
