import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const monkeys = Unown.parseInput<string[]>(__filename, { 
        splitter: [Unown.TWO_LINES, Unown.ONE_LINE], 
    }).map((monkeyLines) => createMonkey(monkeyLines));

    const results = Array<number>(monkeys.length).fill(0);

    for (let i = 1; i <= 20; i++) {
        for (let m = 0; m < monkeys.length; m++) {
            processMonkeyMove(monkeys, results, m, i);
        }
    }

    // Return the value
    return results.sort((a, b) => b-a).slice(0, 2).reduce((a, b) => a * b);
}

interface Monkey {
    items: number[];
    operation: (old: number) => number;
    test: (t: number) => boolean;
    trueMonkey: number;
    falseMonkey: number;
}

function createMonkey(lines: string[]): Monkey {
    // Starting items: 79, 98
    const itemLine = lines[1];
    const items = itemLine.split(": ")[1].split(", ").map((i) => parseInt(i, 10));
    Missingno.log(`createMonkey: items ${items}`);

    // Operation: new = old * 19
    const operation = parseOperation(lines[2]);

    // Test: divisible by 23
    const testDivisor = parseInt(lines[3].split(" by ")[1], 10);
    const test = (t: number) => t % testDivisor === 0;
    Missingno.log(`createMonkey: test (t % ${testDivisor}) === 0`);

    // If true: throw to monkey 2
    const trueMonkey = parseInt(lines[4].split(" monkey ")[1], 10);

    // If false: throw to monkey 3
    const falseMonkey = parseInt(lines[5].split(" monkey ")[1], 10);
    Missingno.log(`createMonkey: if true ${trueMonkey}, if false ${falseMonkey}`);

    return {
        items,
        operation,
        test,
        trueMonkey,
        falseMonkey
    }
}

type ItemOperations = "*" | "+";
type ItemParam = "old" | number;

function parseOperation(line: string): (old: number) => number {
    // Operation: new = old * 19
    // Operation: new = old * old
    // Operation: new = old + 6

    const operationLine = line.split("old ")[1].split(" ");
    const op: ItemOperations = operationLine[0] as ItemOperations;
    const paramString = operationLine[1];
    const param: ItemParam = paramString !== "old" ? parseInt(paramString, 10) : paramString;
    
    Missingno.log(`parseOperation: new = old ${op} ${param}`);

    switch(op) {
        case "+":
            return (old: number) => param === "old" ? old + old : old + param;
        case "*":
            return (old: number) => param === "old" ? old * old : old * param;
    }
}

function processMonkeyMove(monkeys: Monkey[], results: number[], m: number, i: number) {
    const monkey = monkeys[m];

    for (let item of monkey.items) {
        results[m]++;
        Missingno.log(`Round ${i}, item ${item}`);
        
        // Monkey inspects item
        item = monkey.operation(item);
        Missingno.log(`Round ${i}, inspected ${item}`);

        // Relief
        item = Math.floor(item / 3);
        Missingno.log(`Round ${i}, relief ${item}`);

        // Monkey tests
        const testResult = monkey.test(item);
        Missingno.log(`Round ${i}, test result ${item}`);

        // Monkey throws
        if (testResult) {
            monkeys[monkey.trueMonkey].items.push(item);
            Missingno.log(`Round ${i}, throwing ${item} to ${monkey.trueMonkey}`);
        } else {
            monkeys[monkey.falseMonkey].items.push(item);
            Missingno.log(`Round ${i}, throwing ${item} to ${monkey.falseMonkey}`);
        }
    }

    // Thrown away all items
    monkey.items = [];
}
