import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const lines = Unown.parseInput();

    // Parse directory structure into an object
    const directoryStructure = parseDirectoryStructure(lines);
    Missingno.log(`Final structure: ${JSON.stringify(directoryStructure)}`)

    const directorySizes = getDirectorySizes(directoryStructure, [], {});
    Missingno.log(`Sizes: ${JSON.stringify(directorySizes)}`)

    const curSize = directorySizes["/"];
    const spaceNeeded = curSize - 40000000;
    Missingno.log(`used: ${curSize}, needed: ${spaceNeeded}`);

    const dirsOverSpaceNeeded = Object.values(directorySizes).filter((s) => s > spaceNeeded);
    Missingno.log(`Sizes > needed: ${dirsOverSpaceNeeded}`)

    // Return the value
    return dirsOverSpaceNeeded.sort((a, b) => a - b)[0];
}

function parseDirectoryStructure(lines: string[]) {
    Missingno.log(`parseDirectoryStructure: ${lines}`)

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

                Missingno.log(`cd: ${pwd.slice(0,-1)} -> ${pwd}`)
            } else {
                // ls, nop
                Missingno.log(`ls: ${pwd}`)
            }
        } else if (line.startsWith("dir")) {
            const match = line.match(/dir (.*)/);
            const dir = match![1];

            Missingno.log(`dir: ${dir}`)

            addToStructure(directoryStructure, pwd, dir, {});
        } else {
            const match = line.match(/(\d+) (.*)/);
            const size = match![1];
            const file = match![2];

            Missingno.log(`file: ${file}, ${size}`)

            addToStructure(directoryStructure, pwd, file, parseInt(size, 10));
        }
    }

    return directoryStructure;
}

function addToStructure(structure: Folder, path: string[], name: string, item: File | Folder) {
    let curDir: Folder = structure;

    for (const hop of path) {
        Missingno.log(`hopping to ${hop}`);

        if (!curDir[hop]) {
            throw new Error(`Can't complete hop to ${hop}!`);
        }

        curDir = curDir[hop] as Folder;
    }

    Missingno.log(`adding ${name}:${JSON.stringify(item)} to ${JSON.stringify(curDir)}`);
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
