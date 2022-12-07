# Advent of Code

Solutions to [Advent of Code](https://adventofcode.com) problems.

## Running scripts

To run all scripts, use `./src/aoc.ts`.

Scripts executed can be filtered by year (`-y`), day (`-d`) or part (`-n`). Alternately, the full path to a script can be provided with `--path`.

You can see all the parameters that can be bassed in using `./src/aoc.ts --help`.

## Running tests

Tests consist of a `input.spec` file (as opposed to `input.txt`) as well as a `part#.spec` file representing the expected output. If both files exist and are not empty, Exeggutor will run the script against `input.spec` and Spectrier will compare the result against the `part#.spec` file.

Tests can be executed using `./src/aoc.ts test`, and all parameters to the script runner apply.

## Bootstrapping a new day

A skeleton template (found in `_tmpl`) can be quickly spun up for new days, using `./src/aoc.ts bootstrap`.
