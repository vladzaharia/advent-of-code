import { existsSync, readFileSync } from "fs";
import { AdventFile, executeAdventFile } from "./exeggutor";

export interface AdventFileTest {
    script: AdventFile;
    input: string;
    output: string;
}

export async function executeTestsForAdventFile(script: AdventFile, verbose = false) {
    const testFile = getTestForAdventFile(script, verbose);

    if (testFile) {
        const result = await executeAdventFile(testFile.script, testFile.input, verbose);
        const expected = readFileSync(testFile.output, 'utf-8');

        if (result == expected) {
            return `\x1b[1m\x1b[32mSUCCESS\x1b[0m => ${result} = ${expected}`
        }

        return `\x1b[1m\x1b[31mFAILED\x1b[0m => ${result} != ${expected}`
    } else {
        // Log that the script is missing tests
        return `\x1b[1m\x1b[33mMISSING\x1b[0m`;
    }
}

function getTestForAdventFile(script: AdventFile, verbose = false): AdventFileTest | undefined {
    if (verbose) {
        console.log(`getTestForAdventFile: ${script}`);
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