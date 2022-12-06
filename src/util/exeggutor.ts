import { readdirSync } from 'fs';

export interface AdventFile {
    path?: string;
    base?: string;
    day?: number;
    part?: number;
}

export function getAllScripts(base: string, verbose = false): AdventFile[] {
    if (verbose) {
        console.log(`getAllScripts: ${base}`);
    }
    
    return getSubDirectories(base).flatMap((d) => getScriptsToRun(base, d, verbose), verbose);
}

function getSubDirectories(base: string, verbose = false): string[] {
    if (verbose) {
        console.log(`getAllScripts: ${base}`);
    }

    return readdirSync(base, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(dir => !dir.includes("util"));
}

function getScriptsToRun(base: string, scriptsFolder: string, verbose = false): AdventFile[] {
    if (verbose) {
        console.log(`getScriptsToRun: ${base}/${scriptsFolder}`);
    }

    const files = readdirSync(`${base}/${scriptsFolder}`).filter((f) => f.match(/part\d\.ts/));

    return files.map((file) => {
        return populateAdventFile({ path: `${base}/${scriptsFolder}/${file}` }, verbose);
    });
}

export function populateAdventFile(file: AdventFile, verbose = false): AdventFile {
    if (verbose) {
        console.log(`populateAdventFile: ${JSON.stringify(file)}`);
    }

    const { base, day, part, path } = file;

    if (base && day && part) {
        file.path = `${base}/${day.toString().padStart(2, '0')}/part${part}.ts`;
    } else if (path) {
        file = getAdventFileFromPath(path, verbose) || file;
    }

    return file;
}

export function getAdventFileFromPath(path: string, verbose = false): AdventFile | undefined {
    if (verbose) {
        console.log(`getAdventFileFromPath: ${path}`)
    }

    const match = path.match(/(.*)(\/src\/)?(\d{2})\/part(\d).ts/);

    if (match) {
        return {
            path,
            base: match[1],
            day: parseInt(match[3], 10),
            part: parseInt(match[4], 10)
        }
    }
}

export async function executeAdventFile(file: AdventFile, verbose = false) {    
    if (verbose) {
        console.log(`executeAdventFile: ${JSON.stringify(file)}`);
    }

    const { day, part, path } = file;

    const module = await import(path!);
    console.log(`Day ${day}, Part ${part}: ${module.main(verbose)}`);
}

