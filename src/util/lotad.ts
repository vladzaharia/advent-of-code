import axios from 'axios';
import { readdirSync, writeFileSync } from 'fs';
import { copySync } from 'fs-extra';
import { Exeggutor } from './exeggutor';
import { Missingno } from './missingno';

/**
 * Lotad
 * ---
 * Script discovery for AoC scripts. Assumes:
 *  - Scripts are organized in subdirectories, src/`year`/`day`
 *  - Each subdirectory has:
 *    - `input.txt`
 *    - `part1.ts`
 *    - `part2.ts`
 *    - possibly `input.spec`
 *    - possibly `part1.spec`
 *    - possibly `part2.spec`
 */
export module Lotad {
    export function bootstrap(scripts: Exeggutor.Script[]) {
        const currentYear = Math.max(... scripts.map((f) => f.year)).toString();
        const currentDay = (Math.max(... scripts.map((f) => f.day)) + 1).toString().padStart(2, '0');

        // Copy files from _tmpl to next day's directory
        console.log(`Copying template to ${__dirname}/../${currentYear}/${currentDay}`);
        copySync(`${__dirname}/../../_tmpl`, `${__dirname}/../${currentYear}/${currentDay}`);

        // Download input file from AoC site
        const url = `https://adventofcode.com/${currentYear}/day/${currentDay}/input`;
        console.log(`Downloading input from ${url}`);
        axios.get(url, {
            headers: {
                "Cookie": `session=${process.env.COOKIE_SESSION}`,
                'User-Agent': 'vladzaharia/advent-of-code // accounts@vlad.gg'
            }
        }).then((resp) => {
            if (resp.status === 200) {
                writeFileSync(`${__dirname}/../${currentYear}/${currentDay}/input.txt`, resp.data);
            }
        })
    }

    export function getAllScripts(base: string): Exeggutor.Script[] {
        Missingno.log(`getAllScripts: ${base}`);
        
        return getSubDirectories(base)
            .flatMap((d) => getSubDirectories(`${base}/${d}`).map((dir) => `${d}/${dir}`))
            .flatMap((d) => getScriptsToRun(base, d));
    }
    
    function getSubDirectories(base: string): string[] {
        Missingno.log(`getAllScripts: ${base}`);
    
        return readdirSync(base, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .filter(dir => !dir.includes("util"));
    }
    
    function getScriptsToRun(base: string, scriptsFolder: string): Exeggutor.Script[] {
        Missingno.log(`getScriptsToRun: ${base}/${scriptsFolder}`);
    
        const files = readdirSync(`${base}/${scriptsFolder}`).filter((f) => f.match(/part\d\.ts/));
    
        return files.map((file) => {
            return Exeggutor.createScriptFromPath(`${base}/${scriptsFolder}/${file}`);
        });
    }
}
