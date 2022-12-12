import * as fs from 'fs';

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    const inputFile = fs.readFileSync(input, 'utf-8');
    const lines = inputFile.split(/\r?\n\r?\n/).map((line) => line.split(/\r?\n/));

    const monkeys = lines.map((monkeyLines) => createMonkey(monkeyLines, verbose));
    const commonDivisor = monkeys.reduce<number>((a, b) => a * b.divisor, 1);
    const results = Array<number>(monkeys.length).fill(0);

    for (let i = 1; i <= 10000; i++) {
        for (let m = 0; m < monkeys.length; m++) {
            processMonkeyMove(monkeys, results, commonDivisor, m, i);
        }
    }

    // Return the value
    return results.sort((a, b) => b-a).slice(0, 2).reduce((a, b) => a * b);
}

interface Monkey {
    items: number[];
    operation: (old: number) => number;
    test: (t: number) => boolean;
    divisor: number;
    trueMonkey: number;
    falseMonkey: number;
}

function createMonkey(lines: string[], verbose = false): Monkey {
    // Starting items: 79, 98
    const itemLine = lines[1];
    const items = itemLine.split(": ")[1].split(", ").map((i) => parseInt(i, 10));

    if (verbose) {
        console.log(`createMonkey: items ${items}`);
    }

    // Operation: new = old * 19
    const operation = parseOperation(lines[2], verbose);

    // Test: divisible by 23
    const divisor = parseInt(lines[3].split(" by ")[1], 10);
    const test = (t: number) => t % divisor === 0;

    if (verbose) {
        console.log(`createMonkey: test (t % ${divisor}) === 0`);
    }    

    // If true: throw to monkey 2
    const trueMonkey = parseInt(lines[4].split(" monkey ")[1], 10);

    // If false: throw to monkey 3
    const falseMonkey = parseInt(lines[5].split(" monkey ")[1], 10);

    if (verbose) {
        console.log(`createMonkey: if true ${trueMonkey}, if false ${falseMonkey}`);
    }

    return {
        items,
        operation,
        test,
        divisor,
        trueMonkey,
        falseMonkey
    }
}

type ItemOperations = "*" | "+";
type ItemParam = "old" | number;

function parseOperation(line: string, verbose = false): (old: number) => number {
    // Operation: new = old * 19
    // Operation: new = old * old
    // Operation: new = old + 6

    const operationLine = line.split("old ")[1].split(" ");
    const op: ItemOperations = operationLine[0] as ItemOperations;
    const paramString = operationLine[1];
    const param: ItemParam = paramString !== "old" ? parseInt(paramString, 10) : paramString;
    
    if (verbose) {
        console.log(`parseOperation: new = old ${op} ${param}`);
    }

    switch(op) {
        case "+":
            return (old: number) => param === "old" ? old + old : old + param;
        case "*":
            return (old: number) => param === "old" ? old * old : old * param;
    }
}

function processMonkeyMove(monkeys: Monkey[], results: number[], commonDivisor: number, m: number, i: number, verbose = false) {
    const monkey = monkeys[m];

    for (let item of monkey.items) {
        results[m]++;

        if (verbose) {
            console.log(`Round ${i}, item ${item}`);
        }
        
        // Monkey inspects item
        item = monkey.operation(item);

        if (verbose) {
            console.log(`Round ${i}, inspected ${item}`);
        }

        // Relief
        item = item % commonDivisor;

        if (verbose) {
            console.log(`Round ${i}, relief ${item}`);
        }

        // Monkey tests
        const testResult = monkey.test(item);

        if (verbose) {
            console.log(`Round ${i}, test result ${item}`);
        }

        // Monkey throws
        if (testResult) {
            monkeys[monkey.trueMonkey].items.push(item);

            if (verbose) {
                console.log(`Round ${i}, throwing ${item} to ${monkey.trueMonkey}`);
            }
        } else {
            monkeys[monkey.falseMonkey].items.push(item);

            if (verbose) {
                console.log(`Round ${i}, throwing ${item} to ${monkey.falseMonkey}`);
            }
        }
    }

    // Thrown away all items
    monkey.items = [];
}
