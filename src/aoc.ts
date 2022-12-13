#!/usr/bin/env node --loader ts-node/esm.mjs --require ./src/_remove_warnings.cjs
process.removeAllListeners('warning');

import yargs, { Argv, Arguments, CamelCaseKey } from "yargs";

import { Lotad } from './util/lotad';
import { Exeggutor } from './util/exeggutor';
import { Spectrier } from './util/spectrier';
import { Missingno } from "./util/missingno";

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
const yearOption = (yargs: Argv, required = false) => {
    const option = yargs.option('year', {
        describe: "The year of AoC to filter down to",
        type: 'number',
        alias: 'y',
        conflicts: ['path'],
    });

    if (required) {
        option.demandOption("year");
    }

    return option;
};

const baseOptions = (yargs: Argv) => {
    return yearOption(yargs).option('path', {
        describe: "Full path to filter down to",
        type: 'string',
        alias: 'p',
        conflicts: ['day', 'part']
    }).option('day', {
        describe: "The day of AoC to filter down to",
        type: 'number',
        alias: 'd',
        conflicts: ['path']
    }).option('part', {
        describe: "The part to filter down to",
        type: 'number',
        alias: 'n',
        conflicts: ['path']
    }).option('verbose', {
        describe: "Enable Missingno console logging",
        type: 'boolean',
        alias: ['v', 'V']
    }).help()
};

// Create run and test commands
const argv = yargs
    .command('bootstrap', "Bootstraps the next day's scripts, input and spec files.")
    .command('list', "List all script days available.", (yargs) => yearOption(yargs, true))
    .command('$0 [path]', "Run Advent of Code scripts. By default, will run all scripts in src.", baseOptions)
    .command('test [path]', "Run tests for AoC scripts.", baseOptions)
    .argv as { [key in keyof Arguments<RunnerArgs> as key | CamelCaseKey<key>]: Arguments<RunnerArgs>[key] };

const command = argv['_'][0];

// Enable verbose logging
if (argv.verbose) {
    Missingno.setVerbose();
    Missingno.log("\x1b[1m\x1b[36m[!] Verbose mode on.\x1b[0m");
    Missingno.log(JSON.stringify(argv));
}

// Determine advent files to run/test
let scripts: Exeggutor.Script[] = Lotad.getAllScripts(__dirname);
if (argv.path) {
    scripts = [Exeggutor.createScriptFromPath(argv.path)!];
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
if (command === "bootstrap") {
    Lotad.bootstrap(scripts);
} else if (command === "list") {
    const days = scripts.map((s) => s.day);
    console.log(JSON.stringify(days.filter((a, i) => days.indexOf(a) === i)));
} else if (command === "test") {
    Spectrier.executeTests(scripts);
} else {
    Exeggutor.executeScripts(scripts);
}
