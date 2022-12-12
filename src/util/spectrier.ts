import { existsSync, readFileSync } from "fs";
import { Exeggutor } from "./exeggutor";

/**
 * Spectrier
 * ---
 * Test executor for AoC Typescript solutions. Will:
 *  - check a test is available (both `input.spec` and `part#.spec` exist and are non-empty)
 *  - imports and executes test using `Exeggutor`
 *  - compares result of operation to `part#.spec` to verify validity.
 */
export module Spectrier {
    export interface AdventFileTest {
        script: Exeggutor.Script;
        input: string;
        output: string;
    }
    
    export interface TestRun {
        script: Exeggutor.Script;
        result?: string;
        status: boolean;
        text: string;
    }
    
    export async function executeTests(scripts: Exeggutor.Script[], verbose = false) {
        const results: TestRun[] = [];
    
        // Run tests
        for (const file of scripts) {
            const res = await executeTest(file, verbose);
            results.push(res);
        }
    
        results.forEach((r) => console.log(`${r.script.year}/${r.script.day} part${r.script.part}: ${r.text}`));
    
        if (results.some((r) => !r.status)) {
            process.exit(1);
        }
    }
    
    async function executeTest(script: Exeggutor.Script, verbose = false): Promise<TestRun> {
        const testFile = getTestForAdventFile(script, verbose);
    
        if (testFile) {
            const result = await Exeggutor.executeScript(testFile.script, testFile.input, verbose);
            const expected = readFileSync(testFile.output, 'utf-8');
    
            const status = result == expected;
            let text = "";
    
            if (result == expected) {
                text = `\x1b[1m\x1b[32mSUCCESS\x1b[0m => ${result} = ${expected}`
            } else {
                text = `\x1b[1m\x1b[31mFAILED\x1b[0m => ${result} != ${expected}`
            }
        
            return {
                script,
                result,
                status,
                text
            }
        } else {
            // Log that the script is missing tests
            return {
                script,
                status: true,
                text: `\x1b[1m\x1b[33mMISSING\x1b[0m`
            };
        }
    }
    
    function getTestForAdventFile(script: Exeggutor.Script, verbose = false): AdventFileTest | undefined {
        if (verbose) {
            console.log(`getTestForAdventFile: ${JSON.stringify(script)}`);
        }
    
        const fileBase = script.path?.replace(".ts", "");
        const input = script.path!.replace(`part${script.part}.ts`, "input.spec");
        const output = `${fileBase}.spec`;
    
        if (existsSync(input) && existsSync(output) && readFileSync(input, "utf-8") !== "" && readFileSync(output, "utf-8") !== "") {
            return {
                script,
                input,
                output
            }
        }
    }
}
