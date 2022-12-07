import { readdirSync } from 'fs';
import { AdventFile, populateAdventFile } from './exeggutor';

export function getAllScripts(base: string, verbose = false): AdventFile[] {
    if (verbose) {
        console.log(`getAllScripts: ${base}`);
    }
    
    return getSubDirectories(base)
        .flatMap((d) => getSubDirectories(`${base}/${d}`).map((dir) => `${d}/${dir}`))
        .flatMap((d) => getScriptsToRun(base, d, verbose), verbose);
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
