import { readdirSync } from 'fs';

export interface AdventFile {
    path?: string;
    base?: string;
    day?: number;
    part?: number;
}

export function getAllScripts(base: string): AdventFile[] {
    return getSubDirectories(base).flatMap((d) => getScriptsToRun(base, d));
}

function getSubDirectories(base: string): string[] {
    return readdirSync(base, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(dir => !dir.includes("util"));
}

function getScriptsToRun(base: string, scriptsFolder: string): AdventFile[] {
    const files = readdirSync(`${base}/${scriptsFolder}`).filter((f) => f.match(/part\d\.ts/));

    return files.map((file) => {
        return populateAdventFile({ path: `${base}/${scriptsFolder}/${file}` });
    });
}

function populateAdventFile(file: AdventFile): AdventFile {
    const {base, day, part, path} = file;
    
    if (base && day && part) {
        file.path = `${base}/${day.toString().padStart(2, '0')}/part${part}.ts`;
    } else if (path) {
        file = getAdventFileFromPath(path) || file;
    }

    return file;
}

export function getAdventFileFromPath(path: string): AdventFile | undefined {
    const match = path.match(/(.*)\/src\/(\d{2})\/part(\d).ts/);

    if (match) {
        return {
            path,
            base: match[1],
            day: parseInt(match[2], 10),
            part: parseInt(match[3], 10)
        }
    }
}

export async function executeAdventFile({day, part, path}: AdventFile) {
    const module = await import(path!);
    console.log(`Day ${day}, Part ${part}: ${module.main()}`);
}

