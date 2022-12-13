import { existsSync } from "fs";
import { Missingno } from "./missingno";
import { Unown } from "./unown";

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
        skip: boolean;
    }
    
    export async function executeScripts(scripts: Script[]) {
        Missingno.log(`executeScripts: ${JSON.stringify(scripts)}`);
    
        scripts.forEach(async (f) => console.log(`${f.year}/${f.day} part${f.part}: ${await executeScript(f, undefined)}`));
    }
    
    export async function executeScript({ path, skip }: Script, inputFile?: string) {    
        Missingno.log(`executeScript: ${path}`);

        if (skip) {
            Missingno.log(`${path} marked as skipped`);
            return;
        }

        // Set input file
        if (!inputFile) {
            inputFile = path.replace("part1.ts", "input.txt").replace("part2.ts", "input.txt");
        }
        Missingno.log(`Setting input file to ${inputFile}`);
        Unown.setInputFile(inputFile);
        
        const module = await import(path);
        return module.main(inputFile);
    }
    
    export function createScriptFromPath(path: string): Script {
        Missingno.log(`createAdventFileFromPath: ${path}`)
    
        const match = path.match(/(.*)(\/src\/)?(\d{4})\/(\d{2})\/part(\d).ts/);
    
        if (match) {
            return {
                path,
                base: match[1],
                year: parseInt(match[3], 10),
                day: parseInt(match[4], 10),
                part: parseInt(match[5], 10),
                skip: existsSync(path.replace(".ts", ".SKIP"))
            }
        } else {
            throw new Error(`${path} is not a valid AoC path.`);
        }
    }    
}
