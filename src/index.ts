import * as fs from 'fs';
import { exec } from 'child_process';
import * as async from 'async';

// Get all script directories
const directories = fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const funcs: any[] = [];

// Get all TS scripts within each directory
directories.forEach((scriptsFolder) => {
    const files = fs.readdirSync(`${__dirname}/${scriptsFolder}`).filter((f) => f.includes(".ts"));

    // Run `node` on each TS file
    funcs.push(...files.map(function (file) {
        return exec.bind(null, `node --loader ts-node/esm.mjs ${__dirname}/${scriptsFolder}/${file}`);
    }));
})

// Add extra line
console.log();

async.parallel(funcs, (err: Error | null | undefined, data: any) => {
    // Print out errors
    if (err) {
        return console.error(err);
    }

    // Remove experimental warning lines
    data = data.map((lines: string[]) => lines.filter((line) => !line.includes("ExperimentalWarning") || !line.includes("node --trace-warnings ...")));

    // Print out results
    data.forEach((lines: string[]) => {
        console.log(lines.join('').replace("\n", ""));
    });
});
