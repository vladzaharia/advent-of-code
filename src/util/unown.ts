import { readFileSync } from "fs";
import { string } from "yargs";

/**
 * Unown
 * ---
 * Basic line parsing helpers to use for quickly splicing up inputs.
 */
export module Unown {
    export type Splitter = string | RegExp;

    export interface LoadOptions<T = string> {
        /** 
         * How to split input, defaults to single line break (/\r?\n/).
         * 
         * If RegExp array is passed in, will use map to further split lines.
         */
        splitter?: Splitter | Splitter[];

        /**
         * How to parse each line, defaults to no parsing.
         * 
         * If defined, will run in the following order:
         *  - `regexp`
         *  - `split`
         *  - `custom`
         */
        parser?: {
            /** 
             * Basic regex parsing, will use match[1] if available, match[0] otherwise.
             */
            regexp?: RegExp;

            /**
             * Basic .split parsing, will use split[1].
             */
            split?: string;

            /**
             * Custom parsing to use custom logic.
             */
            custom?: (line: string) => T;
        }

        /**
         * How to output each parsed line. If not defined, will keep as string or output of `parser.custom`.
         * 
         * If set, will use the following rules:
         *  - `number` applies `parseInt(line, 10)`
         *  - `boolean` will return `true` if the value is "true", false otherwise.
         * 
         * > Note: If setting this, please also set `T` to the same type for TS consistency.
         */
        output?: "number" | "boolean";
    }

    export function parseInput<T = string>(path: string, { splitter = /\r?\n/, parser, output }: LoadOptions<T> = {}): T[] {
        const inputFile = readFileSync(path, 'utf-8');

        const firstSplitter = Array.isArray(splitter) ? splitter[0] : splitter;

        let lines: any[] = inputFile.split(firstSplitter);

        // Multiple splits
        if (Array.isArray(splitter)) {
            for (let i = 1; i < splitter.length; i++) {
                lines = lines.map((line) => line.split(splitter[i]));
            }
        }

        if (parser) {
            if (parser.regexp) {
                lines = lines.map((l) => execute(l, (l1) => {
                    const match = l1.match(parser.regexp!);
                    return match![1] || match![0];
                }));
            }

            if (parser.split) {
                lines = lines.map((l) => execute(l, (l1) => l1.split(parser.split!)[1]));
            }

            if (parser.custom) {
                lines = lines.map((l) => execute(l, (l1) => parser.custom!(l1)));
            }
        }

        if (output === "number") {
            lines = lines.map((l) => execute(l, (l1) => parseInt(l1, 10)));
        } else if (output === "boolean") {
            lines = lines.map((l) => execute(l, (l1) => l1 === "true"));
        }

        return lines as T[];
    }

    function execute(item: string|string[], fn: (l1: string) => any) {
        if (Array.isArray(item)) {
            return item.map(fn);
        } else {
            return fn(item);
        }
    }
}