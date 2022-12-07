#!/usr/bin/env node --loader ts-node/esm.mjs

import yargs, { Argv, Arguments, CamelCaseKey } from "yargs";

import { copySync } from 'fs-extra';

/** Script Discovery */
import { getAllScripts } from './util/lotad';

/** Script runner */
import { AdventFile, executeScripts, getAdventFileFromPath, populateAdventFile } from './util/exeggutor';

/** Test runner */
import { executeTests } from './util/spectrier';

/**
 * Common arguments used across commands.
 */
interface RunnerArgs {
    path?: string;
    day?: number;
    part?: number;
    verbose?: boolean;
}

/**
 * Basic `yargs` options used across commands.
 */
const baseOptions = (yargs: Argv) => {
    return yargs.option('path', {
        describe: "Full path to run",
        type: 'string',
        alias: 'p',
        conflicts: ['day', 'part']
    }).option('year', {
        describe: "The year of AoC to run",
        type: 'number',
        alias: 'y',
        conflicts: ['path']
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
};

// Create run and test commands
const argv = yargs
    .command('$0 [path]', "Run Advent of Code 2022 scripts. By default, will run all scripts in src.", baseOptions)
    .command('test [path]', "Run tests for AoC scripts.", baseOptions)
    .command('bootstrap', "Bootstraps the next day's scripts, input and spec files.")
    .argv as { [key in keyof Arguments<RunnerArgs> as key | CamelCaseKey<key>]: Arguments<RunnerArgs>[key] };

// Enable verbose logging
if (argv.verbose) {
    console.info("\x1b[1m\x1b[36m[!] Verbose mode on.\x1b[0m");
    console.log(JSON.stringify(argv));
}

// Determine advent files to run/test
let adventFiles: AdventFile[] = getAllScripts(__dirname, argv.verbose);
if (argv.path) {
    adventFiles = [populateAdventFile({ ... getAdventFileFromPath(argv.path, argv.verbose)!, base: __dirname }, argv.verbose)];
} else {
    if (argv.year) {
        adventFiles = adventFiles.filter((f) => f.year === argv.year);
    }
    if (argv.day) {
        adventFiles = adventFiles.filter((f) => f.day === argv.day);
    }
    if (argv.part) {
        adventFiles = adventFiles.filter((f) => f.part === argv.part);
    }
}

if (adventFiles.length === 0) {
    console.error("\x1b[1m\x1b[31m[X] No files found to execute!\x1b[0m");
}

if (argv['_'][0] === "bootstrap") {
    const currentYear = Math.max(... adventFiles.map((f) => f.year!)).toString();
    const currentDay = (Math.max(... adventFiles.map((f) => f.day!)) + 1).toString().padStart(2, '0');

    // Copy files from _tmpl to next day's directory
    copySync(`${__dirname}/../_tmpl`, `${__dirname}/${currentYear}/${currentDay}`);
} else if (argv['_'][0] === "test") {
    executeTests(adventFiles, argv.verbose);
} else {
    // Run scripts
    executeScripts(adventFiles, argv.verbose);
}
