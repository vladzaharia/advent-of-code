export interface AdventFile {
    path?: string;
    base?: string;
    year?: number;
    day?: number;
    part?: number;
}

export function populateAdventFile(file: AdventFile, verbose = false): AdventFile {
    if (verbose) {
        console.log(`populateAdventFile: ${JSON.stringify(file)}`);
    }

    const { base, year, day, part, path } = file;

    if (base && year && day && part) {
        file.path = `${base}/${year}/${day.toString().padStart(2, '0')}/part${part}.ts`;
    } else if (path) {
        file = getAdventFileFromPath(path, verbose) || file;
    }

    return file;
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

export async function executeAdventFile(file: AdventFile, inputFile?: string, verbose = false) {    
    if (verbose) {
        console.log(`executeAdventFile: ${JSON.stringify(file)}`);
    }

    const { path } = file;

    const module = await import(path!);
    return module.main(inputFile, verbose);
}

