/**
 * Exeggutor
 * ---
 * Script executor for AoC Typescript solutions. Will import and execute `AdventFile` and log results.
 */
export module Exeggutor {
    export interface Script {
        path: string;
        base: string;
        year: number;
        day: number;
        part: number;
    }
    
    export async function executeScripts(scripts: Script[], verbose = false) {
        if (verbose) {
            console.log(`executeScripts: ${JSON.stringify(scripts)}`);
        }
    
        scripts.forEach(async (f) => console.log(`${f.year}/${f.day} part${f.part}: ${await executeScript(f, undefined, verbose)}`));
    }
    
    export async function executeScript({ path }: Script, inputFile?: string, verbose = false) {    
        if (verbose) {
            console.log(`executeScript: ${path}`);
        }
        
        const module = await import(path);
        return module.main(inputFile, verbose);
    }
    
    export function createScriptFromPath(path: string, verbose = false): Script {
        if (verbose) {
            console.log(`createAdventFileFromPath: ${path}`)
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
}
