import { existsSync, readdirSync } from 'fs';
import { AdventFile, populateAdventFile } from './exeggutor';
import { AdventFileTest } from './spectrier';

export function getAllScripts(base: string, verbose = false): AdventFile[] {
    if (verbose) {
        console.log(`getAllScripts: ${base}`);
    }
    
    return getSubDirectories(base).flatMap((d) => getScriptsToRun(base, d, verbose), verbose);
}

export function getAllTests(base: string, verbose = false): AdventFileTest[] {
    if (verbose) {
        console.log(`getAllScripts: ${base}`);
    }
    
    return getSubDirectories(base).flatMap((d) => getTestFiles(base, d, verbose), verbose);
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

function getTestFiles(base: string, scriptsFolder: string, verbose = false): AdventFileTest[] {
    if (verbose) {
        console.log(`getTestFiles: ${base}/${scriptsFolder}`);
    }

    const files = readdirSync(`${base}/${scriptsFolder}`).filter((f) => f.match(/part\d\.ts/));

    return files.filter((file) => {
        const fileBase = `${base}/${scriptsFolder}/${file}`.replace('.ts', '');
        return existsSync(`${fileBase}.spec.in`) && existsSync(`${fileBase}.spec.out`);
    }).map((file) => {
        const fileBase = `${base}/${scriptsFolder}/${file}`.replace('.ts', '');
        return {
            script: populateAdventFile({ path: `${fileBase}.ts` }, verbose),
            input: `${fileBase}.spec.in`,
            output: `${fileBase}.spec.out`
        }
    });
}