#!/usr/bin/env node --loader ts-node/esm.mjs

import yargs, { Argv, Arguments, CamelCaseKey } from "yargs";
import { getAllScripts, executeAdventFile, getAdventFileFromPath, populateAdventFile } from './util/exeggutor';

interface RunnerArgs {
    path?: string;
    day?: number;
    part?: number;
    verbose?: boolean;
}

let argv = yargs
    .command('run', "Run scripts.", (yargs: Argv) => {
        return yargs.option('path', {
            describe: "Full path to run",
            type: 'string',
            alias: 'p'
        }).option('day', {
            describe: "The day of AoC to run",
            type: 'number',
            alias: 'd'
        }).option('part', {
            describe: "The part to run",
            type: 'number',
            alias: 'n'
        }).option('verbose', {
            describe: "Verbose logging",
            type: 'boolean',
            alias: 'v'
        }).help()
    }).demandCommand(1).argv as { [key in keyof Arguments<RunnerArgs> as key | CamelCaseKey<key>]: Arguments<RunnerArgs>[key] };

if (argv.verbose) {
    // TODO: pass through a verbose flag into all the main functions
    console.info("Verbose mode on.");
}

if (argv.path) {
    executeAdventFile(populateAdventFile({ ... getAdventFileFromPath(argv.path, argv.verbose)!, base: __dirname }, argv.verbose), argv.verbose);
} else if (argv.day && argv.part) {
    executeAdventFile(populateAdventFile({ 
        base: __dirname,
        day: argv.day,
        part: argv.part
    }, argv.verbose), argv.verbose);
} else {
    getAllScripts(__dirname, argv.verbose).forEach(async (f) => await executeAdventFile(f, argv.verbose));
}
