import { readFileSync } from "fs";
import { Missingno } from "./missingno";

/**
 * Unown
 * ---
 * Basic line parsing helpers to use for quickly splicing up inputs.
 */
export module Unown {
    export const ONE_LINE = /\r?\n/;
    export const TWO_LINES = /\r?\n\r?\n/;

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
         */
        parser?: RegExp | ((line: any) => T);

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

    export class UnownImpl<T = string> {
        private _path: string;
        private _options: LoadOptions<T>;

        public setPath(path: string) {
            Missingno.log(`setPath: ${path}`);

            this._path = path;
        }

        public setOptions(options: LoadOptions<T>) {
            Missingno.log(`setOptions: ${JSON.stringify(options)}`);

            this._options = options;
        }

        public parseInput(): T[] {
            // Get loader options
            const { splitter = ONE_LINE, parser, output } = this._options;

            Missingno.log(`parseInput: ${this._path}, splitter ${splitter}, parser ${parser}, output ${output}`);

            // First split
            const inputFile = readFileSync(this._path, 'utf-8');
            const firstSplitter = Array.isArray(splitter) ? splitter[0] : splitter;
    
            let lines: any[] = inputFile.replace(/\n$/, "").split(firstSplitter);
    
            // Second split
            if (Array.isArray(splitter)) {
                lines = lines.map((line) => line.split(splitter[1]));
            }
    
            if (parser) {
                if (typeof parser === "function") {
                    lines = lines.map((l) => this._execute(l, (l1) => parser(l1)));
                
                } else {
                    lines = lines.map((l) => this._execute(l, (l1) => {
                        const match = l1.match(parser);
                        return match![1] || match![0];
                    }));
                }
            }
    
            if (output === "number") {
                lines = lines.map((l) => this._execute(l, (l1) => parseInt(l1, 10)));
            } else if (output === "boolean") {
                lines = lines.map((l) => this._execute(l, (l1) => l1 === "true"));
            }
    
            return lines as T[];
        }

        private _execute(item: string|string[], fn: (l1: string) => any) {
            if (Array.isArray(item)) {
                return item.map(fn);
            } else {
                return fn(item);
            }
        }

        private static _instance: UnownImpl;
        
        public static Instance<T>(): UnownImpl<T> {
            if (!this._instance) {
                this._instance = new UnownImpl();
            }
    
            return this._instance as UnownImpl<T>;
        }
    }

    export function setInputFile(path: string) {
        UnownImpl.Instance().setPath(path);
    }

    export function parseInput<T = string>(options: LoadOptions<T> = {}) {
        const instance = UnownImpl.Instance<T>();
        instance.setOptions(options);
        return instance.parseInput();
    }
}