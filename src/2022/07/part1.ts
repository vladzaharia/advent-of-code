import { Unown } from '../../util/unown';

export function main(input: string = `${__dirname}/input.txt`, verbose = false) {
    const lines = Unown.parseInput(input);

    // Parse directory structure into an object
    const directoryStructure = parseDirectoryStructure(lines, verbose);

    if (verbose) {
        console.log(`Final structure: ${JSON.stringify(directoryStructure)}`)
    }

    const directorySizes = getDirectorySizes(directoryStructure, [], {});

    if (verbose) {
        console.log(`Sizes: ${JSON.stringify(directorySizes)}`)
    }    

    const sizesUnder100000 = Object.values(directorySizes).filter((s) => s < 100000);

    if (verbose) {
        console.log(`Sizes < 100000: ${sizesUnder100000}`)
    }

    // Return the value
    return sizesUnder100000.reduce((p, c) => p + c);
}

function parseDirectoryStructure(lines: string[], verbose = false) {
    if (verbose) {
        console.log(`parseDirectoryStructure: ${lines}`)
    }

    const directoryStructure: Folder = { "/": {} };
    const pwd: string[] = [];

    for (const line of lines) {
        if (line.startsWith("$")) {
            const match = line.match(/\$ (cd|ls)(?: (.*))?/);
            const cmd = match![1];
            const dest = match![2];

            if (cmd === "cd") {
                // changing directories
                if (dest === "..") {
                    // move up
                    pwd.pop();
                } else {
                    pwd.push(dest);
                }

                if (verbose) {
                    console.log(`cd: ${pwd.slice(0,-1)} -> ${pwd}`)
                }
            } else { 
                // ls, nop
                if (verbose) {
                    console.log(`ls: ${pwd}`)
                }
            }
        } else if (line.startsWith("dir")) {
            const match = line.match(/dir (.*)/);
            const dir = match![1];

            if (verbose) {
                console.log(`dir: ${dir}`)
            }

            addToStructure(directoryStructure, pwd, dir, {}, verbose);
        } else {
            const match = line.match(/(\d+) (.*)/);
            const size = match![1];
            const file = match![2];

            if (verbose) {
                console.log(`file: ${file}, ${size}`)
            }

            addToStructure(directoryStructure, pwd, file, parseInt(size, 10), verbose);
        }
    }

    return directoryStructure;
}

function addToStructure(structure: Folder, path: string[], name: string, item: File | Folder, verbose = false) {
    let curDir: Folder = structure;

    for (const hop of path) {
        if (verbose) {
            console.log(`hopping to ${hop}`);
        }

        if (!curDir[hop]) {
            throw new Error(`Can't complete hop to ${hop}!`);
        }

        curDir = curDir[hop] as Folder;
    }

    if (verbose) {
        console.log(`adding ${name}:${JSON.stringify(item)} to ${JSON.stringify(curDir)}`);
    }
    curDir[name] = item;

    return structure;
}

interface DirectorySize {
    [key: string]: number;
}

function getDirectorySizes(structure: Folder, pwd: string[], acc: DirectorySize = {}): DirectorySize {
    for (const key of Object.keys(structure)) {
        const item = structure[key];

        if (typeof item === "number") {
            // nop
        } else {
            const path = [... pwd, key];
            acc[path.join(",")] = getDirectorySize(item);
            getDirectorySizes(item, path, acc);
        }
    }

    return acc;
}

function getDirectorySize(structure: Folder): number {
    let curSize = 0;

    for (const key of Object.keys(structure)) {
        const item = structure[key];

        if (typeof item === "number") {
            curSize += item;
        } else {
            curSize += getDirectorySize(item);
        }
    }

    return curSize;
}

type File = number;

interface Folder {
    [key: string]: File | Folder;
}
