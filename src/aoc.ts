#!/usr/bin/env node --loader ts-node/esm.mjs

import yargs, { Argv, Arguments, CamelCaseKey } from "yargs";
import { copySync, writeFileSync } from 'fs-extra';
import axios from "axios";

import { Lotad } from './util/lotad';
import { Exeggutor } from './util/exeggutor';
import { Spectrier } from './util/spectrier';

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
    .command('bootstrap', "Bootstraps the next day's scripts, input and spec files.")
    .command('$0 [path]', "Run Advent of Code 2022 scripts. By default, will run all scripts in src.", baseOptions)
    .command('test [path]', "Run tests for AoC scripts.", baseOptions)
    .argv as { [key in keyof Arguments<RunnerArgs> as key | CamelCaseKey<key>]: Arguments<RunnerArgs>[key] };

// Enable verbose logging
if (argv.verbose) {
    console.info("\x1b[1m\x1b[36m[!] Verbose mode on.\x1b[0m");
    console.log(JSON.stringify(argv));
}

// Determine advent files to run/test
let scripts: Exeggutor.Script[] = Lotad.getAllScripts(__dirname, argv.verbose);
if (argv.path) {
    scripts = [Exeggutor.createScriptFromPath(argv.path, argv.verbose)!];
} else {
    if (argv.year) {
        scripts = scripts.filter((f) => f.year === argv.year);
    }
    if (argv.day) {
        scripts = scripts.filter((f) => f.day === argv.day);
    }
    if (argv.part) {
        scripts = scripts.filter((f) => f.part === argv.part);
    }
}

// Error out if no scripts are found
if (scripts.length === 0) {
    console.error("\x1b[1m\x1b[31m[X] No scripts found to execute!\x1b[0m");
    process.exit(2);
}

// Execute action
if (argv['_'][0] === "bootstrap") {
    Lotad.bootstrap(scripts);
} else if (argv['_'][0] === "test") {
    Spectrier.executeTests(scripts, argv.verbose);
} else {
    Exeggutor.executeScripts(scripts, argv.verbose);
}
