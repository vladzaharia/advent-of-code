export interface AdventFile {
    path?: string;
    base?: string;
    year?: number;
    day?: number;
    part?: number;
}

export async function executeScripts(scripts: AdventFile[], verbose = false) {
    if (verbose) {
        console.log(`executeScripts: ${JSON.stringify(scripts)}`);
    }

    scripts.forEach(async (f) => console.log(`${f.year}/${f.day} part${f.part}: ${await executeScript(f, undefined, verbose)}`));
}

export async function executeScript(script: AdventFile, inputFile?: string, verbose = false) {    
    if (verbose) {
        console.log(`executeScript: ${JSON.stringify(script)}`);
    }

    const { path } = script;

    const module = await import(path!);
    return module.main(inputFile, verbose);
}


export function populateAdventFile(script: AdventFile, verbose = false): AdventFile {
    if (verbose) {
        console.log(`populateAdventFile: ${JSON.stringify(script)}`);
    }

    const { base, year, day, part, path } = script;

    if (base && year && day && part) {
        script.path = `${base}/${year}/${day.toString().padStart(2, '0')}/part${part}.ts`;
    } else if (path) {
        script = getAdventFileFromPath(path, verbose) || script;
    }

    return script;
}

export function getAdventFileFromPath(path: string, verbose = false): AdventFile | undefined {
    if (verbose) {
        console.log(`getAdventFileFromPath: ${path}`)
    }

    const match = path.match(/(.*)(\/src\/)?(\d{4})\/(\d{2})\/part(\d).ts/);

    if (match) {
        return {
            path,
            base: match[1],
            year: parseInt(match[3], 10),
            day: parseInt(match[4], 10),
            part: parseInt(match[5], 10)
        }
    } else {
        throw new Error(`${path} is not a valid AoC path.`);
    }
}
