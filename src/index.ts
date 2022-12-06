#!/usr/bin/env node --loader ts-node/esm.mjs

import yargs, { Argv, Arguments, CamelCaseKey } from "yargs";
import { getAllScripts, executeAdventFile, getAdventFileFromPath, populateAdventFile } from './util/exeggutor';

interface RunnerArgs {
    path?: string;
    day?: number;
    part?: number;
    verbose?: boolean;
}

// Create run command
let argv = yargs
    .command('$0 [path]', "Run Advent of Code 2022 scripts. By default, will run all scripts in src.", (yargs: Argv) => {
        return yargs.option('path', {
            describe: "Full path to run",
            type: 'string',
            alias: 'p',
            conflicts: ['day', 'part']
        }).option('day', {
            describe: "The day of AoC to run",
            type: 'number',
            alias: 'd',
            conflicts: ['path']
        }).option('part', {
            describe: "The part to run",
            type: 'number',
            alias: 'n',
            conflicts: ['path']
        }).option('verbose', {
            describe: "Verbose logging",
            type: 'boolean',
            alias: ['v', 'V']
        }).help()
    }).argv as { [key in keyof Arguments<RunnerArgs> as key | CamelCaseKey<key>]: Arguments<RunnerArgs>[key] };

if (argv.verbose) {
    console.info("\x1b[1m\x1b[36m[!] Verbose mode on.\x1b[0m");
    console.log(JSON.stringify(argv));
}

if (argv.path) {
    // Execute the provided path, as long as it's a recognized AoC path
    executeAdventFile(populateAdventFile({ ... getAdventFileFromPath(argv.path, argv.verbose)!, base: __dirname }, argv.verbose), argv.verbose);
} else if (argv.day && argv.part) {
    // Create advent file based off day and part
    executeAdventFile(populateAdventFile({ 
        base: __dirname,
        day: argv.day,
        part: argv.part
    }, argv.verbose), argv.verbose);
} else {
    // No arguments, run all scripts
    getAllScripts(__dirname, argv.verbose).forEach(async (f) => await executeAdventFile(f, argv.verbose));
}
